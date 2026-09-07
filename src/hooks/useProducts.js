// React

import { useEffect, useState } from 'react'

// Firebase

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase'


function useProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const productsRef = collection(
      db,
      'products'
    )

    const unsubscribe = onSnapshot(
      productsRef,
      snapshot => {
        setProducts(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )
      }
    )

    return () => unsubscribe()
  }, [])

  return {
    products
  }
}


export default useProducts