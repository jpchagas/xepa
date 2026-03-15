import { useState, useEffect } from 'react'
import { Box, Container, AppBar, Toolbar, Typography, Alert, Snackbar,Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material'
import { auth, db } from './firebase'
import { updatePassword, signOut } from 'firebase/auth'
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  writeBatch,
  arrayUnion
} from 'firebase/firestore'

import * as XLSX from 'xlsx'

import AddItemFab from './AddItemFab'
import MainBottomNavigation from './MainBottomNavigation'
import AddItemModal from './AddItemModal'
import ShoppingList from './ShoppingList'
import SettingsPanel from './SettingsPanel'
import ListSelector from './ListSelector'
import ListControls from './ListControls'


function MainScreen() {
  const [lists, setLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])
  const [newItem, setNewItem] = useState('')
  const [open, setOpen] = useState(false)
  const [navValue, setNavValue] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [alert, setAlert] = useState({
  open: false,
  severity: 'success',
  message: ''
  })
  const [members,setMembers] = useState([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [shareEmail, setShareEmail] = useState('')

  const isAdmin = auth.currentUser?.email === 'jpchagas@gmail.com'

  /** Load lists for current user and products */
  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    // LISTS
    const listsQuery = query(
      collection(db, 'sharedLists'),
      where('members', 'array-contains', user.uid)
    )

    const unsubscribeLists = onSnapshot(listsQuery, async snapshot => {
      let fetchedLists = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // If user has no lists, create one automatically
      if (fetchedLists.length === 0) {
        const newListRef = await addDoc(collection(db, 'sharedLists'), {
          name: 'Minha Lista',
          ownerId: user.uid,
          members: [user.uid],
          createdAt: serverTimestamp()
        })

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

        // nothing selected yet
        if (!prev) return fetchedLists[0] || null

        // check if previous list still exists
        const stillExists = fetchedLists.find(l => l.id === prev.id)

        // keep it if it exists, otherwise select first
        return stillExists || fetchedLists[0] || null
      })
    })

    // PRODUCTS
    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      snapshot => setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    )

    return () => {
      unsubscribeLists()
      unsubscribeProducts()
    }
  }, [])

  /** Load items for selected list */
  useEffect(() => {

  if (!selectedList?.id) {
    setItems([])
    return
  }

  const itemsRef = collection(db,'sharedLists',selectedList.id,'items')

  const unsubscribe = onSnapshot(itemsRef, snapshot =>
    setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  )

  return () => unsubscribe()

}, [selectedList])

  useEffect(()=>{
  const loadMembers = async () => {

    if(!selectedList) return

    const users = []

    for(const uid of selectedList.members){
      const snap = await getDoc(doc(db,'users',uid))
      if(snap.exists()){
        users.push({ id: uid, ...snap.data() })
      }
    }

    setMembers(users)
  }

  loadMembers()

},[selectedList])

  /** Helper functions */

  const showAlert = (severity, message) => {
    setAlert({
      open: true,
      severity,
      message
    })
  }

  const createList = async () => {

  const user = auth.currentUser
  if (!user || !newListName) return

  await addDoc(collection(db,'sharedLists'),{
    name: newListName,
    ownerId: user.uid,
    members: [user.uid],
    createdAt: serverTimestamp()
  })

  setNewListName('')
  setCreateDialogOpen(false)

  showAlert('success','Lista criada com sucesso!')
}

const shareList = async () => {

  if (!shareEmail || !selectedList) return

  const userQuery = query(
    collection(db,'users'),
    where('email','==',shareEmail)
  )

  const userSnap = await getDocs(userQuery)

  if(userSnap.empty){
    showAlert('error','Usuário não encontrado')
    return
  }

  const userId = userSnap.docs[0].id

  if(selectedList.members.includes(userId)){
    showAlert('warning','Usuário já possui acesso')
    return
  }

  const listRef = doc(db,'sharedLists',selectedList.id)

  await updateDoc(listRef,{
    members: arrayUnion(userId)
  })

  setShareEmail('')
  setShareDialogOpen(false)

  showAlert('success','Lista compartilhada!')
}

const deleteList = async () => {

  if (!selectedList) return

  const deletedId = selectedList.id

  await deleteDoc(doc(db,'sharedLists',deletedId))

  const remaining = lists.filter(l => l.id !== deletedId)

  setSelectedList(remaining[0] || null)

  showAlert('success','Lista removida')
}

  const clearItems = async () => {
  if (!selectedList) return

  const snapshot = await getDocs(
    collection(db,'sharedLists',selectedList.id,'items')
  )

  const batch = writeBatch(db)

  snapshot.forEach(docSnap=>{
    batch.delete(docSnap.ref)
  })

  await batch.commit()

  showAlert('success','Itens removidos da lista')
}

  const formatCurrency = (value) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : productId
  }

  const getProductUnit = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.unit : ''
  }

  const getDisplayUnit = (productId) =>
    getProductUnit(productId) === 'DZ' ? 'un' : getProductUnit(productId)

  const getEffectivePrice = (productId, price) =>
    getProductUnit(productId) === 'DZ' ? price / 12 : price

  const totalPrice = items.reduce((sum, item) => {
    if (!item.price) return sum
    const amount = item.amount || 1
    return sum + getEffectivePrice(item.productId, item.price) * amount
  }, 0)

  const getPriceColor = (current, previous) => {
    if (!previous) return 'white'
    if (current > previous) return '#ffebee'
    if (current < previous) return '#e8f5e9'
    return 'white'
  }

  /** Functions for child components */
  const addItem = async (itemId) => {
    if (!itemId || !selectedList) return

    const historyRef = collection(db, 'prices', itemId, 'history')
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
    if (docs.length > 1) previousPrice = docs[1].data().average

    await addDoc(collection(db, 'sharedLists', selectedList.id, 'items'), {
      productId: itemId,
      price: currentPrice,
      previousPrice,
      amount: 1,
      fileDate,
      createdAt: serverTimestamp()
    })

    setNewItem('')
    setOpen(false)
  }

  const updateAmount = async (id, value) => {
    if (!selectedList) return
    const amount = parseFloat(value)
    if (isNaN(amount) || amount < 0) return

    await updateDoc(doc(db, 'sharedLists', selectedList.id, 'items', id), { amount })
  }

  const removeItem = async (id) => {
    if (!selectedList) return
    await deleteDoc(doc(db, 'sharedLists', selectedList.id, 'items', id))
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

  const handleLogout = async () => await signOut(auth)
  /**/
  const extractDateFromFileName = (fileName) => {
    const match = fileName.match(/(\d{2})_(\d{2})_(\d{4})/)
    if (!match) return null

    const [_, day, month, year] = match
    return `${year}-${month}-${day}`
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
        showAlert('warning','Nome do arquivo inválido. Use padrão: Cotação DD_MM_AAAA.xlsx')
        return
      }

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)

      if (!json.length) {
        showAlert('warning','Planilha vazia.')
        return
      }

      const requiredColumns = ['Produto', 'UND', 'MAX', 'MAIS FREQUENTE', 'MÍNIMO']
      const fileColumns = Object.keys(json[0])

      const missingColumns = requiredColumns.filter(
        col => !fileColumns.includes(col)
      )

      if (missingColumns.length > 0) {
        showAlert('warning',`Colunas faltando: ${missingColumns.join(', ')}`)
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
        showAlert('warning','Nenhuma linha válida encontrada.')
        return
      }

      await batch.commit()

      showAlert('success',`${updatedCount} produtos atualizados com sucesso!`)
    } catch (error) {
      console.error(error)
      showAlert('error','Erro ao processar planilha.')
    }
  }
  /**/

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 7 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Xepa
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2 }}>
        {navValue === 0 && selectedList && (
          <>
            <ListSelector
              lists={lists}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />

            <ListControls
              selectedList={selectedList}
              members={members}
              onCreateList={() => setCreateDialogOpen(true)}
              onClearItems={clearItems}
              onShareClick={() => setShareDialogOpen(true)}
              onDeleteList={deleteList}
            />

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
          </>
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
            products={products}
            addItem={addItem}
            selectedList={selectedList}
            handlePriceUpload={handlePriceUpload}
          />
        )}
      </Container>

      {navValue === 0 && <AddItemFab onClick={() => setOpen(true)} />}
      {selectedList && (
        <AddItemModal
          open={open}
          onClose={() => setOpen(false)}
          products={products}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={addItem}
        />
      )}
      <Dialog open={createDialogOpen} onClose={()=>setCreateDialogOpen(false)}>
        <DialogTitle>Nova Lista</DialogTitle>

        <DialogContent>
          <TextField
            label="Nome da Lista"
            value={newListName}
            onChange={(e)=>setNewListName(e.target.value)}
            fullWidth
            sx={{mt:1}}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setCreateDialogOpen(false)}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={createList}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={shareDialogOpen} onClose={()=>setShareDialogOpen(false)}>
        <DialogTitle>Compartilhar Lista</DialogTitle>

        <DialogContent>
          <TextField
            label="Email do usuário"
            value={shareEmail}
            onChange={(e)=>setShareEmail(e.target.value)}
            fullWidth
            sx={{mt:1}}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={()=>setShareDialogOpen(false)}>
            Cancelar
          </Button>

          <Button variant="contained" onClick={shareList}>
            Compartilhar
          </Button>
        </DialogActions>
      </Dialog>
      <MainBottomNavigation value={navValue} onChange={setNavValue} />
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default MainScreen