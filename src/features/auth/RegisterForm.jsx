// Third-party
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material'

// Components
import PasswordField from '../../components/inputs/PasswordField'

// Utils
import { MIN_PASSWORD_LENGTH } from '../../utils/authErrors'


function RegisterForm({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) {
  return (
    <Stack
      component="form"
      onSubmit={onSubmit}
      spacing={2}
      sx={{ mt: 3 }}
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        slotProps={{ htmlInput: { inputMode: 'email' } }}
        fullWidth
        required
      />

      <PasswordField
        label="Senha"
        autoComplete="new-password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        helperText={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
        slotProps={{ htmlInput: { minLength: MIN_PASSWORD_LENGTH } }}
        fullWidth
        required
      />

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Criar conta'
        )}
      </Button>
    </Stack>
  )
}

export default RegisterForm
