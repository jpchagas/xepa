// React
import { useState } from 'react'

// Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

import { auth, db } from '../services/firebase'

// Utils
import { getAuthErrorMessage } from '../utils/authErrors'

export default function useRegister(onSuccess) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const register = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      )

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      })

      await user.reload()

      onSuccess()
    } catch (err) {
      setError(getAuthErrorMessage(err))
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

    register,
  }
}
