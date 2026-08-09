import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Autocomplete
} from '@mui/material'
import { createFilterOptions } from '@mui/material/Autocomplete'

const filter = createFilterOptions()

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
          freeSolo
          options={sortedProducts}
          getOptionLabel={(option) => {
            if (typeof option === 'string') return option
            if (option.isNew) return option.inputValue
            return option.name
          }}
          value={null}
          onChange={(event, value) => {
            if (!value) return

            // Existing product
            if (!value.isNew) {
              setNewItem({
                type: 'existing',
                product: value
              })
              return
            }

            // New product
            setNewItem({
              type: 'new',
              name: value.inputValue
            })
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params)
            const { inputValue } = params

            const isExisting = options.some(
              (option) =>
                option.name.toLowerCase() === inputValue.toLowerCase()
            )

            if (inputValue !== '' && !isExisting) {
              filtered.push({
                inputValue,
                name: `Adicionar "${inputValue}"`,
                isNew: true
              })
            }

            return filtered
          }}
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