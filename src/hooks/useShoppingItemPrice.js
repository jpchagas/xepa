// React

import { useState } from 'react'

// Firebase

import {
  doc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'

import { db } from '../services/firebase'


function useShoppingItemPrice(
  listId,
  item,
  unitValue
) {
  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState(null)


  const savePrice = async (
    price,
    unit
  ) => {
    if (!listId || !item?.productId) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const today =
        new Date()
          .toISOString()
          .split('T')[0]


      // Update product unit if missing

      if (!unitValue && unit) {
        await updateDoc(
            doc(
            db,
            'products',
            item.productId
            ),
            {
            unit
            }
        )
        }


      // Save price history

      await setDoc(
        doc(
          db,
          'prices',
          item.productId,
          'history',
          today
        ),
        {
          average: Number(price),
          min: Number(price),
          max: Number(price),
          fileDate: today,
          uploadedAt:
            serverTimestamp()
        }
      )


      // Update shopping-list item

      await updateDoc(
        doc(
          db,
          'sharedLists',
          listId,
          'items',
          item.id
        ),
        {
          price: Number(price),
          previousPrice:
            item.price || null,
          fileDate: today
        }
      )
    } catch (error) {
      console.error(error)

      setError(error)

      throw error
    } finally {
      setSaving(false)
    }
  }


  return {
    savePrice,
    saving,
    error
  }
}


export default useShoppingItemPrice