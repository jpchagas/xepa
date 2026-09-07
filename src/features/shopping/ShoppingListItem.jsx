import {
  useEffect,
  useState
} from 'react'

// Third-party

import {
  Box,
  Button,
  Collapse,
  IconButton,
  ListItem,
  ListItemText,
  MenuItem,
  TextField
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'

// Hooks

import useShoppingItemPrice from '../../hooks/useShoppingItemPrice'


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
  const [open, setOpen] =
    useState(false)

  const [price, setPrice] =
    useState('')

  const [unit, setUnit] =
    useState('')

  const [initialized, setInitialized] =
    useState(false)

  const [localAmount, setLocalAmount] =
    useState('')


  // Get the product unit before using it
  // in useShoppingItemPrice.

  const unitValue =
    getProductUnit(
      item.productId
    )


  const {
    savePrice
  } = useShoppingItemPrice(
    listId,
    item,
    unitValue
  )


  const effectivePrice =
    getEffectivePrice(
      item.productId,
      item.price
    )

  const amount =
    item.amount ?? 1

  const itemTotal =
    effectivePrice * amount

  const hasPrice =
    !!item.price


  useEffect(() => {
    setLocalAmount(
      item.amount ?? ''
    )
  }, [item.amount])


  // Auto-open editor for custom items

  useEffect(() => {
    if (!initialized) {
      if (
        !item.price ||
        !unitValue
      ) {
        setOpen(true)
      }

      setInitialized(true)
    }
  }, [
    item.price,
    unitValue,
    initialized
  ])


  const handleSave = async () => {
    await savePrice(
      price,
      unit
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
          backgroundColor:
            getPriceColor(
              item.price,
              item.previousPrice
            ),
          mb: 1,
          borderRadius: 1,
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}
        secondaryAction={
          <IconButton
            onClick={() =>
              removeItem(item.id)
            }
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <Box
          display="flex"
          alignItems="center"
          width="100%"
        >
          <TextField
            type="number"
            size="small"
            label="Qtd"
            value={localAmount}
            sx={{
              width: 90,
              mr: 2
            }}
            inputProps={{
              step: 0.1,
              min: 0,
              inputMode: 'decimal'
            }}
            onChange={event => {
              const value =
                event.target.value

              // Allow empty state

              if (value === '') {
                setLocalAmount('')
                return
              }

              setLocalAmount(value)
            }}
            onBlur={() => {
              if (
                localAmount === ''
              ) {
                return
              }

              updateAmount(
                item.id,
                Number(localAmount)
              )
            }}
          />


          <ListItemText
            primary={
              getProductName(
                item.productId
              )
            }
            secondary={
              hasPrice
                ? `Preço médio: ${formatCurrency(
                    effectivePrice
                  )} (${getDisplayUnit(
                    item.productId
                  )}) • Total: ${formatCurrency(
                    itemTotal
                  )}`
                : 'Sem preço disponível'
            }
          />
        </Box>


        {!hasPrice && (
          <Button
            size="small"
            onClick={() =>
              setOpen(!open)
            }
          >
            Adicionar preço
          </Button>
        )}


        <Collapse
          in={open}
          style={{
            width: '100%'
          }}
        >
          <Box
            display="flex"
            gap={1}
            mt={2}
          >
            <TextField
              label="Preço"
              type="number"
              size="small"
              value={price}
              onChange={event =>
                setPrice(
                  event.target.value
                )
              }
              fullWidth
            />


            <TextField
              select
              label="Unidade"
              size="small"
              value={unit}
              onChange={event =>
                setUnit(
                  event.target.value
                )
              }
              sx={{
                width: 100
              }}
            >
              <MenuItem value="kg">
                kg
              </MenuItem>

              <MenuItem value="un">
                un
              </MenuItem>

              <MenuItem value="L">
                L
              </MenuItem>
            </TextField>


            <Button
              onClick={handleSave}
            >
              Salvar
            </Button>
          </Box>
        </Collapse>
      </ListItem>
    </>
  )
}


export default ShoppingListItem