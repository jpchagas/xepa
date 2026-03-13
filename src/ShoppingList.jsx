import { Paper, List, ListItem, ListItemText, TextField, IconButton, Box, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

function ShoppingList({ items, getProductName, getDisplayUnit, getEffectivePrice, updateAmount, removeItem, getPriceColor, formatCurrency, totalPrice }) {
  return (
    <Paper sx={{ p: 2, minHeight: '60vh' }}>
      {items.length === 0 ? <Typography textAlign="center" color="text.secondary" sx={{ mt: 2 }}>Nenhum item na lista</Typography> :
      <>
        <List>
          {items.map(item => {
            const effectivePrice = getEffectivePrice(item.productId, item.price)
            const amount = item.amount || 1
            const itemTotal = effectivePrice * amount
            return (
              <ListItem key={item.id} sx={{ backgroundColor: getPriceColor(item.price, item.previousPrice), mb: 1, borderRadius: 1 }} secondaryAction={<IconButton onClick={()=>removeItem(item.id)}><DeleteIcon /></IconButton>}>
                <TextField type="number" size="small" label="Qtd" value={amount} sx={{ width: 90, mr: 2 }} inputProps={{ step: 0.1, min:0 }} onChange={(e)=>updateAmount(item.id, e.target.value)} />
                <ListItemText primary={getProductName(item.productId)} secondary={item.price?`Preço médio: ${formatCurrency(effectivePrice)} (${getDisplayUnit(item.productId)}) • Total: ${formatCurrency(itemTotal)}`:'Sem preço disponível'} />
              </ListItem>
            )
          })}
        </List>
        <Box sx={{ mt:2, pt:2, borderTop:'1px solid #eee', textAlign:'right' }}>
          <Typography variant="h6">Total estimado: {formatCurrency(totalPrice)}</Typography>
        </Box>
      </>}
    </Paper>
  )
}

export default ShoppingList