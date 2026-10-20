// Third-party
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'


// Parses a CEASA/RS "Boletim Informativo de Preços" PDF.
//
// The PDF is generated from HTML (one text item per table cell), so a
// price row is a visual line with exactly 5 cells:
//   Produto | UND | R$ MAX | R$ MAIS FREQUENTE | R$ MÍNIMO
// and a category ("FRUTAS") is a line with a single uppercase cell.

const PRICE_CELL = /^R\$\s*([\d.,]+)$/
const DATE_CELL = /^(\d{2})\/(\d{2})\/(\d{4})$/
const UPPERCASE_LINE = /^[A-ZÀ-ÖØ-Ý\s]+$/

// Repeated on every page; never a category.
const PAGE_HEADER = 'BOLETIM INFORMATIVO DE PREÇOS'

const MINOR_WORDS = new Set(['e', 'de', 'do', 'da', 'dos', 'das'])


// "R$ 4.50" -> 4.5. Also accepts "1,234.50" and "4,50".
export function parsePrice(text) {
  const match = String(text).trim().match(PRICE_CELL)

  if (!match) return NaN

  let value = match[1]

  if (value.includes(',') && !value.includes('.')) {
    value = value.replace(',', '.')
  } else {
    value = value.replace(/,/g, '')
  }

  return Number(value)
}


// "PESCADOS E FRUTOS DO MAR" -> "Pescados e Frutos do Mar"
export function formatCategory(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) =>
      index > 0 && MINOR_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
}


// Groups the PDF's text items into lines (top to bottom), each a list
// of cell texts (left to right).
async function readLines(data) {
  const loadingTask = getDocument({
    data: new Uint8Array(data),
    verbosity: 0,
    isEvalSupported: false
  })

  const pdf = await loadingTask.promise

  const lines = []

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber)
      const { items } = await page.getTextContent()

      const rows = new Map()

      for (const item of items) {
        const text = item.str?.trim()

        if (!text) continue

        // Cells of one row share a baseline; round away float noise.
        const y = Math.round(item.transform[5])
        const x = item.transform[4]

        if (!rows.has(y)) rows.set(y, [])

        rows.get(y).push({ x, text })
      }

      ;[...rows.entries()]
        .sort(([a], [b]) => b - a)
        .forEach(([, cells]) => {
          lines.push(
            cells
              .sort((a, b) => a.x - b.x)
              .map(cell => cell.text)
          )
        })
    }
  } finally {
    await loadingTask.destroy()
  }

  return lines
}


function findQuoteDate(lines) {
  for (const cells of lines) {
    if (cells[0] !== 'Data:') continue

    const match = cells
      .map(cell => cell.match(DATE_CELL))
      .find(Boolean)

    if (match) {
      const [, day, month, year] = match
      return `${year}-${month}-${day}`
    }
  }

  return null
}


// Returns { fileDate, rows, skipped, skippedRows }.
// Skipped rows have no trade that day (R$ 0.00) or inconsistent prices;
// they're left out of `rows` so they don't overwrite a product's last
// real price. `skippedRows` lists them ({ name, unit, category }).
export async function parseQuotePdf(data) {
  const lines = await readLines(data)

  const rows = []
  const skippedRows = []
  let category = null
  let inTable = false

  for (const cells of lines) {
    if (cells[0] === 'Produto') {
      inTable = true
      continue
    }

    if (!inTable) continue

    if (
      cells.length === 5 &&
      cells.slice(2).every(cell => PRICE_CELL.test(cell))
    ) {
      const [name, unit, maxText, averageText, minText] = cells

      const max = parsePrice(maxText)
      const average = parsePrice(averageText)
      const min = parsePrice(minText)

      const isValid =
        [max, average, min].every(Number.isFinite) &&
        average > 0 &&
        min <= average &&
        average <= max

      if (isValid) {
        rows.push({ name, unit, category, max, average, min })
      } else {
        skippedRows.push({ name, unit, category })
      }

      continue
    }

    if (
      cells.length === 1 &&
      cells[0] !== PAGE_HEADER &&
      UPPERCASE_LINE.test(cells[0])
    ) {
      category = formatCategory(cells[0])
    }
  }

  if (rows.length === 0) {
    throw new Error('No price rows found; the PDF layout may have changed.')
  }

  return {
    fileDate: findQuoteDate(lines),
    rows,
    skipped: skippedRows.length,
    skippedRows
  }
}
