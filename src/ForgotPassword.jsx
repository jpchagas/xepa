import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from './firebase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Email de redefinição enviado!')
    } catch (err) {
      setError('Erro ao enviar email.')
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 360 }}>
        <Typography variant="h6" mb={2}>
          Recuperar Senha
        </Typography>

        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}
          {message && <Alert severity="success">{message}</Alert>}

          <Button type="submit" variant="contained">
            Enviar Email
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default ForgotPassword