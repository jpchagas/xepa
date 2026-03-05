import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Fab,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Modal,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import SettingsIcon from '@mui/icons-material/Settings'

import { auth, db } from './firebase'
import { updatePassword, signOut } from 'firebase/auth'

import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  setDoc,
  writeBatch,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore'

import * as XLSX from 'xlsx'

import './MainScreen.css'

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
      if (!snap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: serverTimestamp()
        })
      }
    }

    loadUserProfile()

    const unsubscribeItems = onSnapshot(
      collection(db, 'users', user.uid, 'shoppingList'),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setItems(list)
      }
    )

    const unsubscribeProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setProducts(list)
      }
    )

    return () => {
      unsubscribeItems()
      unsubscribeProducts()
    }
  }, [])

  // 🔥 Calculate total
  const totalPrice = items.reduce((sum, item) => {
    if (!item.price) return sum
    return sum + Number(item.price)
  }, 0)

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

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

    const q = query(
      historyRef,
      orderBy('fileDate', 'desc'),
      limit(2)
    )

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
      fileDate,
      createdAt: serverTimestamp()
    })

    setNewItem('')
    setOpen(false)
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

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.name : productId
  }

  const getProductUnit = (productId) => {
    const product = products.find(p => p.id === productId)
    return product ? product.unit : ''
  }

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
        {navValue === 0 && (
          <Paper sx={{ p: 2, minHeight: '60vh' }}>
            {items.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                Nenhum item na lista
              </Typography>
            ) : (
              <>
                <List>
                  {items.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        backgroundColor: getPriceColor(item.price, item.previousPrice),
                        mb: 1,
                        borderRadius: 1
                      }}
                      secondaryAction={
                        <IconButton onClick={() => removeItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={getProductName(item.productId)}
                        secondary={
                          item.price
                            ? `Preço médio: ${formatCurrency(item.price)}${getProductUnit(item.productId) ? ` (${getProductUnit(item.productId)})` : ''} - ${item.fileDate}`
                            : 'Sem preço disponível'
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: '1px solid #eee',
                    textAlign: 'right'
                  }}
                >
                  <Typography variant="h6">
                    Total estimado: {formatCurrency(totalPrice)}
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        )}

        {navValue === 1 && (
          <Paper sx={{ p: 3, minHeight: '60vh' }}>
            <Typography variant="h6" mb={2}>
              Configurações
            </Typography>

            <Typography variant="subtitle1">Alterar Senha</Typography>
            <TextField
              label="Nova Senha"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            {passwordMessage && <Alert severity="success">{passwordMessage}</Alert>}

            <Button variant="contained" fullWidth onClick={handleChangePassword} sx={{ mb: 2 }}>
              Alterar Senha
            </Button>

            <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
              Sair
            </Button>

            {isAdmin && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 4 }}>
                  Upload Planilha de Preços
                </Typography>
                <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
                  Selecionar Arquivo CSV/XLSX
                  <input
                    type="file"
                    hidden
                    accept=".csv,.xlsx"
                    onChange={handlePriceUpload}
                  />
                </Button>
              </>
            )}
          </Paper>
        )}
      </Container>

      {navValue === 0 && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{ position: 'fixed', bottom: 70, right: 20 }}
        >
          <AddIcon />
        </Fab>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" mb={2}>
            Adicionar Item
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Produto</InputLabel>
            <Select
              value={newItem}
              label="Produto"
              onChange={(e) => setNewItem(e.target.value)}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={addItem}
            disabled={!newItem}
          >
            Adicionar
          </Button>
        </Box>
      </Modal>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Lista" icon={<ListIcon />} />
          <BottomNavigationAction label="Configurações" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default MainScreen