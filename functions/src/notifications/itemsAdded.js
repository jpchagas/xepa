// Third-party
import { FieldValue } from 'firebase-admin/firestore'

// Services
import { sendPush, wantsNotification } from './deliver.js'
import {
  buildItemsAdded,
  getActorName,
  itemsAddedId
} from './messages.js'


// A new item on a shared list notifies every other member.
// Skipped: items written by older app versions (no `addedBy`, so we
// can't tell who shouldn't be notified) and items put back by "undo".
export async function handleItemAdded({ db, messaging, logger, listId, item }) {
  if (!item?.addedBy || item.restored) return { notified: 0 }

  const listSnap = await db.doc(`sharedLists/${listId}`).get()

  if (!listSnap.exists) return { notified: 0 }

  const list = listSnap.data()

  const recipients = (list.members ?? []).filter(uid => uid !== item.addedBy)

  if (recipients.length === 0) return { notified: 0 }

  const [actorSnap, productSnap] = await Promise.all([
    db.doc(`users/${item.addedBy}`).get(),
    db.doc(`products/${item.productId}`).get()
  ])

  const actorName = getActorName(actorSnap.get('email'))
  const itemName = productSnap.get('name') ?? item.productId

  let notified = 0

  for (const uid of recipients) {
    if (!(await wantsNotification(db, uid, 'itemsAdded'))) continue

    const id = itemsAddedId(listId, item.addedBy)
    const ref = db.doc(`users/${uid}/notifications/${id}`)

    // A recipe adds many items at once; the transaction keeps the
    // grouped count right when these triggers run concurrently.
    const notification = await db.runTransaction(async transaction => {
      const snap = await transaction.get(ref)
      const previous = snap.exists ? snap.data() : undefined

      const next = buildItemsAdded({
        previous: previous && {
          ...previous,
          updatedAtMs: previous.updatedAt?.toMillis?.()
        },
        listId,
        listName: list.name,
        actorId: item.addedBy,
        actorName,
        itemName,
        nowMs: Date.now()
      })

      const { isNew, ...data } = next

      transaction.set(ref, {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
        ...(isNew && { createdAt: FieldValue.serverTimestamp() })
      }, { merge: !isNew })

      return data
    })

    // Same tag every time, so the device shows the latest summary
    // instead of one alert per item.
    await sendPush({
      db,
      messaging,
      logger,
      uid,
      title: notification.title,
      body: notification.body,
      tag: id,
      url: `/main?list=${listId}`
    })

    notified++
  }

  return { notified }
}
