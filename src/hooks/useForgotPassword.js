// React
import { useState } from 'react'

// Firebase
import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from '../services/firebase'

// Utils
import { getAuthErrorMessage } from '../utils/authErrors'

export default function useForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const resetPassword = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await sendPasswordResetEmail(auth, email.trim())

      setSent(true)
    } catch (err) {
      setError(getAuthErrorMessage(err, 'Não foi possível enviar o email.'))
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    sent,
    loading,
    error,

    setEmail,

    resetPassword,
  }
}
