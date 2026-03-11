import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Modal } from '@mui/material'

function AddItemModal({ open, onClose, products, newItem, setNewItem, addItem }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', width: '90%', maxWidth: 400,
        bgcolor: 'background.paper', p: 3, borderRadius: 2
      }}>
        <Typography variant="h6" mb={2}>Adicionar Item</Typography>

        <FormControl fullWidth>
          <InputLabel>Produto</InputLabel>
          <Select value={newItem} label="Produto" onChange={(e) => setNewItem(e.target.value)}>
            {products.sort((a, b) => a.name.localeCompare(b.name)).map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={addItem} disabled={!newItem}>
          Adicionar
        </Button>
      </Box>
    </Modal>
  )
}

export default AddItemModal