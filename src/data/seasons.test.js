// Node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// Data
import { FOOD_PRODUCTS, SEASONS } from './seasons.js'

// Services
import { parseQuotePdf } from '../../functions/src/ceasa/parseQuote.js'

// Utils
import { getSeason, getSeasonalProductIds } from '../utils/seasonHelpers.js'


const quote = await parseQuotePdf(
  readFileSync(
    new URL('../../functions/test/fixtures/cotacao-2026-10-19.pdf', import.meta.url)
  )
)

const ceasaNames = new Set(
  [...quote.rows, ...quote.skippedRows].map(row => row.name)
)

const seasonAt = (month, day) =>
  getSeason(SEASONS, new Date(2026, month - 1, day)).id


test('every seasonal food maps to CEASA products', () => {
  for (const season of SEASONS) {
    for (const foods of Object.values(season.foods)) {
      for (const food of foods) {
        assert.ok(FOOD_PRODUCTS[food]?.length, `${season.id}: "${food}" has no CEASA products`)
      }
    }
  }
})

test('every mapped name is a CEASA product, and none is imported', () => {
  for (const [food, names] of Object.entries(FOOD_PRODUCTS)) {
    for (const name of names) {
      assert.ok(ceasaNames.has(name), `${food}: "${name}" is not in the CEASA quote`)
      assert.ok(!/importad/i.test(name), `${food}: "${name}" is imported`)
    }
  }
})

test('seasons switch on the solstice/equinox', () => {
  assert.equal(seasonAt(1, 15), 'verao')
  assert.equal(seasonAt(3, 20), 'verao')
  assert.equal(seasonAt(3, 21), 'outono')
  assert.equal(seasonAt(6, 20), 'outono')
  assert.equal(seasonAt(6, 21), 'inverno')
  assert.equal(seasonAt(9, 22), 'inverno')
  assert.equal(seasonAt(9, 23), 'primavera')
  assert.equal(seasonAt(12, 20), 'primavera')
  assert.equal(seasonAt(12, 21), 'verao')
})

test('spring includes mango and tomato, not strawberry', () => {
  const spring = getSeasonalProductIds(
    SEASONS.find(season => season.id === 'primavera'),
    FOOD_PRODUCTS
  )

  assert.ok(spring.has('manga_palmer'))
  assert.ok(spring.has('tomate_italiano'))
  assert.ok(!spring.has('morango'))
})
