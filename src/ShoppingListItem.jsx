import { ListItem, TextField, ListItemText, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function ShoppingListItem({ item, getProductName, getProductUnit, getDisplayUnit, getEffectivePrice, updateAmount, removeItem, getPriceColor, formatCurrency }) {
  const effectivePrice = getEffectivePrice(item.productId, item.price)
  const amount = item.amount || 1
  const itemTotal = effectivePrice * amount

  return (
    <ListItem
      key={item.id}
      sx={{ backgroundColor: getPriceColor(item.price, item.previousPrice), mb: 1, borderRadius: 1 }}
      secondaryAction={<IconButton onClick={() => removeItem(item.id)}><DeleteIcon /></IconButton>}
    >
      <TextField
        type="number"
        size="small"
        label="Qtd"
        value={amount}
        sx={{ width: 90, mr: 2 }}
        inputProps={{ step: 0.1, min: 0 }}
        onChange={(e) => updateAmount(item.id, e.target.value)}
      />
      <ListItemText
        primary={getProductName(item.productId)}
        secondary={item.price ? `Preço médio: ${formatCurrency(effectivePrice)} (${getDisplayUnit(item.productId)}) • Total: ${formatCurrency(itemTotal)}` : 'Sem preço disponível'}
      />
    </ListItem>
  )
}

export default ShoppingListItem