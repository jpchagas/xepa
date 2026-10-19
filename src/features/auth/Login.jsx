// Third-party
import { Button, Typography } from '@mui/material'

// Routing
import { useNavigate } from 'react-router-dom'

// Components
import AuthLayout from './AuthLayout'
import LoginForm from './LoginForm'

// Hooks
import useLogin from '../../hooks/useLogin'


function Login() {
  const navigate = useNavigate()

  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    login,
  } = useLogin(() => navigate('/main'))

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para ver suas listas."
      footer={
        <Typography variant="body2" color="text.secondary">
          Ainda não tem conta?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/register')}
            sx={{ fontWeight: 800, verticalAlign: 'baseline' }}
          >
            Criar conta grátis
          </Button>
        </Typography>
      }
    >
      <LoginForm
        email={email}
        password={password}
        error={error}
        loading={loading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={login}
        onForgotPassword={() => navigate('/forgot-password')}
      />
    </AuthLayout>
  )
}

export default Login
