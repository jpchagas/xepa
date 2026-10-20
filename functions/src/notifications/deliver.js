// Delivers notifications: stores them in users/{uid}/notifications
// (the in-app panel listens to it) and sends a web push to the user's
// registered devices (users/{uid}/fcmTokens/{token}).


// Tokens FCM will never accept again; they're deleted.
const DEAD_TOKEN_ERRORS = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'messaging/invalid-argument'
])


// users/{uid}.notifications = { itemsAdded, priceIncreases }; both
// default to on.
export async function wantsNotification(db, uid, preference) {
  const userSnap = await db.doc(`users/${uid}`).get()

  return userSnap.get(`notifications.${preference}`) !== false
}


// Push to every device of `uid`. `tag` makes a newer notification
// replace an older one on the device instead of stacking.
export async function sendPush({ db, messaging, logger, uid, title, body, tag, url }) {
  const tokensSnap = await db.collection(`users/${uid}/fcmTokens`).get()

  if (tokensSnap.empty) return 0

  const tokens = tokensSnap.docs.map(doc => doc.id)

  // Data-only message: the service worker (public/push-sw.js) builds
  // the notification, so it controls icon, tag and click target.
  const response = await messaging.sendEachForMulticast({
    tokens,
    data: { title, body, tag, url },
    webpush: {
      headers: { TTL: String(24 * 60 * 60), Urgency: 'high' }
    }
  })

  const deadTokens = response.responses
    .map((result, index) =>
      !result.success && DEAD_TOKEN_ERRORS.has(result.error?.code)
        ? tokens[index]
        : null
    )
    .filter(Boolean)

  await Promise.all(
    deadTokens.map(token => db.doc(`users/${uid}/fcmTokens/${token}`).delete())
  )

  if (deadTokens.length > 0) {
    logger?.info('Removed dead FCM tokens', { uid, count: deadTokens.length })
  }

  return response.successCount
}
