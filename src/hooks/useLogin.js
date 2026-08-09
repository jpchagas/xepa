// React
import { useState } from 'react'

// Firebase
import { signInWithEmailAndPassword } from 'firebase/auth'

import { auth } from '../services/firebase'

export default function useLogin(onSuccess) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)

      onSuccess()
    } catch {
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    password,
    loading,
    error,

    setEmail,
    setPassword,

    login,
  }
}