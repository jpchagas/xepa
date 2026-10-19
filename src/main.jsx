// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Third-party
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'

// App
import App from './App'
import theme from './theme'

// Styles
import './styles/index.css'

const root = createRoot(document.getElementById('root'))

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)