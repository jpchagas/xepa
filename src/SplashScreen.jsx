import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'

function SplashScreen() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    setVisible(true)

    const exitTimer = setTimeout(() => {
      setExit(true) // trigger exit animation
    }, 1500)

    const navTimer = setTimeout(() => {
      navigate('/login')
    }, 2000)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(navTimer)
    }
  }, [navigate])

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        /* 🎨 Background */
        background: 'linear-gradient(135deg, #FFD400, #FF6F00)',

        /* 🔥 Fade out + slight zoom */
        opacity: exit ? 0 : 1,
        transform: exit ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 500ms ease',
      }}
    >
      <Box
        component="img"
        src="/xepa_logo.png"
        alt="Xepa Logo"
        sx={{
          width: 220,
          maxWidth: '70vw',

          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.2))',

          /* Pulse */
          animation: 'pulse 1.8s ease-in-out infinite',

          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      />
    </Box>
  )
}

export default SplashScreen