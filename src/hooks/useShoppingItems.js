// React
import { useEffect, useRef, useState } from 'react'

// Firebase
import {
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch
} from 'firebase/firestore'

import { db } from '../services/firebase'

// Utils
import {
  findProductByName,
  getItemAmount,
  normalizeText
} from '../utils/shoppingHelpers'


const NO_ITEMS = []

const today = () =>
  new Date().toISOString().split('T')[0]


// Writes are not awaited: Firestore applies them to the local
// cache immediately (the snapshot updates the UI) and syncs when
// online. Failures are reported through `onError`.
// `userId` is stored as `addedBy` on new items so the other members
// of a shared list get notified (functions/src/notifications).
function useShoppingItems(listId, products, { onError, userId } = {}) {
  const [state, setState] = useState({
    listId: null,
    items: NO_ITEMS
  })

  const onErrorRef = useRef(onError)

  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])


  useEffect(() => {
    if (!listId) return

    const unsubscribe = onSnapshot(
      collection(db, 'sharedLists', listId, 'items'),
      snapshot => {
        setState({
          listId,
          items: snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
          }))
        })
      },
      error => {
        console.error(error)
        setState({ listId, items: NO_ITEMS })
      }
    )

    return () => unsubscribe()
  }, [listId])


  // Items from a previously selected list are never shown.
  const isCurrent =
    !!listId && state.listId === listId

  const items =
    isCurrent ? state.items : NO_ITEMS

  const loading =
    !!listId && !isCurrent


  const track = write => {
    write.catch(error => {
      console.error(error)
      onErrorRef.current?.(error)
    })
  }

  const itemsRef = () =>
    collection(db, 'sharedLists', listId, 'items')

  const itemRef = id =>
    doc(db, 'sharedLists', listId, 'items', id)


  const updateAmount = (id, amount) => {
    if (!listId) return

    if (isNaN(amount) || amount < 0) return

    track(
      updateDoc(itemRef(id), { amount })
    )
  }


  const getLatestPrices = async productId => {
    const snapshot = await getDocs(
      query(
        collection(db, 'prices', productId, 'history'),
        orderBy('fileDate', 'desc'),
        limit(2)
      )
    )

    const [latest, previous] =
      snapshot.docs.map(docSnap => docSnap.data())

    return {
      price: latest?.average ?? null,
      previousPrice: previous?.average ?? null,
      fileDate: latest?.fileDate ?? null
    }
  }


  // newItem: { type: 'existing', product } | { type: 'new', name }
  // Adding a product that's already on the list bumps its amount.
  const addItem = async newItem => {
    if (!newItem || !listId) return null

    let productId = null
    let isNewProduct = false

    if (newItem.type === 'existing') {
      productId = newItem.product.id
    }

    if (newItem.type === 'new') {
      const name = newItem.name.trim()

      if (!name) return null

      // A new product has no brand yet (it's set in the price
      // editor), so only a brandless product with this name is reused.
      const existingProduct = findProductByName(products, name)

      if (existingProduct) {
        productId = existingProduct.id
      } else {
        const productRef =
          doc(collection(db, 'products'))

        track(
          setDoc(productRef, {
            name,
            unit: null,
            createdAt: serverTimestamp()
          })
        )

        productId = productRef.id
        isNewProduct = true
      }
    }

    if (!productId) return null

    const existingItem = items.find(
      item => item.productId === productId
    )

    if (existingItem) {
      updateAmount(
        existingItem.id,
        getItemAmount(existingItem) + 1
      )

      return { status: 'incremented', productId }
    }

    // Snapshot the latest two prices so the list can show
    // the trend without reading history again.
    const prices = isNewProduct
      ? { price: null, previousPrice: null, fileDate: null }
      : await getLatestPrices(productId)

    track(
      setDoc(doc(itemsRef()), {
        productId,
        ...prices,
        amount: 1,
        checked: false,
        addedBy: userId ?? null,
        createdAt: serverTimestamp(),
        isCustom: newItem.type === 'new'
      })
    )

    return { status: 'added', productId }
  }


  // Manual price for products CEASA doesn't quote. Stored as the
  // product's live price (every list sees it), in its history, and on
  // the item itself as a fallback.
  // `brand` (optional) names the product's brand. When that name +
  // brand already exists, the item moves to it so each brand keeps a
  // single price; otherwise the brand is set on the product.
  const setItemPrice = (item, price, unit, brand) => {
    if (!listId || !item?.productId) return

    const product = products.find(
      candidate => candidate.id === item.productId
    )

    const target = brand && product
      ? findProductByName(products, product.name, brand)
      : null

    const productId = target?.id ?? item.productId

    const previous = target
      ? target.latestPrice
      : item.price && { average: item.price, fileDate: item.fileDate }

    const date = today()

    const quote = {
      average: price,
      min: price,
      max: price,
      fileDate: date
    }

    const batch = writeBatch(db)

    batch.set(
      doc(db, 'products', productId),
      {
        ...(unit && !target?.unit && { unit }),
        ...(brand && !target && { brand }),
        latestPrice: { ...quote, source: 'manual' },
        previousPrice: previous?.average
          ? { average: previous.average, fileDate: previous.fileDate ?? null }
          : null,
        priceUpdatedAt: serverTimestamp()
      },
      { merge: true }
    )

    batch.set(
      doc(db, 'prices', productId, 'history', date),
      {
        ...quote,
        source: 'manual',
        uploadedAt: serverTimestamp()
      }
    )

    const prices = {
      price,
      previousPrice: previous?.average ?? null,
      fileDate: date
    }

    const existingItem = target && items.find(
      candidate => candidate.productId === target.id
    )

    if (existingItem) {
      // That brand is already on the list: merge into it.
      batch.update(itemRef(existingItem.id), {
        ...prices,
        amount:
          Math.round(
            (getItemAmount(existingItem) + getItemAmount(item)) * 1000
          ) / 1000
      })

      batch.delete(itemRef(item.id))
    } else {
      batch.update(itemRef(item.id), { ...prices, productId })
    }

    track(batch.commit())
  }


  // Adds a recipe's ingredients in one batch.
  // entries: [{ productId, name, ceasa, amount }]; productId is null
  // for products that don't exist yet. Items already on the list get
  // the amount added (and are unchecked, since more is needed).
  const addRecipeItems = (entries, recipeName) => {
    if (!listId || entries.length === 0) return null

    const productsById = new Map(
      products.map(product => [product.id, product])
    )

    const batch = writeBatch(db)

    let added = 0
    let updated = 0

    for (const entry of entries) {
      let productId = entry.productId

      // Off-CEASA entries never reuse a CEASA product with the same
      // name (CEASA's "Mostarda" is mustard greens).
      const product = productId
        ? productsById.get(productId)
        : products.find(
            candidate =>
              !candidate.category &&
              !candidate.brand &&
              normalizeText(candidate.name) === normalizeText(entry.name)
          )

      if (product) {
        productId = product.id
      } else if (productId) {
        // CEASA product not imported yet: create it under its CEASA id
        // so the next import fills in unit, category and price.
        batch.set(
          doc(db, 'products', productId),
          { name: entry.name, unit: null, createdAt: serverTimestamp() },
          { merge: true }
        )
      } else {
        const productRef = doc(collection(db, 'products'))

        batch.set(productRef, {
          name: entry.name,
          unit: null,
          createdAt: serverTimestamp()
        })

        productId = productRef.id
      }

      const existingItem = items.find(
        item => item.productId === productId
      )

      if (existingItem) {
        batch.update(itemRef(existingItem.id), {
          amount:
            Math.round(
              (getItemAmount(existingItem) + entry.amount) * 1000
            ) / 1000,
          checked: false,
          recipes: arrayUnion(recipeName)
        })

        updated++
        continue
      }

      batch.set(doc(itemsRef()), {
        productId,
        price: product?.latestPrice?.average ?? null,
        previousPrice: product?.previousPrice?.average ?? null,
        fileDate: product?.latestPrice?.fileDate ?? null,
        amount: entry.amount,
        checked: false,
        isCustom: !entry.ceasa,
        recipes: [recipeName],
        addedBy: userId ?? null,
        createdAt: serverTimestamp()
      })

      added++
    }

    track(batch.commit())

    return { added, updated }
  }


  // Replaces the item's product with a cheaper, similar one. The amount
  // and recipes stay; `swappedFrom` records the original for the
  // "Trocado de ..." caption and for undo.
  const swapItem = (item, product, fromName) => {
    if (!listId) return

    track(
      updateDoc(itemRef(item.id), {
        productId: product.id,
        price: product.latestPrice?.average ?? null,
        previousPrice: product.previousPrice?.average ?? null,
        fileDate: product.latestPrice?.fileDate ?? null,
        swappedFrom: { productId: item.productId, name: fromName }
      })
    )
  }

  // Puts back the fields an item had before swapItem.
  const undoSwap = item => {
    if (!listId) return

    track(
      updateDoc(itemRef(item.id), {
        productId: item.productId,
        price: item.price ?? null,
        previousPrice: item.previousPrice ?? null,
        fileDate: item.fileDate ?? null,
        swappedFrom: item.swappedFrom ?? deleteField()
      })
    )
  }

  // "Manter": don't suggest this alternative for this item again.
  const dismissSwap = (item, productId) => {
    if (!listId) return

    track(
      updateDoc(itemRef(item.id), {
        swapDismissed: arrayUnion(productId)
      })
    )
  }


  const toggleChecked = item => {
    if (!listId) return

    track(
      updateDoc(itemRef(item.id), {
        checked: !item.checked
      })
    )
  }


  const removeItem = item => {
    if (!listId) return

    track(deleteDoc(itemRef(item.id)))
  }


  // Puts a removed item back with the same id (undo).
  const restoreItem = item => {
    if (!listId) return

    const { id, ...data } = item

    // `restored` stops the "item added" notification from firing again.
    track(setDoc(itemRef(id), { ...data, restored: true }))
  }


  const deleteItems = itemsToDelete => {
    if (!listId || itemsToDelete.length === 0) return

    const batch = writeBatch(db)

    itemsToDelete.forEach(item => {
      batch.delete(itemRef(item.id))
    })

    track(batch.commit())
  }

  const clearItems = () =>
    deleteItems(items)

  const removeCheckedItems = () =>
    deleteItems(items.filter(item => item.checked))


  return {
    items,
    loading,
    addItem,
    addRecipeItems,
    updateAmount,
    setItemPrice,
    swapItem,
    undoSwap,
    dismissSwap,
    toggleChecked,
    removeItem,
    restoreItem,
    clearItems,
    removeCheckedItems
  }
}

export default useShoppingItems
