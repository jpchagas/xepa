// React
import { useEffect, useRef, useState } from 'react'

// Firebase
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  writeBatch
} from 'firebase/firestore'

import { db } from '../services/firebase'


// The user's notifications (users/{uid}/notifications, written by the
// Cloud Functions). `onArrive` fires for notifications that arrive or
// get updated while the app is open, to show them as a toast.
function useNotifications(user, { onArrive } = {}) {
  const uid = user?.uid

  const [notifications, setNotifications] = useState([])

  const onArriveRef = useRef(onArrive)

  useEffect(() => {
    onArriveRef.current = onArrive
  }, [onArrive])


  useEffect(() => {
    if (!uid) return

    const openedAt = Date.now()
    const announced = new Map()

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'users', uid, 'notifications'),
        orderBy('updatedAt', 'desc'),
        limit(30)
      ),
      snapshot => {
        const toNotification = docSnap => ({
          id: docSnap.id,
          ...docSnap.data({ serverTimestamps: 'estimate' })
        })

        setNotifications(snapshot.docs.map(toNotification))

        snapshot.docChanges().forEach(change => {
          if (change.type === 'removed') return

          const notification = toNotification(change.doc)
          const updatedAt = notification.updatedAt?.toMillis?.() ?? 0

          // Only news from this session, and each update once.
          if (
            notification.read ||
            updatedAt <= openedAt ||
            announced.get(notification.id) === updatedAt
          ) {
            return
          }

          announced.set(notification.id, updatedAt)
          onArriveRef.current?.(notification)
        })
      },
      error => {
        console.warn('Notifications unavailable:', error.code)
      }
    )

    return () => unsubscribe()
  }, [uid])


  const unreadCount =
    notifications.filter(notification => !notification.read).length

  const markAllRead = () => {
    const unread = notifications.filter(notification => !notification.read)

    if (!uid || unread.length === 0) return

    const batch = writeBatch(db)

    unread.forEach(notification => {
      batch.update(
        doc(db, 'users', uid, 'notifications', notification.id),
        { read: true }
      )
    })

    batch.commit().catch(error => console.warn('markAllRead failed:', error.code))
  }

  return {
    notifications,
    unreadCount,
    markAllRead
  }
}

export default useNotifications
