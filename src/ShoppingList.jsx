import { Paper, Typography, List, Box } from '@mui/material'
import ShoppingListItem from './ShoppingListItem'

function ShoppingList({ items, getProductName, getProductUnit, getDisplayUnit, getEffectivePrice, updateAmount, removeItem, getPriceColor, formatCurrency, totalPrice }) {
  return (
    <Paper sx={{ p: 2, minHeight: '60vh' }}>
      {items.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
          Nenhum item na lista
        </Typography>
      ) : (
        <>
          <List>
            {items.map(item => (
              <ShoppingListItem
                key={item.id}
                item={item}
                getProductName={getProductName}
                getProductUnit={getProductUnit}
                getDisplayUnit={getDisplayUnit}
                getEffectivePrice={getEffectivePrice}
                updateAmount={updateAmount}
                removeItem={removeItem}
                getPriceColor={getPriceColor}
                formatCurrency={formatCurrency}
              />
            ))}
          </List>

          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', textAlign: 'right' }}>
            <Typography variant="h6">Total estimado: {formatCurrency(totalPrice)}</Typography>
          </Box>
        </>
      )}
    </Paper>
  )
}

export default ShoppingList