// Cheaper swaps with similar nutrition for items on the list.
//
// A swap is suggested when the alternative:
//   1. is in the same group of src/data/swapGroups.js (works the same
//      way in the kitchen),
//   2. has similar nutrition per 100 g (see `compareNutrition`),
//   3. is sold in the same CEASA unit (kg vs kg, dozen vs dozen),
//   4. costs at least MIN_SAVING_RATIO less, both prices being recent,
//   5. isn't already on the list and wasn't dismissed for this item.

// Utils (explicit .js so `npm test` can run this file in Node)
import { normalizeProductId } from './productIds.js'
import {
  getEffectivePrice,
  getItemAmount,
  isStalePrice
} from './shoppingHelpers.js'


// Main nutrients compared, with a floor so tiny amounts don't count as
// big relative differences (0,1 g vs 0,3 g of fat isn't "3x more").
const COMPARED = {
  kcal: { floor: 40, label: 'Energia', unit: 'kcal' },
  protein: { floor: 3, label: 'Proteína', unit: 'g' },
  carbs: { floor: 5, label: 'Carboidratos', unit: 'g' },
  fat: { floor: 3, label: 'Gorduras', unit: 'g' },
  fiber: { floor: 2, label: 'Fibras', unit: 'g' }
}

// Largest relative difference allowed in any main nutrient.
export const MAX_NUTRITION_DIFFERENCE = 0.35

// The alternative must be at least 10% cheaper per unit.
export const MIN_SAVING_RATIO = 0.1

// Vitamins/minerals worth pointing out when they differ a lot:
// at least 1.5x and by a meaningful amount.
const HIGHLIGHTS = {
  fiber: { label: 'fibras', min: 0.5 },
  vitaminA: { label: 'vitamina A', min: 50 },
  vitaminC: { label: 'vitamina C', min: 5 },
  potassium: { label: 'potássio', min: 50 },
  iron: { label: 'ferro', min: 0.3 },
  calcium: { label: 'cálcio', min: 20 }
}


export const NUTRIENT_ROWS = Object.entries(COMPARED).map(
  ([key, { label, unit }]) => ({ key, label, unit })
)


// productId -> { group, entry } for every product in a swap group.
export function buildSwapIndex(groups) {
  const index = new Map()

  for (const group of groups) {
    for (const entry of group.products) {
      index.set(normalizeProductId(entry.ceasa), { group, entry })
    }
  }

  return index
}


// { similar, difference, nutrient }: `difference` is the largest
// relative gap among the main nutrients, `nutrient` which one it was.
export function compareNutrition(a, b) {
  let difference = 0
  let nutrient = null

  for (const [key, { floor }] of Object.entries(COMPARED)) {
    const gap =
      Math.abs(a[key] - b[key]) / Math.max(a[key], b[key], floor)

    if (gap > difference) {
      difference = gap
      nutrient = key
    }
  }

  return {
    similar: difference <= MAX_NUTRITION_DIFFERENCE,
    difference,
    nutrient
  }
}


// Notable gains and losses of `next` compared to `current`:
// [{ label, direction: 'more' | 'less' }]
export function nutritionHighlights(current, next) {
  const highlights = []

  for (const [key, { label, min }] of Object.entries(HIGHLIGHTS)) {
    const before = current[key] ?? 0
    const after = next[key] ?? 0

    if (Math.abs(after - before) < min) continue

    if (after >= before * 1.5) highlights.push({ label, direction: 'more' })
    else if (before >= after * 1.5) highlights.push({ label, direction: 'less' })
  }

  return highlights
}


const unitPriceOf = product => {
  const price = product?.latestPrice

  if (!price?.average || isStalePrice(price.fileDate)) return null

  return getEffectivePrice(product.unit, price.average)
}


// Best swap for an item, or null. `context`:
//   productsById, swapIndex, nutrition (by TabNut id),
//   listProductIds (Set of products already on the list)
export function findSwap(item, context) {
  const { productsById, swapIndex, nutrition, listProductIds } = context

  if (item.checked) return null

  const current = swapIndex.get(item.productId)
  const product = productsById.get(item.productId)
  const currentPrice = unitPriceOf(product)
  const currentNutrition = current && nutrition[current.entry.tabnut]

  if (!current || !currentPrice || !currentNutrition) return null

  const dismissed = new Set(item.swapDismissed ?? [])
  const amount = getItemAmount(item)

  let best = null

  for (const entry of current.group.products) {
    const productId = normalizeProductId(entry.ceasa)

    if (
      productId === item.productId ||
      dismissed.has(productId) ||
      listProductIds.has(productId)
    ) {
      continue
    }

    const alternative = productsById.get(productId)
    const alternativePrice = unitPriceOf(alternative)
    const alternativeNutrition = nutrition[entry.tabnut]

    if (
      !alternativePrice ||
      !alternativeNutrition ||
      alternative.unit !== product.unit ||
      alternativePrice > currentPrice * (1 - MIN_SAVING_RATIO)
    ) {
      continue
    }

    const comparison = compareNutrition(currentNutrition, alternativeNutrition)

    if (!comparison.similar) continue

    const savings = (currentPrice - alternativePrice) * amount

    if (!best || savings > best.savings) {
      best = {
        product: alternative,
        entry,
        nutrition: alternativeNutrition,
        unitPrice: alternativePrice,
        savings,
        comparison
      }
    }
  }

  if (!best) return null

  return {
    group: current.group,
    current: {
      product,
      entry: current.entry,
      nutrition: currentNutrition,
      unitPrice: currentPrice
    },
    alternative: best,
    savings: best.savings,
    highlights: nutritionHighlights(currentNutrition, best.nutrition)
  }
}
