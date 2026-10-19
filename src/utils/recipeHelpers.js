// Utils (explicit .js so `npm test` can run this file in Node)
import { normalizeProductId } from './productIds.js'
import {
  getEffectivePrice,
  normalizeText
} from './shoppingHelpers.js'


// Soft background per category for recipe cards.
export const CATEGORY_TINTS = {
  'Pratos principais': '#FFEFD3',
  Acompanhamentos: '#F4ECDF',
  Massas: '#FDE6D8',
  Sopas: '#FFF3D1',
  Saladas: '#E2F4DF',
  Lanches: '#FFF7C7',
  Doces: '#FCE4EC',
  Bebidas: '#DDF3F0'
}

export const formatMinutes = minutes =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ''}`
    : `${minutes} min`


const PLURALS = {
  unidade: 'unidades',
  dente: 'dentes',
  maço: 'maços',
  pé: 'pés',
  lata: 'latas',
  caixinha: 'caixinhas',
  pacote: 'pacotes',
  fatia: 'fatias',
  pitada: 'pitadas',
  xícara: 'xícaras',
  espiga: 'espigas',
  'colher de sopa': 'colheres de sopa',
  'colher de chá': 'colheres de chá'
}

const METRIC_UNITS = new Set(['g', 'kg', 'ml', 'L'])

// Measured in whole packages: "2 latas" means buying 2. Anything else
// ("2 colheres de sopa" of ketchup) is one package however it scales.
const PACKAGE_UNITS = new Set(['lata', 'caixinha', 'pacote'])

const FRACTIONS = [
  [0, ''],
  [0.25, '¼'],
  [1 / 3, '⅓'],
  [0.5, '½'],
  [2 / 3, '⅔'],
  [0.75, '¾'],
  [1, '']
]

const numberFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2
})


// 1.5 -> "1½", 0.25 -> "¼" (kitchen measures read better as fractions).
function formatFraction(value) {
  let whole = Math.floor(value)
  const rest = value - whole

  const [nearest, symbol] = FRACTIONS.reduce((best, entry) =>
    Math.abs(entry[0] - rest) < Math.abs(best[0] - rest) ? entry : best
  )

  if (nearest === 1) whole += 1

  if (whole === 0 && !symbol) return '¼'

  return `${whole || ''}${symbol}`
}

// 600 g, 1,2 kg — rounded to amounts a recipe would actually say.
function formatMetric(value, unit) {
  if (unit === 'g' && value >= 1000) return formatMetric(value / 1000, 'kg')
  if (unit === 'ml' && value >= 1000) return formatMetric(value / 1000, 'L')

  const step =
    unit === 'g' || unit === 'ml'
      ? value >= 100 ? 10 : 5
      : 0.05

  const rounded = Math.max(step, Math.round(value / step) * step)

  return `${numberFormat.format(rounded)} ${unit}`
}


// "2 dentes", "1½ xícaras", "600 g", "a gosto".
export function formatQuantity(qty, unit, scale = 1) {
  if (qty == null || unit === 'a gosto') return 'a gosto'

  const value = qty * scale

  if (METRIC_UNITS.has(unit)) return formatMetric(value, unit)

  const text = formatFraction(value)
  const label = value > 1 ? PLURALS[unit] ?? unit : unit

  return `${text} ${label}`
}


// CEASA products get their category from the price import.
export const isCeasaProduct = product => !!product?.category


// What a recipe ingredient puts on the shopping list.
//   ceasa: true  -> links to the CEASA product (live price)
//   productId    -> null when the product doesn't exist yet
//   scales       -> whether the amount follows the servings
export function resolveIngredient(ingredient, productsById, productsByName) {
  const list = ingredient.list ?? { name: ingredient.name }

  if (list.ceasa) {
    const productId = normalizeProductId(list.ceasa)
    const product = productsById.get(productId) ?? null

    return {
      key: productId,
      productId,
      name: product?.name ?? list.ceasa,
      product,
      ceasa: true,
      scales: true,
      baseAmount: list.amount
    }
  }

  const name = list.name ?? ingredient.name

  // Never match a CEASA product by name: the condiment "Mostarda" is
  // not CEASA's "Mostarda" (mustard greens, sold by the dozen).
  const match = productsByName.get(normalizeText(name))
  const product = match && !isCeasaProduct(match) ? match : null

  const scales = PACKAGE_UNITS.has(ingredient.unit)

  return {
    key: product?.id ?? `name:${normalizeText(name)}`,
    productId: product?.id ?? null,
    name,
    product,
    ceasa: false,
    scales,
    baseAmount: list.amount ?? (scales ? ingredient.qty : 1)
  }
}


// Amount for the list in the product's own unit. Weight (kg) is
// rounded to 50 g; everything else is whole units/packages.
export function scaleListAmount(resolved, scale) {
  const value = resolved.baseAmount * (resolved.scales ? scale : 1)

  const isWeight =
    resolved.product?.unit
      ? resolved.product.unit.toUpperCase() === 'KG'
      : resolved.ceasa && !Number.isInteger(resolved.baseAmount)

  if (isWeight) {
    return Math.max(0.05, Math.round(value / 0.05) * 0.05)
      .toFixed(2) * 1
  }

  return Math.max(1, Math.ceil(value - 0.001))
}


// Estimated cost from the product's live price; null when unknown.
export function estimateCost(resolved, amount) {
  const price = resolved.product?.latestPrice?.average

  if (!price) return null

  return getEffectivePrice(resolved.product.unit, price) * amount
}


// Ingredients merged by product (a recipe can use the same product
// twice), with list amount, cost and whether it starts selected.
export function buildRecipeLines(recipe, scale, productsById, productsByName) {
  const lines = new Map()

  recipe.ingredients.forEach((ingredient, index) => {
    const resolved = resolveIngredient(ingredient, productsById, productsByName)
    const amount = scaleListAmount(resolved, scale)
    const existing = lines.get(resolved.key)

    const optional = /opcional/i.test(ingredient.note ?? '')

    if (existing) {
      existing.amount += amount
      existing.ingredients.push(ingredient)
      existing.pantry = existing.pantry && !!ingredient.pantry
      existing.optional = existing.optional && optional
      return
    }

    lines.set(resolved.key, {
      key: resolved.key,
      index,
      resolved,
      amount,
      pantry: !!ingredient.pantry,
      optional,
      ingredients: [ingredient]
    })
  })

  return [...lines.values()].map(line => ({
    ...line,
    cost: estimateCost(line.resolved, line.amount)
  }))
}


// Pantry staples and optional ingredients start unselected.
export const isSelectedByDefault = line =>
  !line.pantry && !line.optional


// Cost of what a recipe adds by default, counting only products with
// a CEASA price.
export function estimateRecipeCost(recipe, productsById, productsByName) {
  return buildRecipeLines(recipe, 1, productsById, productsByName)
    .filter(line => isSelectedByDefault(line) && line.cost != null)
    .reduce((sum, line) => sum + line.cost, 0)
}


export function searchRecipes(recipes, query, category) {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean)

  return recipes.filter(recipe => {
    if (category && recipe.category !== category) return false

    if (terms.length === 0) return true

    const haystack = normalizeText(
      [
        recipe.name,
        recipe.category,
        ...recipe.ingredients.map(ingredient => ingredient.name)
      ].join(' ')
    )

    return terms.every(term => haystack.includes(term))
  })
}
