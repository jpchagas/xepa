import { useState, useEffect } from 'react'
import { Box, Container, AppBar, Toolbar, Typography, Modal } from '@mui/material'
import { auth, db } from './firebase'
import { updatePassword, signOut } from 'firebase/auth'
import { collection, doc, addDoc, deleteDoc, updateDoc, onSnapshot, serverTimestamp, getDoc, setDoc, writeBatch, query, orderBy, limit, getDocs } from 'firebase/firestore'
import * as XLSX from 'xlsx'

import AddItemFab from './AddItemFab'
import MainBottomNavigation from './MainBottomNavigation'
import AddItemModal from './AddItemModal'
import ShoppingList from './ShoppingList'
import SettingsPanel from './SettingsPanel'

function MainScreen() {
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [newItem, setNewItem] = useState('')
  const [open, setOpen] = useState(false)
  const [navValue, setNavValue] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const isAdmin = auth.currentUser?.email === 'jpchagas@gmail.com'

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const userDocRef = doc(db, 'users', user.uid)

    const loadUserProfile = async () => {
      const snap = await getDoc(userDocRef)
      if (!snap.exists()) await setDoc(userDocRef, { email: user.email, createdAt: serverTimestamp() })
    }

    loadUserProfile()

    const unsubscribeItems = onSnapshot(collection(db, 'users', user.uid, 'shoppingList'), snapshot => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => { unsubscribeItems(); unsubscribeProducts() }
  }, [])

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : productId
  }

  const getProductUnit = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.unit : ''
  }

  const getDisplayUnit = (productId) => {

    const unit = getProductUnit(productId)

    if (unit === 'DZ') return 'un'

    return unit
  }

  const getEffectivePrice = (productId, price) => {

    const unit = getProductUnit(productId)

    if (unit === 'DZ') {
      return price / 12
    }

    return price
  }

  const totalPrice = items.reduce((sum, item) => {

    if (!item.price) return sum

    const amount = item.amount || 1
    const effectivePrice = getEffectivePrice(item.productId, item.price)

    return sum + effectivePrice * amount

  }, 0)

  const extractDateFromFileName = (fileName) => {

    const match = fileName.match(/(\d{2})_(\d{2})_(\d{4})/)

    if (!match) return null

    const [_, day, month, year] = match

    return `${year}-${month}-${day}`

  }

  const addItem = async () => {

    if (!newItem) return

    const user = auth.currentUser
    if (!user) return

    const historyRef = collection(db, 'prices', newItem, 'history')

    const q = query(historyRef, orderBy('fileDate', 'desc'), limit(2))

    const snapshot = await getDocs(q)

    let currentPrice = null
    let previousPrice = null
    let fileDate = null

    const docs = snapshot.docs

    if (docs.length > 0) {
      currentPrice = docs[0].data().average
      fileDate = docs[0].data().fileDate
    }

    if (docs.length > 1) {
      previousPrice = docs[1].data().average
    }

    await addDoc(collection(db, 'users', user.uid, 'shoppingList'), {
      productId: newItem,
      price: currentPrice,
      previousPrice: previousPrice,
      amount: 1,
      fileDate,
      createdAt: serverTimestamp()
    })

    setNewItem('')
    setOpen(false)

  }

  const updateAmount = async (id, value) => {

    const user = auth.currentUser
    if (!user) return

    const amount = parseFloat(value)

    if (isNaN(amount) || amount < 0) return

    await updateDoc(
      doc(db, 'users', user.uid, 'shoppingList', id),
      { amount }
    )

  }

  const removeItem = async (id) => {

    const user = auth.currentUser
    if (!user) return

    await deleteDoc(doc(db, 'users', user.uid, 'shoppingList', id))

  }

  const normalizeProductId = (name) => {

    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '_')
      .replace(/[()\/]/g, '')

  }

  const handlePriceUpload = async (event) => {

    const file = event.target.files[0]
    if (!file) return

    try {

      const fileDate = extractDateFromFileName(file.name)

      if (!fileDate) {
        alert('Nome do arquivo inválido. Use padrão: Cotação DD_MM_AAAA.xlsx')
        return
      }

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)

      if (!json.length) {
        alert('Planilha vazia.')
        return
      }

      const requiredColumns = ['Produto', 'UND', 'MAX', 'MAIS FREQUENTE', 'MÍNIMO']
      const fileColumns = Object.keys(json[0])

      const missingColumns = requiredColumns.filter(
        col => !fileColumns.includes(col)
      )

      if (missingColumns.length > 0) {
        alert(`Colunas faltando: ${missingColumns.join(', ')}`)
        return
      }

      const batch = writeBatch(db)
      let updatedCount = 0

      for (const row of json) {

        const name = row['Produto']
        if (!name) continue

        const productId = normalizeProductId(name)

        const max = Number(row['MAX'])
        const min = Number(row['MÍNIMO'])
        const average = Number(row['MAIS FREQUENTE'])
        const unit = row['UND'] || null

        if (isNaN(max) || isNaN(min) || isNaN(average)) continue
        if (!(min <= average && average <= max)) continue

        const productRef = doc(db, 'products', productId)
        const productSnap = await getDoc(productRef)

        if (!productSnap.exists()) {
          batch.set(productRef, {
            name,
            unit,
            createdAt: serverTimestamp()
          })
        }

        const priceHistoryRef = doc(
          db,
          'prices',
          productId,
          'history',
          fileDate
        )

        batch.set(priceHistoryRef, {
          max,
          min,
          average,
          fileDate,
          uploadedAt: serverTimestamp()
        })

        updatedCount++

      }

      if (updatedCount === 0) {
        alert('Nenhuma linha válida encontrada.')
        return
      }

      await batch.commit()

      alert(`${updatedCount} produtos atualizados com sucesso!`)

    } catch (error) {

      console.error(error)
      alert('Erro ao processar planilha.')

    }

  }

  const handleChangePassword = async () => {

    setPasswordError('')
    setPasswordMessage('')

    try {

      await updatePassword(auth.currentUser, newPassword)

      setPasswordMessage('Senha alterada com sucesso!')
      setNewPassword('')

    } catch {

      setPasswordError('Faça login novamente para alterar a senha.')

    }

  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const getPriceColor = (current, previous) => {

    if (!previous) return 'white'
    if (current > previous) return '#ffebee'
    if (current < previous) return '#e8f5e9'

    return 'white'

  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 7 }}>
      <AppBar position="static"><Toolbar><Typography variant="h6" sx={{ flexGrow: 1 }}>Xepa</Typography></Toolbar></AppBar>

      <Container sx={{ mt: 2 }}>
        {navValue === 0 && (
          <ShoppingList
            items={items}
            getProductName={getProductName}
            getProductUnit={getProductUnit}
            getDisplayUnit={getDisplayUnit}
            getEffectivePrice={getEffectivePrice}
            updateAmount={updateAmount}
            removeItem={removeItem}
            getPriceColor={getPriceColor}
            formatCurrency={formatCurrency}
            totalPrice={totalPrice}
          />
        )}

        {navValue === 1 && (
          <SettingsPanel
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            passwordError={passwordError}
            passwordMessage={passwordMessage}
            handleChangePassword={handleChangePassword}
            handleLogout={handleLogout}
            isAdmin={isAdmin}
            handlePriceUpload={handlePriceUpload}
          />
        )}
      </Container>

      {navValue === 0 && <AddItemFab onClick={() => setOpen(true)} />}
      <AddItemModal open={open} onClose={() => setOpen(false)} products={products} newItem={newItem} setNewItem={setNewItem} addItem={addItem} />
      <MainBottomNavigation value={navValue} onChange={setNavValue} />
    </Box>
  )

}

export default MainScreen