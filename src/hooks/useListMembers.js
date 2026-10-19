// React
import { useEffect, useState } from 'react'

// Firebase
import {
  doc,
  getDoc
} from 'firebase/firestore'

import { db } from '../services/firebase'


function useListMembers(selectedList) {
  const [members, setMembers] = useState([])

  const memberIds =
    selectedList?.members ?? []

  // Only refetch when the member ids change, not on every
  // list snapshot.
  const memberKey =
    memberIds.join(',')

  useEffect(() => {
    if (!memberKey) return

    let cancelled = false

    Promise.all(
      memberKey
        .split(',')
        .map(uid => getDoc(doc(db, 'users', uid)))
    )
      .then(snapshots => {
        if (cancelled) return

        setMembers(
          snapshots
            .filter(snap => snap.exists())
            .map(snap => ({
              id: snap.id,
              ...snap.data()
            }))
        )
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }, [memberKey])

  // Hide removed members immediately, before the refetch lands.
  return members.filter(member =>
    memberIds.includes(member.id)
  )
}

export default useListMembers
