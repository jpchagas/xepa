import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',

    /* 🔥 Core Brand */
    primary: {
      main: '#FFD400', // yellow
      contrastText: '#121212',
    },
    secondary: {
      main: '#E53935', // red (deals / urgency)
      contrastText: '#FFFFFF',
    },

    /* 🎯 Semantic */
    success: {
      main: '#4CAF50',
      contrastText: '#FFFFFF',
    },

    /* ⚫ Neutrals */
    background: {
      default: '#FFFFFF',
      paper: '#F2F2F2',
    },

    text: {
      primary: '#121212',
      secondary: '#2C2C2E',
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    h6: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  components: {
    /* 🔝 AppBar */
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFD400, #FF6F00)',
          color: '#121212',
          boxShadow: 'none',
        },
      },
    },

    /* 🔘 Buttons */
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#FFD400',
          color: '#121212',
          '&:hover': {
            background: 'linear-gradient(135deg, #FFD400, #FF6F00)',
          },
        },
        containedSecondary: {
          backgroundColor: '#E53935',
          '&:hover': {
            background: 'linear-gradient(135deg, #E53935, #FF6F00)',
          },
        },
      },
    },

    /* ➕ FAB */
    MuiFab: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FFD400, #FF6F00)',
          color: '#121212',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E53935, #FF6F00)',
          },
        },
      },
    },

    /* 📱 Bottom Navigation */
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #F2F2F2',
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#2C2C2E',
          '&.Mui-selected': {
            color: '#E53935',
          },
        },
      },
    },

    /* 📦 Paper */
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    /* 🚨 Alerts */
    MuiAlert: {
      styleOverrides: {
        filledSuccess: {
          backgroundColor: '#4CAF50',
        },
        filledError: {
          backgroundColor: '#E53935',
        },
      },
    },
  },
})

export default theme