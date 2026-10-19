// React
import { useState } from 'react'

// Third-party
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'


// `confirm` is { title, message, confirmLabel, destructive, onConfirm }
// or null when closed.
function ConfirmDialog({ confirm, onClose }) {
  const [running, setRunning] = useState(false)

  // Keep the last content while the dialog fades out.
  const [current, setCurrent] = useState(confirm)

  if (confirm && confirm !== current) {
    setCurrent(confirm)
  }

  const handleConfirm = async () => {
    setRunning(true)

    try {
      await current.onConfirm()
    } finally {
      setRunning(false)
      onClose()
    }
  }

  return (
    <Dialog
      open={!!confirm}
      onClose={running ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      {current && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            {current.title}
          </DialogTitle>

          {current.message && (
            <DialogContent>
              <DialogContentText>
                {current.message}
              </DialogContentText>
            </DialogContent>
          )}

          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button
              onClick={onClose}
              disabled={running}
              color="inherit"
            >
              Cancelar
            </Button>

            <Button
              variant="contained"
              color={current.destructive ? 'error' : 'primary'}
              onClick={handleConfirm}
              disabled={running}
              sx={{ minWidth: 112 }}
            >
              {running ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                current.confirmLabel ?? 'Confirmar'
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default ConfirmDialog
