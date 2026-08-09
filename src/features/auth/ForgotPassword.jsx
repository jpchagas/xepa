// Third-party
import AuthLayout from './AuthLayout'

// Hooks
import useForgotPassword from '../../hooks/useForgotPassword'

// Components
import ForgotPasswordForm from './ForgotPasswordForm'

function ForgotPassword() {
  const {
    email,
    message,
    error,
    setEmail,
    resetPassword,
  } = useForgotPassword()

return (
  <AuthLayout>
    <ForgotPasswordForm
      email={email}
      message={message}
      error={error}
      onEmailChange={setEmail}
      onSubmit={resetPassword}
    />
  </AuthLayout>
)
}

export default ForgotPassword