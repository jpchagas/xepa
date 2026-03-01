import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/main')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 360 }} elevation={3}>
        <Typography variant="h5" mb={3} textAlign="center">
          Criar Conta
        </Typography>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Senha"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Registrar'}
          </Button>

          <Button variant="text" onClick={() => navigate('/login')}>
            Já tenho conta
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Register