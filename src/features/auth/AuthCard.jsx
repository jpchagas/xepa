// Third-party
import {
  Paper,
  Typography
} from '@mui/material'


function AuthCard({ title, subtitle, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: '24px',
        boxShadow: '0 24px 60px rgba(22, 22, 26, 0.10)'
      }}
    >
      {title && (
        <Typography
          component="h1"
          variant="h5"
        >
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {subtitle}
        </Typography>
      )}

      {children}
    </Paper>
  )
}

export default AuthCard
