import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Fade,
} from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './firebase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // sync with splash exit
    const timer = setTimeout(() => {
      setVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

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
    <Fade in={visible} timeout={600}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          px: 2,

          /* 🎯 MUST match app background */
          backgroundColor: 'var(--bg-main)',

          /* 🔥 subtle upward motion */
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'transform 600ms ease',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 360,
            borderRadius: 3,
            background: 'var(--color-white)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* 🔥 Logo */}
          <Box
            component="img"
            src="/xepa_logo.png"
            alt="Xepa Logo"
            sx={{
              width: 80,
              display: 'block',
              mx: 'auto',
              mb: 2,

              /* subtle continuity with splash */
              filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
            }}
          />

          <Typography
            variant="h5"
            mb={3}
            textAlign="center"
            sx={{ fontWeight: 700 }}
          >
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
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/register')}
              sx={{ color: 'var(--text-secondary)' }}
            >
              Criar conta
            </Button>

            <Button
              variant="text"
              onClick={() => navigate('/forgot-password')}
              sx={{ color: 'var(--text-secondary)' }}
            >
              Esqueci minha senha
            </Button>
          </form>
        </Paper>
      </Box>
    </Fade>
  )
}

export default Login