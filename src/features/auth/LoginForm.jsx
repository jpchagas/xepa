import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'

import AuthCard from './AuthCard'

function LoginForm({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onRegister,
  onForgotPassword,
}) {
  return (
    <AuthCard>
  <Typography
    variant="h5"
    textAlign="center"
    sx={{
      mb: 3,
      fontWeight: 700,
    }}
  >
    Login
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
      value={email}
      onChange={(e) => onEmailChange(e.target.value)}
      fullWidth
      required
      autoFocus
    />

    <TextField
      label="Senha"
      type="password"
      value={password}
      onChange={(e) => onPasswordChange(e.target.value)}
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
      fullWidth
      disabled={loading}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
        />
      ) : (
        'Entrar'
      )}
    </Button>

    <Button
      variant="text"
      onClick={onRegister}
    >
      Criar conta
    </Button>

    <Button
      variant="text"
      onClick={onForgotPassword}
    >
      Esqueci minha senha
    </Button>
  </form>
</AuthCard>
  )
}

export default LoginForm