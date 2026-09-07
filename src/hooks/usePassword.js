import { useState } from 'react'

// Firebase

import {
  signOut,
  updatePassword
} from 'firebase/auth'

// Services

import { auth } from '../services/firebase'


function usePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const changePassword = async () => {
    setPasswordError('')
    setPasswordMessage('')

    try {
      await updatePassword(
        auth.currentUser,
        newPassword
      )

      setPasswordMessage(
        'Senha alterada com sucesso!'
      )

      setNewPassword('')
    } catch {
      setPasswordError(
        'Faça login novamente para alterar a senha.'
      )
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return {
    newPassword,
    setNewPassword,
    passwordMessage,
    passwordError,
    changePassword,
    logout
  }
}

export default usePassword