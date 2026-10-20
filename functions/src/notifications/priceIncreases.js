// Third-party
import { FieldValue } from 'firebase-admin/firestore'

// Services
import { sendPush, wantsNotification } from './deliver.js'
import { buildPriceIncrease, priceIncreaseId } from './messages.js'


// Firestore `in` queries accept up to 30 values.
const IN_LIMIT = 30


// After a CEASA import: for every list holding unchecked items whose
// price rose, notify its members once (one doc per list and quote day,
// so a re-run doesn't duplicate).
export async function notifyPriceIncreases({ db, messaging, logger, fileDate, increases }) {
  if (increases.length === 0) return { lists: 0, notified: 0 }

  const byProductId = new Map(
    increases.map(increase => [increase.productId, increase])
  )

  const productIds = [...byProductId.keys()]

  const listsSnap = await db.collection('sharedLists').get()

  let lists = 0
  let notified = 0

  for (const listDoc of listsSnap.docs) {
    const list = listDoc.data()
    const affected = new Map()

    for (let start = 0; start < productIds.length; start += IN_LIMIT) {
      const itemsSnap = await listDoc.ref
        .collection('items')
        .where('productId', 'in', productIds.slice(start, start + IN_LIMIT))
        .get()

      itemsSnap.docs
        .map(doc => doc.data())
        // Already in the cart: the price no longer matters.
        .filter(item => !item.checked)
        .forEach(item => {
          affected.set(item.productId, byProductId.get(item.productId))
        })
    }

    if (affected.size === 0) continue

    lists++

    const notification = buildPriceIncrease({
      listId: listDoc.id,
      listName: list.name,
      fileDate,
      increases: [...affected.values()]
    })

    const id = priceIncreaseId(listDoc.id, fileDate)

    for (const uid of list.members ?? []) {
      if (!(await wantsNotification(db, uid, 'priceIncreases'))) continue

      await db.doc(`users/${uid}/notifications/${id}`).set({
        ...notification,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      })

      await sendPush({
        db,
        messaging,
        logger,
        uid,
        title: notification.title,
        body: notification.body,
        tag: id,
        url: `/main?list=${listDoc.id}`
      })

      notified++
    }
  }

  logger?.info('Price increase notifications', {
    fileDate,
    increases: increases.length,
    lists,
    notified
  })

  return { lists, notified }
}
