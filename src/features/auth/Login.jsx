// React
import { useEffect, useState } from 'react'

// Routing
import { useNavigate } from 'react-router-dom'

// Third-party
import {
  Fade,
} from '@mui/material'

import AuthLayout from './AuthLayout'

// Hooks
import useLogin from '../../hooks/useLogin'

// Components
import LoginForm from './LoginForm'

function Login() {
  const [visible, setVisible] = useState(false)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

return (
  <AuthLayout>
    <Fade in={visible} timeout={600}>
      <div
        style={{
          transform: visible
            ? 'translateY(0)'
            : 'translateY(20px)',
          transition: 'transform 600ms ease',
        }}
      >
        <LoginForm
          email={email}
          password={password}
          error={error}
          loading={loading}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={login}
          onRegister={() => navigate('/register')}
          onForgotPassword={() => navigate('/forgot-password')}
        />
      </div>
    </Fade>
  </AuthLayout>
)
}

export default Login