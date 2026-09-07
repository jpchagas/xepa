import { useEffect, useState } from 'react'

// Firebase

import { db } from '../services/firebase'

import {
  doc,
  getDoc
} from 'firebase/firestore'


function useListMembers(selectedList) {
  const [members, setMembers] = useState([])

  useEffect(() => {
    const loadMembers = async () => {
      if (!selectedList) {
        setMembers([])
        return
      }

      const users = []

      for (const uid of selectedList.members) {
        const snap = await getDoc(
          doc(db, 'users', uid)
        )

        if (snap.exists()) {
          users.push({
            id: uid,
            ...snap.data()
          })
        }
      }

      setMembers(users)
    }

    loadMembers()
  }, [selectedList])

  return members
}

export default useListMembers