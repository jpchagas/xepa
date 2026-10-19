// React
import { useEffect, useRef, useState } from 'react'

// Firebase
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore'

import { db } from '../services/firebase'


const DEFAULT_LIST_NAME = 'Minha Lista'

const selectedListKey = uid =>
  `xepa:selectedList:${uid}`

const readSelectedListId = uid => {
  try {
    return localStorage.getItem(selectedListKey(uid))
  } catch {
    return null
  }
}

const writeSelectedListId = (uid, listId) => {
  try {
    localStorage.setItem(selectedListKey(uid), listId)
  } catch {
    // Storage unavailable (private mode); selection just isn't remembered.
  }
}

// Oldest first, so the default list stays on top.
// Lists with a pending server timestamp go last.
const byCreatedAt = (a, b) =>
  (a.createdAt?.toMillis?.() ?? Infinity) -
  (b.createdAt?.toMillis?.() ?? Infinity)


function useShoppingLists(user) {
  const uid = user?.uid

  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedListId, setSelectedListId] =
    useState(() => (uid ? readSelectedListId(uid) : null))

  const creatingDefaultList = useRef(false)


  useEffect(() => {
    if (!uid) return

    const listsQuery = query(
      collection(db, 'sharedLists'),
      where('members', 'array-contains', uid)
    )

    // Metadata changes are needed so we hear about the server
    // result after an empty snapshot that came from the cache.
    const unsubscribe = onSnapshot(
      listsQuery,
      { includeMetadataChanges: true },
      async snapshot => {
        const fetchedLists = snapshot.docs
          .map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }))
          .sort(byCreatedAt)

        if (fetchedLists.length === 0) {
          // An empty cache (new device, cleared storage) doesn't mean
          // the user has no lists. Only the server can tell us that.
          if (
            snapshot.metadata.fromCache ||
            creatingDefaultList.current
          ) {
            return
          }

          creatingDefaultList.current = true

          try {
            await addDoc(collection(db, 'sharedLists'), {
              name: DEFAULT_LIST_NAME,
              ownerId: uid,
              members: [uid],
              createdAt: serverTimestamp()
            })
          } finally {
            creatingDefaultList.current = false
          }

          return
        }

        setLists(fetchedLists)
        setLoading(false)
      },
      error => {
        console.error(error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [uid])


  // Fall back to the first list when the remembered one was
  // deleted or the user left it.
  const selectedList =
    lists.find(list => list.id === selectedListId) ??
    lists[0] ??
    null


  const selectList = listId => {
    setSelectedListId(listId)

    if (uid) writeSelectedListId(uid, listId)
  }


  // Selects the new list right away; the write syncs in the
  // background so this also works offline.
  const createList = name => {
    const trimmedName = name.trim()

    if (!uid || !trimmedName) return null

    const listRef = doc(collection(db, 'sharedLists'))

    selectList(listRef.id)

    const write = setDoc(listRef, {
      name: trimmedName,
      ownerId: uid,
      members: [uid],
      createdAt: serverTimestamp()
    })

    return { id: listRef.id, write }
  }


  const removeMember = async userId => {
    if (!selectedList) return

    await updateDoc(
      doc(db, 'sharedLists', selectedList.id),
      {
        members: arrayRemove(userId)
      }
    )
  }


  const leaveList = async () => {
    if (!selectedList || !uid) return

    await updateDoc(
      doc(db, 'sharedLists', selectedList.id),
      {
        members: arrayRemove(uid)
      }
    )
  }


  const shareList = async email => {
    const normalizedEmail =
      email.trim().toLowerCase()

    if (!normalizedEmail || !selectedList) {
      return {
        success: false,
        reason: 'invalid'
      }
    }

    const userSnap = await getDocs(
      query(
        collection(db, 'users'),
        where('email', '==', normalizedEmail)
      )
    )

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

    await updateDoc(
      doc(db, 'sharedLists', selectedList.id),
      {
        members: arrayUnion(userId)
      }
    )

    return {
      success: true
    }
  }


  // Deletes the items too; Firestore doesn't remove
  // subcollections when the parent doc is deleted.
  const deleteList = async () => {
    if (!selectedList) return

    const listRef =
      doc(db, 'sharedLists', selectedList.id)

    const itemsSnap = await getDocs(
      collection(listRef, 'items')
    )

    const batch = writeBatch(db)

    itemsSnap.forEach(itemSnap => {
      batch.delete(itemSnap.ref)
    })

    batch.delete(listRef)

    await batch.commit()
  }


  return {
    lists,
    loading,
    selectedList,
    selectList,
    createList,
    removeMember,
    leaveList,
    shareList,
    deleteList
  }
}

export default useShoppingLists
