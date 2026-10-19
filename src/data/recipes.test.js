// Node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

// Data
import recipes, { RECIPE_CATEGORIES } from './recipes.js'

// Services
import { parseQuotePdf } from '../../functions/src/ceasa/parseQuote.js'
import { normalizeProductId as serverProductId } from '../../functions/src/ceasa/syncPrices.js'

// Utils
import { normalizeProductId } from '../utils/productIds.js'


const UNITS = new Set([
  'g', 'kg', 'ml', 'L', 'xícara', 'colher de sopa', 'colher de chá',
  'unidade', 'dente', 'maço', 'pé', 'lata', 'caixinha', 'pacote',
  'fatia', 'pitada', 'espiga', 'a gosto'
])

const quote = await parseQuotePdf(
  readFileSync(
    new URL('../../functions/test/fixtures/cotacao-2026-10-19.pdf', import.meta.url)
  )
)

const ceasaNames = new Set(quote.rows.map(row => row.name))

const ceasaIngredients = recipes.flatMap(recipe =>
  recipe.ingredients
    .filter(ingredient => ingredient.list?.ceasa)
    .map(ingredient => ({ recipe: recipe.id, ...ingredient }))
)


test('recipe ids are unique and categories are known', () => {
  const ids = recipes.map(recipe => recipe.id)

  assert.equal(new Set(ids).size, ids.length)

  for (const recipe of recipes) {
    assert.ok(RECIPE_CATEGORIES.includes(recipe.category), recipe.id)
    assert.ok(recipe.servings > 0 && recipe.minutes > 0, recipe.id)
    assert.ok(recipe.steps.length > 0, recipe.id)
  }
})

test('every ingredient has a name and a known unit', () => {
  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const label = `${recipe.id}: ${ingredient.name}`

      assert.ok(ingredient.name, label)
      assert.ok(UNITS.has(ingredient.unit), `${label} (${ingredient.unit})`)

      if (ingredient.unit !== 'a gosto') {
        assert.ok(ingredient.qty > 0, label)
      }
    }
  }
})

test('every CEASA ingredient names a real, priced CEASA product', () => {
  for (const ingredient of ceasaIngredients) {
    assert.ok(
      ceasaNames.has(ingredient.list.ceasa),
      `${ingredient.recipe}: "${ingredient.list.ceasa}" is not in the CEASA quote`
    )
    assert.ok(ingredient.list.amount > 0, ingredient.recipe)
  }
})

test('client and import derive the same product ids', () => {
  for (const name of ceasaNames) {
    assert.equal(normalizeProductId(name), serverProductId(name), name)
  }
})
