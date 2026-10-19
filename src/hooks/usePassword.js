// React
import { useState } from 'react'

// Firebase
import {
  signOut,
  updatePassword
} from 'firebase/auth'

// Services
import { auth } from '../services/firebase'

// Utils
import {
  getAuthErrorMessage,
  MIN_PASSWORD_LENGTH
} from '../utils/authErrors'


function usePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const resetPasswordForm = () => {
    setNewPassword('')
    setPasswordError('')
  }

  // Returns true when the password was changed.
  const changePassword = async () => {
    setPasswordError('')

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(
        `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`
      )
      return false
    }

    setLoading(true)

    try {
      await updatePassword(
        auth.currentUser,
        newPassword
      )

      setNewPassword('')

      return true
    } catch (error) {
      setPasswordError(
        getAuthErrorMessage(
          error,
          'Por segurança, saia e entre novamente para alterar a senha.'
        )
      )

      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return {
    newPassword,
    setNewPassword,
    passwordError,
    loading,
    changePassword,
    resetPasswordForm,
    logout
  }
}

export default usePassword
