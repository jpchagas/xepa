// Web push for Xepa. Imported into the Workbox service worker
// (vite.config.js -> workbox.importScripts).
//
// Messages are data-only, sent by functions/src/notifications/deliver.js:
//   { title, body, tag, url }

// iOS requires every push to show a notification.
const IS_IOS = /iphone|ipad|ipod/i.test(self.navigator.userAgent)

const readPayload = event => {
  try {
    const payload = event.data ? event.data.json() : {}

    // FCM wraps data messages as { data: {...}, from, ... }.
    return payload.data || payload.notification || payload
  } catch {
    return {}
  }
}

const getWindows = () =>
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })


self.addEventListener('push', event => {
  const data = readPayload(event)

  event.waitUntil(
    (async () => {
      // App open and in front: it already shows the notification as a
      // toast, so don't duplicate it on the system tray.
      if (!IS_IOS) {
        const windows = await getWindows()

        if (windows.some(client => client.focused && client.visibilityState === 'visible')) {
          return
        }
      }

      await self.registration.showNotification(data.title || 'Xepa', {
        body: data.body || '',
        tag: data.tag,
        // Updating a grouped notification shouldn't buzz again.
        renotify: false,
        icon: '/icon-192.png',
        data: { url: data.url || '/main' }
      })
    })()
  )
})


self.addEventListener('notificationclick', event => {
  event.notification.close()

  const url = new URL(
    event.notification.data?.url || '/main',
    self.location.origin
  ).href

  event.waitUntil(
    (async () => {
      const windows = await getWindows()

      const client = windows.find(
        candidate => new URL(candidate.url).origin === self.location.origin
      )

      if (!client) {
        await self.clients.openWindow(url)
        return
      }

      // The app routes in place (no reload); see useServiceWorkerMessages.
      await client.focus()
      client.postMessage({ type: 'xepa:open', url })
    })()
  )
})
