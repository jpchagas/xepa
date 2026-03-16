import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete
} from '@mui/material'

function AddItemModal({ open, onClose, products, newItem, setNewItem, addItem }) {

  const sortedProducts = [...products].sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  return (
    <Modal open={open} onClose={onClose}>
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

        <Autocomplete
          options={sortedProducts}
          getOptionLabel={(option) => option.name}
          value={sortedProducts.find(p => p.id === newItem) || null}
          onChange={(event, value) => setNewItem(value ? value.id : '')}
          renderInput={(params) => (
            <TextField {...params} label="Produto" />
          )}
        />

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          fullWidth
          onClick={() => addItem(newItem)}
          disabled={!newItem}
        >
          Adicionar
        </Button>
      </Box>
    </Modal>
  )
}

export default AddItemModal