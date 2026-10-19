// React
import { useEffect, useState } from 'react'

// Third-party
import {
  Box,
  IconButton,
  Slide,
  Typography
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'

// Utils
import {
  isInStandaloneMode,
  isIOS,
  isSafari
} from '../../utils/deviceUtils'


const DISMISSED_KEY = 'iosInstallDismissed'

const wasDismissed = () => {
  try {
    return !!localStorage.getItem(DISMISSED_KEY)
  } catch {
    return false
  }
}


export default function IOSInstallBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (
      !isIOS() ||
      !isSafari() ||
      isInStandaloneMode() ||
      wasDismissed()
    ) {
      return
    }

    // Let the user see the app before asking.
    const timer = setTimeout(() => {
      setVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true')
    } catch {
      // Ignore; the banner just shows again next visit.
    }

    setVisible(false)
  }

  return (
    <Slide direction="up" in={visible} mountOnEnter unmountOnExit>
      <Box
        role="dialog"
        aria-label="Instalar o Xepa"
        sx={{
          position: 'fixed',
          left: 12,
          right: 12,
          bottom: 'calc(76px + env(safe-area-inset-bottom))',
          maxWidth: 480,
          mx: 'auto',
          p: 2,
          pr: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: '20px',
          bgcolor: 'text.primary',
          color: '#FFFFFF',
          boxShadow: '0 16px 40px rgba(22, 22, 26, 0.32)',
          zIndex: theme => theme.zIndex.snackbar + 1
        }}
      >
        <Box
          component="img"
          src="/apple-touch-icon.png"
          alt=""
          sx={{
            width: 44,
            height: 44,
            borderRadius: '10px',
            flexShrink: 0
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2">
            Instale o Xepa no seu iPhone
          </Typography>

          <Typography
            variant="caption"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
              opacity: 0.8
            }}
          >
            Toque em
            <IosShareIcon sx={{ fontSize: 16 }} />
            e depois em “Adicionar à Tela de Início”
          </Typography>
        </Box>

        <IconButton
          onClick={dismiss}
          aria-label="Fechar"
          sx={{ color: 'inherit', opacity: 0.7 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Slide>
  )
}
