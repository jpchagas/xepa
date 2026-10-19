// Node
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Utils
import {
  buildRecipeLines,
  formatQuantity,
  resolveIngredient,
  scaleListAmount,
  searchRecipes
} from './recipeHelpers.js'


const cebola = {
  id: 'cebola_nacional',
  name: 'Cebola Nacional',
  unit: 'KG',
  latestPrice: { average: 6.5, fileDate: '2026-10-19' }
}

const alface = {
  id: 'alface_crespa',
  name: 'Alface Crespa',
  unit: 'DZ',
  latestPrice: { average: 15, fileDate: '2026-10-19' }
}

const productsById = new Map([cebola, alface].map(p => [p.id, p]))
const productsByName = new Map()


test('formatQuantity reads like a recipe', () => {
  assert.equal(formatQuantity(2, 'dente'), '2 dentes')
  assert.equal(formatQuantity(1, 'dente'), '1 dente')
  assert.equal(formatQuantity(1.5, 'xícara'), '1½ xícaras')
  assert.equal(formatQuantity(0.5, 'unidade'), '½ unidade')
  assert.equal(formatQuantity(2, 'colher de sopa'), '2 colheres de sopa')
  assert.equal(formatQuantity(600, 'g'), '600 g')
  assert.equal(formatQuantity(600, 'g', 2), '1,2 kg')
  assert.equal(formatQuantity(null, 'a gosto'), 'a gosto')
})

test('scaling keeps sensible kitchen fractions', () => {
  // ½ onion for 4 servings -> ¾ for 6
  assert.equal(formatQuantity(0.5, 'unidade', 1.5), '¾ unidade')
  // 1 can for 6 -> ⅔ for 4 (rounded, never 0)
  assert.equal(formatQuantity(1, 'lata', 4 / 6), '⅔ lata')
  assert.equal(formatQuantity(1, 'lata', 0.1), '¼ lata')
})

test('weight amounts round to 50 g, units round up', () => {
  const onion = resolveIngredient(
    { name: 'Cebola', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
    productsById,
    productsByName
  )

  assert.equal(scaleListAmount(onion, 1), 0.15)
  assert.equal(scaleListAmount(onion, 2), 0.3)
  assert.equal(scaleListAmount(onion, 0.1), 0.05)

  const lettuce = resolveIngredient(
    { name: 'Alface', list: { ceasa: 'Alface Crespa', amount: 1 } },
    productsById,
    productsByName
  )

  assert.equal(scaleListAmount(lettuce, 0.5), 1)
  assert.equal(scaleListAmount(lettuce, 1.5), 2)
})

test('off-CEASA ingredients become named products', () => {
  const cream = resolveIngredient(
    { name: 'Creme de leite', qty: 1, unit: 'caixinha' },
    productsById,
    productsByName
  )

  assert.equal(cream.ceasa, false)
  assert.equal(cream.productId, null)
  assert.equal(cream.name, 'Creme de leite')
  assert.equal(cream.key, 'name:creme de leite')
})

test('off-CEASA names never match CEASA products', () => {
  const greens = { id: 'mostarda', name: 'Mostarda', unit: 'DZ', category: 'Verduras e Legumes' }

  const resolved = resolveIngredient(
    { name: 'Mostarda', qty: 1, unit: 'colher de sopa' },
    productsById,
    new Map([['mostarda', greens]])
  )

  assert.equal(resolved.product, null)
  assert.equal(resolved.productId, null)
})

test('only package units scale for off-CEASA products', () => {
  const ketchup = resolveIngredient(
    { name: 'Ketchup', qty: 2, unit: 'colher de sopa' },
    productsById,
    productsByName
  )

  assert.equal(scaleListAmount(ketchup, 3), 1)

  const cans = resolveIngredient(
    { name: 'Champignon', qty: 1, unit: 'lata' },
    productsById,
    productsByName
  )

  assert.equal(scaleListAmount(cans, 2), 2)
  assert.equal(scaleListAmount(cans, 0.5), 1)
})

test('lines merge repeated products and price them per unit', () => {
  const recipe = {
    servings: 4,
    ingredients: [
      { name: 'Cebola', qty: 1, unit: 'unidade', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Cebola', qty: 1, unit: 'unidade', note: 'para servir', list: { ceasa: 'Cebola Nacional', amount: 0.15 } },
      { name: 'Alface', qty: 1, unit: 'pé', list: { ceasa: 'Alface Crespa', amount: 1 } },
      { name: 'Sal', unit: 'a gosto', pantry: true }
    ]
  }

  const lines = buildRecipeLines(recipe, 1, productsById, productsByName)

  assert.equal(lines.length, 3)

  const onion = lines.find(line => line.key === 'cebola_nacional')

  assert.equal(onion.amount, 0.3)
  assert.equal(onion.ingredients.length, 2)
  assert.ok(Math.abs(onion.cost - 0.3 * 6.5) < 1e-9)

  // DZ is priced per unit: 15 / 12
  const lettuce = lines.find(line => line.key === 'alface_crespa')

  assert.equal(lettuce.cost, 1.25)

  assert.equal(lines.find(line => line.key === 'name:sal').pantry, true)
})

test('optional ingredients are flagged', () => {
  const [line] = buildRecipeLines(
    { servings: 1, ingredients: [{ name: 'Champignon', qty: 1, unit: 'lata', note: 'opcional' }] },
    1,
    productsById,
    productsByName
  )

  assert.equal(line.optional, true)
})

test('search ignores accents and matches ingredients', () => {
  const recipes = [
    { name: 'Feijão caseiro', category: 'Acompanhamentos', ingredients: [{ name: 'Feijão' }] },
    { name: 'Strogonoff de frango', category: 'Pratos principais', ingredients: [{ name: 'Filé de frango' }, { name: 'Creme de leite' }] }
  ]

  assert.deepEqual(searchRecipes(recipes, 'feijao', null).map(r => r.name), ['Feijão caseiro'])
  assert.deepEqual(searchRecipes(recipes, 'creme', null).map(r => r.name), ['Strogonoff de frango'])
  assert.deepEqual(searchRecipes(recipes, '', 'Acompanhamentos').map(r => r.name), ['Feijão caseiro'])
})
