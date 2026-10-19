// Third-party
import { Button } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

// Routing
import { useNavigate } from 'react-router-dom'

// Components
import AuthLayout from './AuthLayout'
import ForgotPasswordForm from './ForgotPasswordForm'

// Hooks
import useForgotPassword from '../../hooks/useForgotPassword'


function ForgotPassword() {
  const navigate = useNavigate()

  const {
    email,
    sent,
    loading,
    error,
    setEmail,
    resetPassword,
  } = useForgotPassword()

  return (
    <AuthLayout
      title={sent ? 'Verifique seu email' : 'Recuperar senha'}
      subtitle={
        sent
          ? undefined
          : 'Informe seu email e enviaremos um link para criar uma nova senha.'
      }
      footer={
        <Button
          variant="text"
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: '14px !important' }} />}
          onClick={() => navigate('/login')}
          sx={{ fontWeight: 700 }}
        >
          Voltar para o login
        </Button>
      }
    >
      <ForgotPasswordForm
        email={email}
        sent={sent}
        loading={loading}
        error={error}
        onEmailChange={setEmail}
        onSubmit={resetPassword}
      />
    </AuthLayout>
  )
}

export default ForgotPassword
