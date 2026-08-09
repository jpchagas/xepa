// Routing
import { useNavigate } from 'react-router-dom'

// Third-party
import AuthLayout from './AuthLayout'

// Hooks
import useRegister from '../../hooks/useRegister'

// Components
import RegisterForm from './RegisterForm'

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
  <AuthLayout>
    <RegisterForm
      email={email}
      password={password}
      loading={loading}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={register}
      onLogin={() => navigate('/login')}
    />
  </AuthLayout>
)
}

export default Register