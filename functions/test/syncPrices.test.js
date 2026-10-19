// Node
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Services
import {
  mergeQuote,
  normalizeProductId,
  toLocalIsoDate
} from '../src/ceasa/syncPrices.js'


const quote = (fileDate, average) => ({
  average,
  min: average,
  max: average,
  fileDate
})


test('first quote becomes the latest price', () => {
  assert.deepEqual(
    mergeQuote(undefined, quote('2026-10-19', 4)),
    { latestPrice: quote('2026-10-19', 4), previousPrice: null }
  )
})

test('a newer quote pushes the latest one to previous', () => {
  const summary = mergeQuote(undefined, quote('2026-10-16', 5))

  assert.deepEqual(
    mergeQuote(summary, quote('2026-10-19', 4)),
    {
      latestPrice: quote('2026-10-19', 4),
      previousPrice: { average: 5, fileDate: '2026-10-16' }
    }
  )
})

test('an older quote (backfill) only fills previous when closer', () => {
  let summary = mergeQuote(undefined, quote('2026-10-19', 4))

  summary = mergeQuote(summary, quote('2026-10-14', 6))
  summary = mergeQuote(summary, quote('2026-10-16', 5))
  summary = mergeQuote(summary, quote('2026-10-01', 9))

  assert.deepEqual(summary, {
    latestPrice: quote('2026-10-19', 4),
    previousPrice: { average: 5, fileDate: '2026-10-16' }
  })
})

test('re-importing the same day replaces it without shifting', () => {
  let summary = mergeQuote(undefined, quote('2026-10-16', 5))

  summary = mergeQuote(summary, quote('2026-10-19', 4))
  summary = mergeQuote(summary, quote('2026-10-19', 4.2))

  assert.deepEqual(summary, {
    latestPrice: quote('2026-10-19', 4.2),
    previousPrice: { average: 5, fileDate: '2026-10-16' }
  })
})

test('product ids match the ones already stored', () => {
  assert.equal(normalizeProductId('Alface Crespa'), 'alface_crespa')
  assert.equal(normalizeProductId('Maçã Gala'), 'maca_gala')
  assert.equal(normalizeProductId('Milho Verde(3UN)'), 'milho_verde3un')
  assert.equal(normalizeProductId('Erva Doce / Funcho'), 'erva_doce__funcho')
})

test('dates use Brazil time, not UTC', () => {
  // 01:30 UTC on the 20th is still the 19th in São Paulo.
  assert.equal(toLocalIsoDate(new Date('2026-10-20T01:30:00Z')), '2026-10-19')
})
