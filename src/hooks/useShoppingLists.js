import { useEffect, useState } from 'react'

// Firebase

import { auth, db } from '../services/firebase'

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'


function useShoppingLists() {
  const [lists, setLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)

  useEffect(() => {
    const user = auth.currentUser

    if (!user) return

    const listsQuery = query(
      collection(db, 'sharedLists'),
      where('members', 'array-contains', user.uid)
    )

    const unsubscribe = onSnapshot(listsQuery, async snapshot => {
      let fetchedLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // If user has no lists, create one automatically
      if (fetchedLists.length === 0) {
        const newListRef = await addDoc(
          collection(db, 'sharedLists'),
          {
            name: 'Minha Lista',
            ownerId: user.uid,
            members: [user.uid],
            createdAt: serverTimestamp()
          }
        )

        const newList = {
          id: newListRef.id,
          name: 'Minha Lista',
          ownerId: user.uid,
          members: [user.uid]
        }

        fetchedLists = [newList]
      }

      setLists(fetchedLists)

      setSelectedList(prev => {
        // Nothing selected yet
        if (!prev) {
          return fetchedLists[0] || null
        }

        // Check if previous list still exists
        const stillExists = fetchedLists.find(
          list => list.id === prev.id
        )

        // Keep it if it exists, otherwise select first
        return stillExists || fetchedLists[0] || null
      })
    })

    return () => unsubscribe()
  }, [])

  const createList = async name => {
    const user = auth.currentUser

    if (!user || !name) return

    await addDoc(
      collection(db, 'sharedLists'),
      {
        name,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: serverTimestamp()
      }
    )
  }

  const removeMember = async userId => {
    if (!selectedList) return

    const listRef = doc(
      db,
      'sharedLists',
      selectedList.id
    )

    await updateDoc(listRef, {
      members: arrayRemove(userId)
    })
  }

  const leaveList = async () => {
    const user = auth.currentUser

    if (!selectedList || !user) return

    const listRef = doc(
      db,
      'sharedLists',
      selectedList.id
    )

    await updateDoc(listRef, {
      members: arrayRemove(user.uid)
    })
  }

  const shareList = async email => {
    if (!email || !selectedList) {
      return {
        success: false,
        reason: 'invalid'
      }
    }

    const userQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    )

    const userSnap = await getDocs(userQuery)

    if (userSnap.empty) {
      return {
        success: false,
        reason: 'not-found'
      }
    }

    const userId = userSnap.docs[0].id

    if (selectedList.members.includes(userId)) {
      return {
        success: false,
        reason: 'already-member'
      }
    }

    const listRef = doc(
      db,
      'sharedLists',
      selectedList.id
    )

    await updateDoc(listRef, {
      members: arrayUnion(userId)
    })

    return {
      success: true
    }
  }

  const deleteList = async () => {
    if (!selectedList) return

    await deleteDoc(
      doc(db, 'sharedLists', selectedList.id)
    )
  }

  const clearItems = async () => {
    if (!selectedList) return

    const snapshot = await getDocs(
      collection(
        db,
        'sharedLists',
        selectedList.id,
        'items'
      )
    )

    const batch = writeBatch(db)

    snapshot.forEach(docSnap => {
      batch.delete(docSnap.ref)
    })

    await batch.commit()
  }

  return {
    lists,
    selectedList,
    setSelectedList,
    createList,
    removeMember,
    leaveList,
    shareList,
    deleteList,
    clearItems
  }
}

export default useShoppingLists
