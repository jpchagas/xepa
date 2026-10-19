// Third-party
import {
  Box,
  Button,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'
import {
  AnimatePresence,
  motion
} from 'framer-motion'

import AddIcon from '@mui/icons-material/Add'
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined'

// Components
import ShoppingListItem from './ShoppingListItem'


function EmptyState({ onAddItem }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, px: 3 }}>
      <Box
        sx={{
          width: 88,
          height: 88,
          mx: 'auto',
          mb: 2.5,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: 'primary.main'
        }}
      >
        <ShoppingBasketOutlinedIcon sx={{ fontSize: 42 }} />
      </Box>

      <Typography variant="h6" component="p">
        Sua lista está vazia
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mt: 0.75, mb: 3, maxWidth: 300, mx: 'auto' }}
      >
        Adicione produtos e veja na hora quanto vai gastar, com
        preços do CEASA.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={onAddItem}
      >
        Adicionar primeiro item
      </Button>
    </Box>
  )
}


function ItemStack({ items, productsById, handlers }) {
  return (
    <Stack spacing={1}>
      <AnimatePresence initial={false}>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout="position"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingListItem
              item={item}
              product={productsById.get(item.productId)}
              {...handlers}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  )
}


function ShoppingList({
  pendingItems,
  checkedItems,
  productsById,
  loading,
  onAddItem,
  onToggle,
  onUpdateAmount,
  onRemove,
  onSavePrice
}) {
  if (loading) {
    return (
      <Stack spacing={1}>
        {[0, 1, 2].map(index => (
          <Skeleton
            key={index}
            variant="rounded"
            height={96}
            sx={{ borderRadius: '18px' }}
          />
        ))}
      </Stack>
    )
  }

  if (pendingItems.length === 0 && checkedItems.length === 0) {
    return <EmptyState onAddItem={onAddItem} />
  }

  const handlers = {
    onToggle,
    onUpdateAmount,
    onRemove,
    onSavePrice
  }

  return (
    <>
      <ItemStack
        items={pendingItems}
        productsById={productsById}
        handlers={handlers}
      />

      {checkedItems.length > 0 && (
        <>
          <Typography
            variant="overline"
            color="text.secondary"
            component="h2"
            sx={{
              display: 'block',
              mt: pendingItems.length ? 3 : 0,
              mb: 1,
              px: 0.5
            }}
          >
            No carrinho · {checkedItems.length}
          </Typography>

          <ItemStack
            items={checkedItems}
            productsById={productsById}
            handlers={handlers}
          />
        </>
      )}

      {pendingItems.length > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', textAlign: 'center', mt: 2 }}
        >
          Arraste um item para a esquerda para remover
        </Typography>
      )}
    </>
  )
}

export default ShoppingList
