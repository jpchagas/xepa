// Node
import assert from 'node:assert/strict'
import { test } from 'node:test'

// Services
import {
  buildItemsAdded,
  buildPriceIncrease,
  findPriceIncreases,
  getActorName,
  GROUP_WINDOW_MS,
  joinNames
} from '../src/notifications/messages.js'


const base = {
  listId: 'l1',
  listName: 'Feira de sábado',
  actorId: 'u2',
  actorName: 'maria',
  nowMs: 1_000_000_000
}


test('joinNames reads naturally in Portuguese', () => {
  assert.equal(joinNames(['Tomate']), 'Tomate')
  assert.equal(joinNames(['Tomate', 'Alface']), 'Tomate e Alface')
  assert.equal(joinNames(['Tomate', 'Alface', 'Cebola']), 'Tomate, Alface e Cebola')
  assert.equal(joinNames(['A', 'B', 'C', 'D'], 6), 'A, B, C e mais 3')
})

test('getActorName uses the email name', () => {
  assert.equal(getActorName('maria.silva@email.com'), 'maria.silva')
  assert.equal(getActorName(undefined), 'Alguém')
})

test('first item starts a new notification', () => {
  const next = buildItemsAdded({ ...base, itemName: 'Tomate' })

  assert.equal(next.isNew, true)
  assert.equal(next.count, 1)
  assert.equal(next.body, 'maria adicionou Tomate')
  assert.equal(next.title, 'Feira de sábado')
})

test('more items from the same person are grouped while unread', () => {
  let previous = { ...buildItemsAdded({ ...base, itemName: 'Tomate' }), updatedAtMs: base.nowMs }

  for (const itemName of ['Alface', 'Cebola', 'Alho']) {
    previous = {
      ...buildItemsAdded({ ...base, previous, itemName, nowMs: base.nowMs + 1000 }),
      updatedAtMs: base.nowMs + 1000
    }
  }

  assert.equal(previous.isNew, false)
  assert.equal(previous.count, 4)
  assert.equal(previous.body, 'maria adicionou 4 itens: Tomate, Alface, Cebola e mais 1')
})

test('a read or old notification starts over', () => {
  const previous = {
    ...buildItemsAdded({ ...base, itemName: 'Tomate' }),
    updatedAtMs: base.nowMs
  }

  const afterRead = buildItemsAdded({
    ...base,
    previous: { ...previous, read: true },
    itemName: 'Alface'
  })

  assert.equal(afterRead.isNew, true)
  assert.equal(afterRead.count, 1)

  const muchLater = buildItemsAdded({
    ...base,
    previous,
    itemName: 'Alface',
    nowMs: base.nowMs + GROUP_WINDOW_MS + 1
  })

  assert.equal(muchLater.isNew, true)
})

test('only rises of 5% or more in the newest quote count', () => {
  const summary = (productId, latest, previous, fileDate = '2026-10-19') => ({
    productId,
    name: productId,
    latestPrice: { average: latest, fileDate },
    previousPrice: { average: previous, fileDate: '2026-10-16' }
  })

  assert.deepEqual(
    findPriceIncreases(
      [
        summary('tomate', 11.5, 10),        // +15%
        summary('alface', 15.5, 15),        // +3%: noise
        summary('cebola', 6, 6.5),          // down
        summary('alho', 21, 20),            // exactly +5%
        summary('batata', 6, 4, '2026-10-16') // not in today's quote
      ],
      '2026-10-19'
    ),
    [
      { productId: 'tomate', name: 'tomate', percent: 15 },
      { productId: 'alho', name: 'alho', percent: 5 }
    ]
  )
})

test('price notification lists the biggest rises first', () => {
  const notification = buildPriceIncrease({
    listId: 'l1',
    listName: 'Feira de sábado',
    fileDate: '2026-10-19',
    increases: [
      { productId: 'a', name: 'Alho', percent: 6 },
      { productId: 't', name: 'Tomate', percent: 15 },
      { productId: 'c', name: 'Cebola', percent: 9 }
    ]
  })

  assert.equal(notification.title, '3 preços subiram na Feira de sábado')
  assert.equal(notification.body, 'Tomate +15%, Cebola +9% e mais 1')

  const single = buildPriceIncrease({
    listId: 'l1',
    listName: 'Feira',
    fileDate: '2026-10-19',
    increases: [{ productId: 't', name: 'Tomate', percent: 15 }]
  })

  assert.equal(single.title, 'Preço subiu na Feira')
  assert.equal(single.body, 'Tomate +15%')
})
