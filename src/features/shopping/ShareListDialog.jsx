import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'


function ShareListDialog({
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
        Compartilhar Lista
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Email do usuário"
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
          Compartilhar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareListDialog