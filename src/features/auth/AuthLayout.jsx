// Material UI
import { Box } from '@mui/material'

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        backgroundColor: 'var(--bg-main)',
      }}
    >
      {children}
    </Box>
  )
}

export default AuthLayout