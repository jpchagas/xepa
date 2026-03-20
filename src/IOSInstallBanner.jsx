import { useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { isIOS, isSafari, isInStandaloneMode } from './iosUtils'

export default function IOSInstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('iosInstallDismissed')

    if (isIOS() && isSafari() && !isInStandaloneMode() && !dismissed) {
      setTimeout(() => {
        setVisible(true)
      }, 3000) // delay = better UX
    }
  }, [])

  if (!visible) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        p: 2,
        borderRadius: 2,
        backgroundColor: '#111',
        color: '#fff',
        zIndex: 9999
      }}
    >
      <Typography variant="body2" mb={1}>
        📲 Install Xepa on your iPhone
      </Typography>

      <Typography variant="caption">
        Tap <b>Share</b> → “Add to Home Screen”
      </Typography>

      <Box mt={1} display="flex" justifyContent="flex-end">
        <Button
          size="small"
          onClick={() => {
            localStorage.setItem('iosInstallDismissed', 'true')
            setVisible(false)
          }}
        >
          Entendi
        </Button>
      </Box>
    </Box>
  )
}