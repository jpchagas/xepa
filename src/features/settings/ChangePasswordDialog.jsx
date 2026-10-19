// Third-party
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'

// Components
import PasswordField from '../../components/inputs/PasswordField'

// Utils
import { MIN_PASSWORD_LENGTH } from '../../utils/authErrors'


function ChangePasswordDialog({
  open,
  onClose,
  onExited,
  newPassword,
  onPasswordChange,
  error,
  loading,
  onSubmit
}) {
  const handleSubmit = event => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: { onExited }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Alterar senha
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Escolha uma nova senha com pelo menos {MIN_PASSWORD_LENGTH} caracteres.
          </DialogContentText>

          <PasswordField
            autoFocus
            label="Nova senha"
            autoComplete="new-password"
            value={newPassword}
            onChange={event => onPasswordChange(event.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newPassword}
            sx={{ minWidth: 112 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Salvar senha'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChangePasswordDialog
