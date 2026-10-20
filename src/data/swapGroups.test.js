// Node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// Data
import NUTRITION from './nutrition.js'
import SWAP_GROUPS from './swapGroups.js'

// Services
import { parseQuotePdf } from '../../functions/src/ceasa/parseQuote.js'


const quote = await parseQuotePdf(
  readFileSync(
    new URL('../../functions/test/fixtures/cotacao-2026-10-19.pdf', import.meta.url)
  )
)

// Include R$ 0,00 rows: a product with no trade that day still exists.
const ceasa = new Map(
  [...quote.rows, ...quote.skippedRows].map(row => [row.name, row])
)


test('every swap product is a CEASA product with nutrition data', () => {
  for (const group of SWAP_GROUPS) {
    for (const product of group.products) {
      assert.ok(
        NUTRITION[product.tabnut],
        `${product.ceasa}: TabNut ${product.tabnut} missing — run npm run nutrition`
      )
      assert.ok(product.note, `${product.ceasa}: missing cooking note`)
    }
  }
})

test('every swap product name matches a CEASA product', () => {
  for (const group of SWAP_GROUPS) {
    for (const product of group.products) {
      assert.ok(ceasa.has(product.ceasa), `"${product.ceasa}" is not in the CEASA quote`)
    }
  }
})

test('products in a group share a CEASA unit, so prices compare', () => {
  for (const group of SWAP_GROUPS) {
    const units = new Set(
      group.products
        .map(product => ceasa.get(product.ceasa)?.unit)
        .filter(Boolean)
    )

    assert.equal(units.size, 1, `${group.id}: mixed units ${[...units]}`)
  }
})

test('a product belongs to only one group', () => {
  const names = SWAP_GROUPS.flatMap(group => group.products.map(p => p.ceasa))

  assert.equal(new Set(names).size, names.length)
})
