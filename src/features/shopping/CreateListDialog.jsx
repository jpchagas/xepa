// React
import { useState } from 'react'

// Third-party
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material'


function CreateListDialog({
  open,
  onClose,
  onSubmit
}) {
  const [name, setName] = useState('')

  const handleSubmit = event => {
    event.preventDefault()

    if (!name.trim()) return

    onSubmit(name.trim())
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: { onExited: () => setName('') }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Nova lista
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Separe a feira, o mercado do mês ou as compras da casa.
          </DialogContentText>

          <TextField
            autoFocus
            label="Nome da lista"
            placeholder="Ex.: Feira de sábado"
            value={name}
            onChange={event => setName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 40 } }}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={!name.trim()}
          >
            Criar lista
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateListDialog
