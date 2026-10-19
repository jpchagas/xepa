// React
import { useEffect, useState } from 'react'

// Firebase
import { doc, onSnapshot } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'

import { db, functions } from '../services/firebase'


// The first import backfills 90 days and can take a few minutes.
const refreshCeasaPrices = httpsCallable(
  functions,
  'refreshCeasaPrices',
  { timeout: 540_000 }
)


// Status of the automatic CEASA price import (meta/ceasa, written by
// the scheduled Cloud Function) plus an on-demand refresh for admins.
function useCeasaSync() {
  const [status, setStatus] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'meta', 'ceasa'),
      snapshot => {
        setStatus(snapshot.exists() ? snapshot.data() : null)
      },
      error => {
        // Not fatal: Settings just won't show the last update.
        console.warn('CEASA status unavailable:', error.code)
      }
    )

    return () => unsubscribe()
  }, [])

  // Resolves to { importedDates, updatedProducts }.
  const refresh = async () => {
    setRefreshing(true)

    try {
      const { data } = await refreshCeasaPrices()

      return data
    } finally {
      setRefreshing(false)
    }
  }

  return {
    status,
    refreshing,
    refresh
  }
}

export default useCeasaSync
