import { useEffect, useState } from 'react'

// Firebase

import { db } from '../services/firebase'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'


function useShoppingItems(selectedList, products) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!selectedList?.id) {
      setItems([])
      return
    }

    const itemsRef = collection(
      db,
      'sharedLists',
      selectedList.id,
      'items'
    )

    const unsubscribe = onSnapshot(
      itemsRef,
      snapshot => {
        setItems(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      }
    )

    return () => unsubscribe()
  }, [selectedList])

  const addItem = async newItem => {
    if (!newItem || !selectedList) return

    let productId

    // Existing product
    if (newItem.type === 'existing') {
      productId = newItem.product.id
    }

    // New product
    if (newItem.type === 'new') {
      const name = newItem.name.trim()

      if (!name) return

      const existing = products.find(
        product =>
          product.name.toLowerCase() ===
          name.toLowerCase()
      )

      if (existing) {
        productId = existing.id
      } else {
        const docRef = await addDoc(
          collection(db, 'products'),
          {
            name,
            unit: null,
            createdAt: serverTimestamp()
          }
        )

        productId = docRef.id
      }
    }

    if (!productId) return

    // Get price history
    const historyRef = collection(
      db,
      'prices',
      productId,
      'history'
    )

    const priceQuery = query(
      historyRef,
      orderBy('fileDate', 'desc'),
      limit(2)
    )

    const snapshot = await getDocs(
      priceQuery
    )

    let currentPrice = null
    let previousPrice = null
    let fileDate = null

    const docs = snapshot.docs

    if (docs.length > 0) {
      currentPrice =
        docs[0].data().average

      fileDate =
        docs[0].data().fileDate
    }

    if (docs.length > 1) {
      previousPrice =
        docs[1].data().average
    }

    // Add item to selected list
    await addDoc(
      collection(
        db,
        'sharedLists',
        selectedList.id,
        'items'
      ),
      {
        productId,
        price: currentPrice,
        previousPrice,
        amount: 1,
        fileDate,
        createdAt: serverTimestamp(),
        isCustom:
          newItem.type === 'new'
      }
    )
  }

  const updateAmount = async (
    id,
    value
  ) => {
    if (!selectedList) return

    const amount = parseFloat(value)

    if (isNaN(amount) || amount < 0) {
      return
    }

    await updateDoc(
      doc(
        db,
        'sharedLists',
        selectedList.id,
        'items',
        id
      ),
      {
        amount
      }
    )
  }

  const removeItem = async id => {
    if (!selectedList) return

    await deleteDoc(
      doc(
        db,
        'sharedLists',
        selectedList.id,
        'items',
        id
      )
    )
  }

  return {
    items,
    addItem,
    updateAmount,
    removeItem
  }
}

export default useShoppingItems