// Third-party
import { Button, Typography } from '@mui/material'

// Routing
import { useNavigate } from 'react-router-dom'

// Components
import AuthLayout from './AuthLayout'
import RegisterForm from './RegisterForm'

// Hooks
import useRegister from '../../hooks/useRegister'


function Register() {
  const navigate = useNavigate()

  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    register,
  } = useRegister(() => navigate('/main'))

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Monte listas, compartilhe com a família e acompanhe os preços."
      footer={
        <Typography variant="body2" color="text.secondary">
          Já tem conta?{' '}
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/login')}
            sx={{ fontWeight: 800, verticalAlign: 'baseline' }}
          >
            Entrar
          </Button>
        </Typography>
      }
    >
      <RegisterForm
        email={email}
        password={password}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={register}
      />
    </AuthLayout>
  )
}

export default Register
