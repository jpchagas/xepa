const currencyFormatter =
  new Intl.NumberFormat(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )


export const formatCurrency = value =>
  currencyFormatter.format(
    Number(value) || 0
  )


// Accepts both "0,5" (pt-BR keyboards) and "0.5".
// Returns NaN for empty or invalid input.
export const parseDecimal = value => {
  const text =
    String(value ?? '')
      .trim()
      .replace(',', '.')

  if (text === '') return NaN

  return Number(text)
}


export const formatDecimal = value =>
  String(value).replace('.', ',')


// Lowercase, accent-free text for search and
// name comparisons ("Maçã" matches "maca").
export const normalizeText = value =>
  String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()


export const getProductName = (
  product,
  productId
) =>
  product?.name ??
  String(productId ?? '').replace(/_/g, ' ')


// Name plus brand ("Sabão em pó Ypê") for messages and search.
// Only user-created products have a brand; CEASA ones never do.
export const getProductLabel = (
  product,
  productId
) =>
  [getProductName(product, productId), product?.brand]
    .filter(Boolean)
    .join(' ')


// Each brand is its own product (its own price), so a product is
// identified by name + brand. A missing brand only matches a
// product without one.
export const findProductByName = (
  products,
  name,
  brand = null
) =>
  products.find(
    product =>
      normalizeText(product.name) === normalizeText(name) &&
      normalizeText(product.brand) === normalizeText(brand)
  )


// CEASA units come uppercase ("KG", "UND", "MOL"...).
const UNIT_LABELS = {
  KG: 'kg',
  UN: 'un',
  UND: 'un',
  DZ: 'un', // dozen-priced products are shown per unit
  MOL: 'maço',
  BDJ: 'bandeja',
  CX: 'caixa',
  CXT: 'caixeta',
  VASO: 'vaso',
  L: 'L'
}

export const getDisplayUnit = unit => {
  if (!unit) return ''

  return UNIT_LABELS[unit.toUpperCase()] ?? unit.toLowerCase()
}


export const getEffectivePrice = (
  unit,
  price
) =>
  unit === 'DZ'
    ? price / 12
    : price


export const getItemAmount = item =>
  item.amount ?? 1


// The product's live price (updated daily from CEASA, or entered
// manually) wins over the snapshot saved on the item when it was
// added, which remains the fallback for older data.
export const getItemPricing = (
  item,
  product
) => {
  const latest = product?.latestPrice

  if (latest?.average) {
    return {
      price: latest.average,
      previousPrice: product.previousPrice?.average ?? null,
      fileDate: latest.fileDate ?? null
    }
  }

  return {
    price: item.price ?? null,
    previousPrice: item.previousPrice ?? null,
    fileDate: item.fileDate ?? null
  }
}


export const getItemTotal = (
  item,
  product
) => {
  const { price } = getItemPricing(item, product)

  if (!price) return 0

  return (
    getEffectivePrice(product?.unit, price) *
    getItemAmount(item)
  )
}


export const calculateTotalPrice = (
  items,
  productsById
) =>
  items.reduce(
    (sum, item) =>
      sum +
      getItemTotal(
        item,
        productsById.get(item.productId)
      ),
    0
  )


// Positive = cheaper than the previous price snapshot.
export const calculateSavings = (
  items,
  productsById
) =>
  items.reduce(
    (sum, item) => {
      const product = productsById.get(item.productId)

      const { price, previousPrice } =
        getItemPricing(item, product)

      if (!price || !previousPrice) {
        return sum
      }

      const difference =
        getEffectivePrice(product?.unit, previousPrice) -
        getEffectivePrice(product?.unit, price)

      return sum + difference * getItemAmount(item)
    },
    0
  )


export const getPriceTrend = (
  current,
  previous
) => {
  if (!current || !previous) return null

  const percent =
    Math.round(
      ((current - previous) / previous) * 100
    )

  if (percent === 0) return null

  return {
    direction: percent > 0 ? 'up' : 'down',
    percent: Math.abs(percent)
  }
}


// "2026-09-12" -> "12/09"
export const formatShortDate = fileDate => {
  if (!fileDate) return ''

  const [, month, day] =
    String(fileDate).split('-')

  return day && month
    ? `${day}/${month}`
    : ''
}


export const getLatestFileDate = (
  items,
  productsById
) =>
  items.reduce(
    (latest, item) => {
      const { fileDate } = getItemPricing(
        item,
        productsById.get(item.productId)
      )

      return fileDate && fileDate > latest
        ? fileDate
        : latest
    },
    ''
  )


// True when a price is older than `days` (e.g. a product with no
// trade at CEASA for a while keeps its last known price).
export const isStalePrice = (
  fileDate,
  days = 7
) => {
  if (!fileDate) return false

  const limit = new Date()
  limit.setDate(limit.getDate() - days)

  return fileDate < limit.toISOString().slice(0, 10)
}


export const sortItemsByName = (
  items,
  productsById
) =>
  [...items].sort((a, b) =>
    getProductName(
      productsById.get(a.productId),
      a.productId
    ).localeCompare(
      getProductName(
        productsById.get(b.productId),
        b.productId
      ),
      'pt-BR'
    )
  )
