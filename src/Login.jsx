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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/main')
    } catch (err) {
      setError('Email ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, width: '100%', maxWidth: 360 }} elevation={3}>
        <Typography variant="h5" mb={3} textAlign="center">
          Login
        </Typography>

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            autoFocus
          />

          <TextField
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Entrar'
            )}
          </Button>
          <Button variant="text" onClick={() => navigate('/register')}>
            Criar conta
          </Button>

          <Button variant="text" onClick={() => navigate('/forgot-password')}>
            Esqueci minha senha
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Login