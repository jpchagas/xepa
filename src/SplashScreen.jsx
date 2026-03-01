import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Fade } from '@mui/material'

function SplashScreen() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2000) // 2 seconds splash
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <Fade in={visible} timeout={1500}>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
          bgcolor: '#4CAF50',
          color: 'white',
          p: 2,
        }}
      >
        <img src="/xepa_logo.png" alt="Xepa Logo" width={150} />
        <Typography variant="h3" mt={2}>
          Xepa
        </Typography>
        <Typography variant="subtitle1">Sua lista de compras inteligente</Typography>
      </Box>
    </Fade>
  )
}

export default SplashScreen