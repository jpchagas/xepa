// Reads CEASA/RS's public Google Drive folder.
//
// Uses Drive's public "embedded folder view" page and the public
// download link, so no API key or Drive API setup is needed. These
// are not official APIs: if Google changes the page, listing throws
// (instead of silently finding nothing) and the import is reported
// as failed. Swapping to the Drive API only touches this file.

// Public folder kept by CEASA/RS: year -> "MM/AAAA Mês" -> "Cotacao DD/MM/AAAA.pdf"
export const CEASA_ROOT_FOLDER_ID = '1vZyolxqYtOdNegTXJsYJ811lPlmRQu1z'

const USER_AGENT = 'Mozilla/5.0 (compatible; XepaBot/1.0)'

const ENTRY = /<a href="([^"]+)"[^>]*>[\s\S]*?<div class="flip-entry-title">([\s\S]*?)<\/div>/g
const FOLDER_LINK = /\/drive\/folders\/([\w-]+)/
const FILE_LINK = /\/file\/d\/([\w-]+)/
const QUOTE_FILE_NAME = /(\d{2})\/(\d{2})\/(\d{4})\.pdf$/i


const decodeHtml = text =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim()


// Exported for tests.
export function parseFolderHtml(html) {
  const entries = []

  for (const [, href, title] of html.matchAll(ENTRY)) {
    const folder = href.match(FOLDER_LINK)
    const file = href.match(FILE_LINK)

    if (!folder && !file) continue

    entries.push({
      id: (folder ?? file)[1],
      name: decodeHtml(title),
      isFolder: !!folder
    })
  }

  return entries
}


export async function listFolder(folderId) {
  const response = await fetch(
    `https://drive.google.com/embeddedfolderview?id=${folderId}`,
    { headers: { 'User-Agent': USER_AGENT } }
  )

  if (!response.ok) {
    throw new Error(`Drive folder ${folderId} returned HTTP ${response.status}`)
  }

  return parseFolderHtml(await response.text())
}


export async function downloadFile(fileId) {
  const response = await fetch(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    { headers: { 'User-Agent': USER_AGENT } }
  )

  if (!response.ok) {
    throw new Error(`Drive file ${fileId} returned HTTP ${response.status}`)
  }

  const data = Buffer.from(await response.arrayBuffer())

  // An HTML page here means Google served an interstitial, not the PDF.
  if (data.subarray(0, 5).toString() !== '%PDF-') {
    throw new Error(`Drive file ${fileId} did not return a PDF`)
  }

  return data
}


// "Cotacao 19/10/2026.pdf" -> "2026-10-19"
export function getQuoteDate(fileName) {
  const match = fileName.match(QUOTE_FILE_NAME)

  if (!match) return null

  const [, day, month, year] = match

  return `${year}-${month}-${day}`
}


// Months touched by [since, until], as { year: '2026', month: '10' }.
function monthsBetween(since, until) {
  const months = []
  const cursor = new Date(`${since.slice(0, 7)}-01T00:00:00Z`)
  const end = new Date(`${until.slice(0, 7)}-01T00:00:00Z`)

  while (cursor <= end) {
    months.push({
      year: String(cursor.getUTCFullYear()),
      month: String(cursor.getUTCMonth() + 1).padStart(2, '0')
    })

    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  }

  return months
}


// Quote PDFs dated within [since, until] (ISO dates), oldest first.
export async function findQuoteFiles({ since, until }) {
  const years = await listFolder(CEASA_ROOT_FOLDER_ID)

  if (years.length === 0) {
    throw new Error('CEASA root folder listing is empty; the Drive page may have changed.')
  }

  const months = monthsBetween(since, until)
  const files = []

  for (const year of new Set(months.map(entry => entry.year))) {
    const yearFolder = years.find(
      entry => entry.isFolder && entry.name === year
    )

    // A new year's folder may not exist yet in early January.
    if (!yearFolder) continue

    const monthFolders = await listFolder(yearFolder.id)

    for (const { month } of months.filter(entry => entry.year === year)) {
      // Folder names look like "10/2026 Outubro".
      const monthFolder = monthFolders.find(
        entry =>
          entry.isFolder &&
          entry.name.startsWith(`${month}/${year}`)
      )

      if (!monthFolder) continue

      for (const entry of await listFolder(monthFolder.id)) {
        const fileDate = getQuoteDate(entry.name)

        if (
          !entry.isFolder &&
          fileDate &&
          fileDate >= since &&
          fileDate <= until
        ) {
          files.push({ id: entry.id, name: entry.name, fileDate })
        }
      }
    }
  }

  return files.sort((a, b) => a.fileDate.localeCompare(b.fileDate))
}
