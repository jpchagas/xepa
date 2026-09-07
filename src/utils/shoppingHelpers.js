export const formatCurrency = value =>
  value.toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL'
    }
  )


export const getProductName = (
  products,
  productId
) => {
  const product =
    products.find(
      product =>
        product.id === productId
    )

  return product
    ? product.name
    : productId
}


export const getProductUnit = (
  products,
  productId
) => {
  const product =
    products.find(
      product =>
        product.id === productId
    )

  return product
    ? product.unit
    : ''
}


export const getDisplayUnit = (
  products,
  productId
) =>
  getProductUnit(
    products,
    productId
  ) === 'DZ'
    ? 'un'
    : getProductUnit(
        products,
        productId
      )


export const getEffectivePrice = (
  products,
  productId,
  price
) =>
  getProductUnit(
    products,
    productId
  ) === 'DZ'
    ? price / 12
    : price


export const calculateTotalPrice = (
  items,
  products
) =>
  items.reduce(
    (sum, item) => {
      if (!item.price) {
        return sum
      }

      const amount =
        item.amount || 1

      return (
        sum +
        getEffectivePrice(
          products,
          item.productId,
          item.price
        ) *
          amount
      )
    },
    0
  )


export const getPriceColor = (
  current,
  previous
) => {
  if (!previous) {
    return 'white'
  }

  if (current > previous) {
    return '#ffebee'
  }

  if (current < previous) {
    return '#e8f5e9'
  }

  return 'white'
}