

import AuthCard from './AuthCard'

function RegisterForm({
  email,
  password,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onLogin,
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
    Criar Conta
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
          fullWidth
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />

        <TextField
          label="Senha"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />

        {error && <Alert severity="error">{error}</Alert>}

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? <CircularProgress size={24} color="inherit" />
            : 'Registrar'}
        </Button>

        <Button
          variant="text"
          onClick={onLogin}
        >
          Já tenho conta
        </Button>
  </form>
</AuthCard>
  )
}

export default RegisterForm