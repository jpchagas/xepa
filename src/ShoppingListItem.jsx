import { useState, useEffect } from 'react'
import {
  ListItem,
  TextField,
  ListItemText,
  IconButton,
  Button,
  Collapse,
  Box,
  MenuItem
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase' // adjust path if needed

function ShoppingListItem({
  item,
  getProductName,
  getProductUnit,
  getDisplayUnit,
  getEffectivePrice,
  updateAmount,
  removeItem,
  getPriceColor,
  formatCurrency,
  listId
}) {
  const [open, setOpen] = useState(false)
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [localAmount, setLocalAmount] = useState('')

  const effectivePrice = getEffectivePrice(item.productId, item.price)
  const amount = item.amount ?? 1
  const itemTotal = effectivePrice * amount

  const hasPrice = !!item.price

  const unitValue = getProductUnit(item.productId)

  //console.log('ITEM', item)
  useEffect(() => {
    setLocalAmount(item.amount ?? '')
  }, [item.amount])

  // Auto-open editor for custom items
  useEffect(() => {
  if (!initialized) {
    if (!item.price || !unitValue) {
      setOpen(true)
    }
    setInitialized(true)
  }
}, [item.price, unitValue])

  const handleSave = async () => {
    console.log('start handle save')
    const today = new Date().toISOString().split('T')[0]
    console.log('today', today)
    // Update product unit if missing
    if (!getProductUnit(item.productId) && unit) {
      await updateDoc(doc(db, 'products', item.productId), {
        unit
      })
    }

    // Save price history
    await setDoc(
      doc(db, 'prices', item.productId, 'history', today),
      {
        average: Number(price),
        min: Number(price),
        max: Number(price),
        fileDate: today,
        uploadedAt: serverTimestamp()
      }
    )
    await updateDoc(
      doc(db, 'sharedLists', listId, 'items', item.id),
      {
        price: Number(price),
        previousPrice: item.price || null,
        fileDate: today
      }
    )

    setOpen(false)
    setPrice('')
    setUnit('')
  }

  return (
    <>
      <ListItem
        key={item.id}
        sx={{
          backgroundColor: getPriceColor(item.price, item.previousPrice),
          mb: 1,
          borderRadius: 1,
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
        secondaryAction={
          <IconButton onClick={() => removeItem(item.id)}>
            <DeleteIcon />
          </IconButton>
        }
      >
        <Box display="flex" alignItems="center" width="100%">
          <TextField
            type="number"
            size="small"
            label="Qtd"
            value={localAmount}
            sx={{ width: 90, mr: 2 }}
            inputProps={{
              step: 0.1,
              min: 0,
              inputMode: 'decimal'
            }}
            onChange={(e) => {
              const val = e.target.value

              // Allow empty state
              if (val === '') {
                setLocalAmount('')
                return
              }

              setLocalAmount(val)
            }}
            onBlur={() => {
              if (localAmount === '') {
                return // or default later if you want
              }

              updateAmount(item.id, Number(localAmount))
            }}
          />

          <ListItemText
            primary={getProductName(item.productId)}
            secondary={
              hasPrice
                ? `Preço médio: ${formatCurrency(effectivePrice)} (${getDisplayUnit(item.productId)}) • Total: ${formatCurrency(itemTotal)}`
                : 'Sem preço disponível'
            }
          />
        </Box>

        {!hasPrice && (
          <Button size="small" onClick={() => setOpen(!open)}>
            Adicionar preço
          </Button>
        )}

        <Collapse in={open} style={{ width: '100%' }}>
          <Box display="flex" gap={1} mt={2}>
            <TextField
              label="Preço"
              type="number"
              size="small"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Unidade"
              size="small"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ width: 100 }}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="un">un</MenuItem>
              <MenuItem value="L">L</MenuItem>
            </TextField>

            <Button onClick={handleSave}>
              Salvar
            </Button>
          </Box>
        </Collapse>
      </ListItem>
    </>
  )
}

export default ShoppingListItem