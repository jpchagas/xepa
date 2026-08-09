import {
  Alert,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import AuthCard from './AuthCard'

function ForgotPasswordForm({
  email,
  message,
  error,
  onEmailChange,
  onSubmit,
}) {
  return (
<AuthCard>
  <Typography
    variant="h6"
    mb={2}
    textAlign="center"
    sx={{
      fontWeight: 700,
    }}
  >
    Recuperar Senha
  </Typography>

  <form
    onSubmit={onSubmit}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
  >
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {message && (
          <Alert severity="success">
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
        >
          Enviar Email
        </Button>
  </form>
</AuthCard>
  )
}

export default ForgotPasswordForm