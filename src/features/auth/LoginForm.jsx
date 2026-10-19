// Third-party
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material'

// Components
import PasswordField from '../../components/inputs/PasswordField'


function LoginForm({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
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

      <Box>
        <PasswordField
          label="Senha"
          autoComplete="current-password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          fullWidth
          required
        />

        <Box sx={{ textAlign: 'right', mt: 0.5 }}>
          <Button
            variant="text"
            size="small"
            onClick={onForgotPassword}
            sx={{ color: 'text.secondary', fontWeight: 600 }}
          >
            Esqueci minha senha
          </Button>
        </Box>
      </Box>

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
          'Entrar'
        )}
      </Button>
    </Stack>
  )
}

export default LoginForm
