// Third-party
import assert from 'node:assert/strict'
import test from 'node:test'

// Utils
import {
  findProductByName,
  getProductLabel
} from './shoppingHelpers.js'


const products = [
  { id: 'banana_prata', name: 'Banana Prata', unit: 'KG', category: 'Frutas' },
  { id: 'a', name: 'Sabão em pó' },
  { id: 'b', name: 'Sabão em pó', brand: 'Ypê' },
  { id: 'c', name: 'Sabão em pó', brand: 'Omo' }
]


test('getProductLabel appends the brand when there is one', () => {
  assert.equal(getProductLabel(products[2]), 'Sabão em pó Ypê')
  assert.equal(getProductLabel(products[1]), 'Sabão em pó')
  assert.equal(getProductLabel(undefined, 'feijao_preto'), 'feijao preto')
})


test('findProductByName matches name and brand, ignoring case and accents', () => {
  assert.equal(findProductByName(products, 'sabao em po', 'ype')?.id, 'b')
  assert.equal(findProductByName(products, 'Sabão em pó', 'OMO')?.id, 'c')
  assert.equal(findProductByName(products, 'Sabão em pó', 'Brilhante'), undefined)
})


test('findProductByName without a brand only matches brandless products', () => {
  assert.equal(findProductByName(products, 'sabão em pó')?.id, 'a')
  assert.equal(findProductByName(products.slice(2), 'sabão em pó'), undefined)
  assert.equal(findProductByName(products, 'banana prata')?.id, 'banana_prata')
})
