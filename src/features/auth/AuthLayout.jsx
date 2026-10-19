// Third-party
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

// Components
import AuthCard from './AuthCard'

// Utils
import { brandGradient } from '../../theme'


function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Box
        sx={{
          background: brandGradient,
          pt: 'calc(40px + env(safe-area-inset-top))',
          pb: 11,
          px: 3,
          textAlign: 'center',
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36
        }}
      >
        <Box
          component="img"
          src="/xepa_mark.png"
          alt="Xepa"
          sx={{
            height: 88,
            display: 'block',
            mx: 'auto',
            filter: 'drop-shadow(0 8px 18px rgba(120, 30, 0, 0.25))'
          }}
        />

        <Typography
          component="p"
          variant="h5"
          sx={{ mt: 1.5 }}
        >
          Xepa
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontWeight: 500,
            color: 'rgba(22, 22, 26, 0.72)'
          }}
        >
          Sua lista de compras com preços do CEASA
        </Typography>
      </Box>

      <Box
        sx={{
          px: 2,
          mt: -8,
          pb: 'calc(24px + env(safe-area-inset-bottom))',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <AuthCard title={title} subtitle={subtitle}>
            {children}
          </AuthCard>

          {footer && (
            <Box sx={{ mt: 2.5, textAlign: 'center' }}>
              {footer}
            </Box>
          )}
        </motion.div>
      </Box>
    </Box>
  )
}

export default AuthLayout
