// Pure builders for notification documents (users/{uid}/notifications)
// and their texts. Kept free of Firestore so they're easy to test.


// Price changes smaller than this are normal day-to-day noise.
export const PRICE_INCREASE_THRESHOLD = 0.05

// Item additions by the same person to the same list are grouped into
// one notification while it's unread and recent.
export const GROUP_WINDOW_MS = 30 * 60 * 1000

const MAX_LISTED_ITEMS = 10


// "maria.silva@email.com" -> "maria.silva"
export const getActorName = email =>
  email ? email.split('@')[0] : 'Alguém'


// "Tomate, Alface e Cebola" / "Tomate, Alface, Cebola e mais 2"
export function joinNames(names, total = names.length, shown = 3) {
  const visible = names.slice(0, shown)
  const hidden = total - visible.length

  if (hidden > 0) return `${visible.join(', ')} e mais ${hidden}`
  if (visible.length <= 1) return visible.join('')

  return `${visible.slice(0, -1).join(', ')} e ${visible.at(-1)}`
}


// Notification doc id: one per list + person, reused while grouping.
export const itemsAddedId = (listId, actorId) =>
  `items-${listId}-${actorId}`

export const priceIncreaseId = (listId, fileDate) =>
  `prices-${listId}-${fileDate}`


// Next state of an "items added" notification. `previous` is the
// existing doc (or undefined); it's extended only while unread and
// within the grouping window, otherwise a fresh one starts.
export function buildItemsAdded({
  previous,
  listId,
  listName,
  actorId,
  actorName,
  itemName,
  nowMs
}) {
  const canGroup =
    previous &&
    !previous.read &&
    nowMs - (previous.updatedAtMs ?? 0) < GROUP_WINDOW_MS

  const items = canGroup
    ? [...new Set([...previous.items, itemName])].slice(0, MAX_LISTED_ITEMS)
    : [itemName]

  const count = canGroup ? previous.count + 1 : 1

  return {
    type: 'items_added',
    listId,
    listName,
    actorId,
    actorName,
    items,
    count,
    title: listName,
    body:
      count === 1
        ? `${actorName} adicionou ${itemName}`
        : `${actorName} adicionou ${count} itens: ${joinNames(items, count)}`,
    read: false,
    isNew: !canGroup
  }
}


// Products whose newest quote rose at least the threshold over the
// previous one. `summaries` are { productId, name, latestPrice,
// previousPrice } as written by the CEASA import.
export function findPriceIncreases(summaries, fileDate) {
  return summaries
    .filter(({ latestPrice, previousPrice }) =>
      latestPrice?.fileDate === fileDate &&
      previousPrice?.average > 0 &&
      latestPrice.average >= previousPrice.average * (1 + PRICE_INCREASE_THRESHOLD)
    )
    .map(({ productId, name, latestPrice, previousPrice }) => ({
      productId,
      name,
      percent: Math.round(
        (latestPrice.average / previousPrice.average - 1) * 100
      )
    }))
}


export function buildPriceIncrease({ listId, listName, fileDate, increases }) {
  const sorted = [...increases].sort((a, b) => b.percent - a.percent)

  const labels = sorted.map(item => `${item.name} +${item.percent}%`)

  return {
    type: 'price_increase',
    listId,
    listName,
    fileDate,
    items: sorted.slice(0, MAX_LISTED_ITEMS),
    count: sorted.length,
    title:
      sorted.length === 1
        ? `Preço subiu na ${listName}`
        : `${sorted.length} preços subiram na ${listName}`,
    body: joinNames(labels, labels.length, 2),
    read: false
  }
}
