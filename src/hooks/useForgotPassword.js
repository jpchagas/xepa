// React
import { useState } from 'react'

// Firebase
import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from '../services/firebase'

export default function useForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const resetPassword = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    try {
      await sendPasswordResetEmail(auth, email)

      setMessage('Email de redefinição enviado!')
    } catch {
      setError('Erro ao enviar email.')
    }
  }

  return {
    email,
    message,
    error,

    setEmail,

    resetPassword,
  }
}