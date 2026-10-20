// React
import { useCallback, useEffect, useState } from 'react'

// Firebase
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported
} from 'firebase/messaging'

import app, { db, FCM_VAPID_KEY } from '../services/firebase'

// Utils
import { isInStandaloneMode, isIOS } from '../utils/deviceUtils'


const tokenKey = uid => `xepa:fcmToken:${uid}`

const readToken = uid => {
  try {
    return localStorage.getItem(tokenKey(uid))
  } catch {
    return null
  }
}

const writeToken = (uid, token) => {
  try {
    if (token) localStorage.setItem(tokenKey(uid), token)
    else localStorage.removeItem(tokenKey(uid))
  } catch {
    // Storage unavailable; the device just re-registers next time.
  }
}

// The service worker only exists in production builds (and needs a
// moment on first visit), so don't wait forever.
const waitForServiceWorker = () =>
  Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Service worker unavailable')), 10_000)
    )
  ])


// Phone/desktop notifications via Firebase Cloud Messaging. Each
// device's token is stored in users/{uid}/fcmTokens/{token}; the Cloud
// Functions push to all of them.
function usePushNotifications(user) {
  const uid = user?.uid

  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState(
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  )
  const [enabled, setEnabled] = useState(false)
  const [busy, setBusy] = useState(false)


  const registerDevice = useCallback(async () => {
    const messaging = getMessaging(app)

    const token = await getToken(messaging, {
      vapidKey: FCM_VAPID_KEY,
      serviceWorkerRegistration: await waitForServiceWorker()
    })

    const previous = readToken(uid)

    if (previous && previous !== token) {
      await deleteDoc(doc(db, 'users', uid, 'fcmTokens', previous))
    }

    await setDoc(
      doc(db, 'users', uid, 'fcmTokens', token),
      {
        userAgent: navigator.userAgent,
        lastSeenAt: serverTimestamp()
      },
      { merge: true }
    )

    writeToken(uid, token)
    setEnabled(true)
  }, [uid])


  // Detect support and keep an already-enabled device's token fresh
  // (FCM rotates tokens; stale ones are removed by the functions).
  useEffect(() => {
    if (!uid) return

    let cancelled = false

    isSupported()
      .then(async ok => {
        if (cancelled) return

        const available = ok && !!FCM_VAPID_KEY

        setSupported(available)

        if (
          available &&
          Notification.permission === 'granted' &&
          readToken(uid)
        ) {
          await registerDevice()
        }
      })
      .catch(error => console.warn('Push setup failed:', error.message))

    return () => {
      cancelled = true
    }
  }, [uid, registerDevice])


  // Returns true when notifications were turned on.
  const enable = async () => {
    setBusy(true)

    try {
      const result = await Notification.requestPermission()

      setPermission(result)

      if (result !== 'granted') return false

      await registerDevice()

      return true
    } finally {
      setBusy(false)
    }
  }

  const disable = async () => {
    setBusy(true)

    try {
      const token = readToken(uid)

      await deleteToken(getMessaging(app)).catch(() => {})

      if (token) await deleteDoc(doc(db, 'users', uid, 'fcmTokens', token))

      writeToken(uid, null)
      setEnabled(false)
    } finally {
      setBusy(false)
    }
  }

  // On logout: stop pushing this user's notifications to this device
  // (another person may log in here next).
  const forgetDevice = async () => {
    const token = readToken(uid)

    if (!token) return

    await deleteDoc(doc(db, 'users', uid, 'fcmTokens', token)).catch(() => {})

    writeToken(uid, null)
  }

  return {
    // False until FCM_VAPID_KEY is set; Settings hides the switch.
    configured: !!FCM_VAPID_KEY,
    // iOS only allows web push for apps added to the home screen.
    needsInstall: isIOS() && !isInStandaloneMode(),
    supported,
    permission,
    enabled,
    busy,
    enable,
    disable,
    forgetDevice
  }
}

export default usePushNotifications
