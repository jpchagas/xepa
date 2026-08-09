// Third-party
import { Box } from '@mui/material'

const containerStyles = {
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #FFD400, #FF6F00)',
}

const logoStyles = {
  width: 220,
  maxWidth: '70vw',
  filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.2))',
  animation: 'pulse 1.8s ease-in-out infinite',

  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
}

function SplashScreen() {
  return (
    <Box sx={containerStyles}>
      <Box
        component="img"
        src="/xepa_logo.png"
        alt="Xepa Logo"
        sx={logoStyles}
      />
    </Box>
  )
}

export default SplashScreen