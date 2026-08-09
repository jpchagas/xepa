// Material UI
import {
  Box,
  Paper,
} from '@mui/material'

function AuthCard({ children }) {
  return (
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
      <Box
        component="img"
        src="/xepa_logo.png"
        alt="Xepa Logo"
        sx={{
          width: 80,
          display: 'block',
          mx: 'auto',
          mb: 2,
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))',
        }}
      />

      {children}
    </Paper>
  )
}

export default AuthCard