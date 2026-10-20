// Third-party
import { FieldValue } from 'firebase-admin/firestore'

// Services
import { findPriceIncreases } from '../notifications/messages.js'
import { downloadFile, findQuoteFiles } from './drive.js'
import { parseQuotePdf } from './parseQuote.js'


// First run backfills this much history.
const BACKFILL_DAYS = 90

// Later runs look back this far to catch quotes published late.
const LOOKBACK_DAYS = 10

// Firestore allows 500 operations per batch.
const BATCH_SIZE = 450


// Must stay identical to the ids already stored in Firestore
// (originally created by the web app's spreadsheet import).
export const normalizeProductId = name =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[()/]/g, '')


// Dates are handled as Brazil-local ISO days ("2026-10-19").
export const toLocalIsoDate = date =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo'
  }).format(date)

export const addDays = (isoDate, days) => {
  const date = new Date(`${isoDate}T12:00:00Z`)

  date.setUTCDate(date.getUTCDate() + days)

  return date.toISOString().slice(0, 10)
}


// Applies one quote to a product's price summary. Quotes may arrive
// in any order (backfill, late files), so this keeps `latestPrice` as
// the newest quote and `previousPrice` as the one right before it.
export function mergeQuote(summary, quote) {
  const { latestPrice = null, previousPrice = null } = summary ?? {}

  if (!latestPrice || quote.fileDate > latestPrice.fileDate) {
    return {
      latestPrice: quote,
      previousPrice: latestPrice
        ? { average: latestPrice.average, fileDate: latestPrice.fileDate }
        : previousPrice
    }
  }

  if (quote.fileDate === latestPrice.fileDate) {
    return { latestPrice: quote, previousPrice }
  }

  if (!previousPrice || quote.fileDate > previousPrice.fileDate) {
    return {
      latestPrice,
      previousPrice: { average: quote.average, fileDate: quote.fileDate }
    }
  }

  return { latestPrice, previousPrice }
}


async function commitInBatches(db, writes) {
  for (let start = 0; start < writes.length; start += BATCH_SIZE) {
    const batch = db.batch()

    writes
      .slice(start, start + BATCH_SIZE)
      .forEach(([ref, data, options]) => batch.set(ref, data, options ?? {}))

    await batch.commit()
  }
}


// Imports every CEASA quote not imported yet.
//
// Safe to run repeatedly: history docs are keyed by date, and a date
// is only marked as imported (ceasaImports/{date}) after everything
// else is written, so an interrupted run is simply redone.
export async function syncCeasaPrices({ db, logger, now = new Date() }) {
  const importsRef = db.collection('ceasaImports')

  const isFirstRun =
    (await importsRef.limit(1).get()).empty

  const until = toLocalIsoDate(now)
  const since = addDays(until, -(isFirstRun ? BACKFILL_DAYS : LOOKBACK_DAYS))

  const files = await findQuoteFiles({ since, until })

  const importedDates = new Set(
    (await importsRef.where('fileDate', '>=', since).get())
      .docs.map(doc => doc.id)
  )

  const pending = files.filter(file => !importedDates.has(file.fileDate))

  logger.info('CEASA sync', {
    since,
    until,
    found: files.length,
    pending: pending.length
  })

  if (pending.length === 0) {
    return { importedDates: [], updatedProducts: 0, priceIncreases: [] }
  }

  const productsSnap = await db.collection('products').get()

  const products = new Map(
    productsSnap.docs.map(doc => [doc.id, doc.data()])
  )

  // productId -> fields to write at the end of the run
  const touched = new Map()
  const importMarkers = []

  for (const file of pending) {
    const quote = await parseQuotePdf(await downloadFile(file.id))

    if (quote.fileDate && quote.fileDate !== file.fileDate) {
      logger.warn('Quote date differs from file name', {
        fileName: file.name,
        pdfDate: quote.fileDate
      })
    }

    // The file name decides the date, so idempotency keys stay stable.
    const fileDate = file.fileDate

    const historyWrites = []

    for (const row of quote.rows) {
      const productId = normalizeProductId(row.name)

      const price = {
        average: row.average,
        min: row.min,
        max: row.max,
        fileDate
      }

      historyWrites.push([
        db.doc(`prices/${productId}/history/${fileDate}`),
        {
          ...price,
          source: 'ceasa',
          uploadedAt: FieldValue.serverTimestamp()
        }
      ])

      const current = products.get(productId)
      const merged = mergeQuote(current, price)

      products.set(productId, { ...current, ...merged })

      touched.set(productId, {
        ...(current
          ? {}
          : { name: row.name, createdAt: FieldValue.serverTimestamp() }),
        unit: row.unit,
        category: row.category,
        ...merged,
        priceUpdatedAt: FieldValue.serverTimestamp()
      })
    }

    await commitInBatches(db, historyWrites)

    importMarkers.push([
      importsRef.doc(fileDate),
      {
        fileDate,
        fileId: file.id,
        fileName: file.name,
        rowCount: quote.rows.length,
        skippedRows: quote.skipped,
        importedAt: FieldValue.serverTimestamp()
      }
    ])

    logger.info('Parsed quote', {
      fileName: file.name,
      rows: quote.rows.length,
      skipped: quote.skipped
    })
  }

  await commitInBatches(db, [
    ...[...touched].map(([productId, data]) => [
      db.doc(`products/${productId}`),
      data,
      { merge: true }
    ]),
    ...importMarkers
  ])

  const latestFileDate = pending.at(-1).fileDate

  // Only rises in the newest quote matter for notifications.
  const priceIncreases = findPriceIncreases(
    [...touched].map(([productId, data]) => ({
      productId,
      name: products.get(productId)?.name ?? data.name,
      latestPrice: data.latestPrice,
      previousPrice: data.previousPrice
    })),
    latestFileDate
  )

  return {
    importedDates: pending.map(file => file.fileDate),
    updatedProducts: touched.size,
    priceIncreases
  }
}
