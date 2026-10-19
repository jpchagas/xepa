// Third-party
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

// Routing
import { useNavigate } from 'react-router-dom'


export default function PageAppBar({ title }) {
  const navigate = useNavigate()

  // Opened directly (shared link, refresh): there's no in-app page
  // to go back to, so go home instead of leaving the site.
  const goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <AppBar
      position="sticky"
      sx={{ pt: 'env(safe-area-inset-top)' }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={goBack}
          aria-label="Voltar"
          sx={{ mr: 1 }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" component="h1">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
