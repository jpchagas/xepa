// Node
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Data
import NUTRITION from '../data/nutrition.js'
import SWAP_GROUPS from '../data/swapGroups.js'

// Utils
import {
  buildSwapIndex,
  compareNutrition,
  findSwap,
  nutritionHighlights
} from './swapHelpers.js'


const today = new Date().toISOString().slice(0, 10)

const product = (id, name, unit, average, fileDate = today) => ({
  id,
  name,
  unit,
  category: 'Verduras e Legumes',
  latestPrice: { average, fileDate }
})

const productsById = new Map(
  [
    product('batata_branca', 'Batata Branca', 'KG', 5),
    product('batata_doce', 'Batata Doce', 'KG', 3),
    product('batata_rosa', 'Batata Rosa', 'KG', 4.8),
    product('mandioca', 'Mandioca', 'KG', 2),
    product('alface_crespa', 'Alface Crespa', 'DZ', 15),
    product('alface_lisa', 'Alface Lisa', 'DZ', 12)
  ].map(p => [p.id, p])
)

const context = (overrides = {}) => ({
  productsById,
  swapIndex: buildSwapIndex(SWAP_GROUPS),
  nutrition: NUTRITION,
  listProductIds: new Set(['batata_branca']),
  ...overrides
})

const potatoes = { id: 'i1', productId: 'batata_branca', amount: 1.5 }


test('white potato -> sweet potato: similar nutrition, cheaper', () => {
  const swap = findSwap(potatoes, context())

  assert.equal(swap.alternative.product.id, 'batata_doce')
  assert.equal(swap.savings, 3) // (5 - 3) * 1,5 kg
  assert.ok(swap.alternative.comparison.similar)
})

test('cassava is cheaper but not nutritionally similar to potato', () => {
  const result = compareNutrition(NUTRITION['11354'], NUTRITION['11134'])

  assert.equal(result.similar, false)
  assert.equal(result.nutrient, 'carbs')

  // Even the cheapest option is skipped when it isn't similar.
  const swap = findSwap(potatoes, context())

  assert.notEqual(swap.alternative.product.id, 'mandioca')
})

test('chicken breast and thigh differ too much in fat', () => {
  const result = compareNutrition(NUTRITION['05117'], NUTRITION['05119'])

  assert.equal(result.similar, false)
  assert.equal(result.nutrient, 'fat')
})

test('needs at least 10% savings', () => {
  const swap = findSwap(potatoes, context({
    productsById: new Map([
      ...productsById,
      ['batata_doce', product('batata_doce', 'Batata Doce', 'KG', 4.7)]
    ])
  }))

  // Batata doce is only 6% cheaper; batata rosa 4% — nothing qualifies.
  assert.equal(swap, null)
})

test('skips dismissed swaps, items already on the list and checked items', () => {
  assert.equal(
    findSwap({ ...potatoes, swapDismissed: ['batata_doce'] }, context()),
    null
  )

  assert.equal(
    findSwap(potatoes, context({ listProductIds: new Set(['batata_branca', 'batata_doce']) })),
    null
  )

  assert.equal(findSwap({ ...potatoes, checked: true }, context()), null)
})

test('ignores stale prices', () => {
  const swap = findSwap(potatoes, context({
    productsById: new Map([
      ...productsById,
      ['batata_doce', product('batata_doce', 'Batata Doce', 'KG', 3, '2020-01-01')]
    ])
  }))

  assert.equal(swap, null)
})

test('lettuces swap among themselves, priced per head', () => {
  const swap = findSwap(
    { id: 'i2', productId: 'alface_crespa', amount: 2 },
    context({ listProductIds: new Set(['alface_crespa']) })
  )

  assert.equal(swap.alternative.product.id, 'alface_lisa')
  assert.equal(swap.savings, 0.5) // (15 - 12) / 12 per head * 2
})

test('highlights notable nutrient changes', () => {
  assert.deepEqual(
    nutritionHighlights(NUTRITION['11354'], NUTRITION['11507']),
    [
      // vitamina A 0 -> 709 µg, vitamina C 9,1 -> 2,4 mg, cálcio 9 -> 30 mg;
      // potássio 407 -> 337 mg isn't a big enough change to mention
      { label: 'vitamina A', direction: 'more' },
      { label: 'vitamina C', direction: 'less' },
      { label: 'cálcio', direction: 'more' }
    ]
  )
})
