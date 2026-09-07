import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'


function CreateListDialog({
  open,
  onClose,
  value,
  onChange,
  onSubmit
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        Nova Lista
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Nome da Lista"
          value={value}
          onChange={event =>
            onChange(
              event.target.value
            )
          }
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onSubmit}
        >
          Criar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateListDialog