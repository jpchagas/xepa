// Node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// Services
import {
  formatCategory,
  parsePrice,
  parseQuotePdf
} from '../src/ceasa/parseQuote.js'


const fixture = readFileSync(
  new URL('./fixtures/cotacao-2026-10-19.pdf', import.meta.url)
)


test('parses the quote date and every traded row', async () => {
  const quote = await parseQuotePdf(fixture)

  assert.equal(quote.fileDate, '2026-10-19')

  // 295 rows in the PDF; 13 have R$ 0.00 (no trade that day).
  assert.equal(quote.rows.length, 282)
  assert.equal(quote.skipped, 13)
})

test('reads name, unit, prices and category of a row', async () => {
  const { rows } = await parseQuotePdf(fixture)

  assert.deepEqual(
    rows.find(row => row.name === 'Abobora'),
    {
      name: 'Abobora',
      unit: 'KG',
      category: 'Verduras e Legumes',
      max: 4.5,
      average: 4,
      min: 2.5
    }
  )
})

test('keeps units that contain spaces', async () => {
  const { rows } = await parseQuotePdf(fixture)

  const eggs = rows.find(row => row.name === 'Ovo Branco CX30DZ')

  assert.equal(eggs.unit, 'CX 30B/30U')
  assert.equal(eggs.average, 160)
})

test('never returns zero or inconsistent prices', async () => {
  const { rows } = await parseQuotePdf(fixture)

  for (const row of rows) {
    assert.ok(row.average > 0, row.name)
    assert.ok(row.min <= row.average && row.average <= row.max, row.name)
  }

  assert.equal(rows.find(row => row.name === 'Fava'), undefined)
})

test('assigns the section headers as categories', async () => {
  const { rows } = await parseQuotePdf(fixture)

  assert.deepEqual(
    [...new Set(rows.map(row => row.category))],
    [
      'Verduras e Legumes',
      'Frutas',
      'Central de Flores',
      'Carnes',
      'Pescados e Frutos do Mar',
      'Diversos'
    ]
  )
})

test('parsePrice handles dot and comma formats', () => {
  assert.equal(parsePrice('R$ 4.50'), 4.5)
  assert.equal(parsePrice('R$ 1,234.50'), 1234.5)
  assert.equal(parsePrice('R$ 4,50'), 4.5)
  assert.ok(Number.isNaN(parsePrice('4.50')))
})

test('formatCategory keeps connector words lowercase', () => {
  assert.equal(formatCategory('PESCADOS E FRUTOS DO MAR'), 'Pescados e Frutos do Mar')
})
