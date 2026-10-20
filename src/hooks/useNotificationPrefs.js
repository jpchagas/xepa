// React
import { useEffect, useState } from 'react'

// Firebase
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

import { db } from '../services/firebase'


// users/{uid}.notifications = { itemsAdded, priceIncreases }.
// Missing means on; the Cloud Functions read the same fields.
function useNotificationPrefs(user) {
  const uid = user?.uid

  const [prefs, setPrefs] = useState({})

  useEffect(() => {
    if (!uid) return

    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      snapshot => setPrefs(snapshot.get('notifications') ?? {}),
      error => console.warn('Notification prefs unavailable:', error.code)
    )

    return () => unsubscribe()
  }, [uid])

  const setPreference = (key, value) =>
    setDoc(
      doc(db, 'users', uid),
      { notifications: { [key]: value } },
      { merge: true }
    )

  return {
    itemsAdded: prefs.itemsAdded !== false,
    priceIncreases: prefs.priceIncreases !== false,
    setPreference
  }
}

export default useNotificationPrefs
