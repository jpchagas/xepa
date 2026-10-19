// Third-party
import { alpha, createTheme } from '@mui/material/styles'

export const brand = {
  yellow: '#FFD400',
  yellowDark: '#F2C200',
  orange: '#FF8A00',
  red: '#E3141B',
  ink: '#16161A',
  muted: '#6E6E76',
  canvas: '#F5F4F0',
  surface: '#FFFFFF',
}

export const brandGradient =
  `linear-gradient(135deg, ${brand.yellow} 0%, #FFB800 55%, ${brand.orange} 100%)`

export const softShadow =
  '0 1px 2px rgba(22, 22, 26, 0.04), 0 8px 24px rgba(22, 22, 26, 0.06)'

const theme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: brand.yellow,
      dark: brand.yellowDark,
      contrastText: brand.ink,
    },
    secondary: {
      main: brand.red,
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#16A34A',
      light: '#DCFCE7',
      dark: '#15803D',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      light: '#FEE2E2',
      dark: '#B91C1C',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706',
      light: '#FEF3C7',
      dark: '#B45309',
      contrastText: '#FFFFFF',
    },

    background: {
      default: brand.canvas,
      paper: brand.surface,
    },
    text: {
      primary: brand.ink,
      secondary: brand.muted,
    },
    divider: alpha(brand.ink, 0.08),
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.03em' },
    h5: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600, lineHeight: 1.35 },
    subtitle2: { fontWeight: 600 },
    overline: { fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1.6 },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 12,

          // Yellow text is unreadable on white, so non-filled
          // primary buttons use ink instead.
          ...(ownerState.color === 'primary' &&
            ownerState.variant !== 'contained' && {
              color: brand.ink,
            }),

          ...(ownerState.color === 'primary' &&
            ownerState.variant === 'outlined' && {
              borderColor: alpha(brand.ink, 0.16),
              '&:hover': {
                borderColor: alpha(brand.ink, 0.32),
                backgroundColor: alpha(brand.ink, 0.04),
              },
            }),

          ...(ownerState.color === 'primary' &&
            ownerState.variant === 'contained' && {
              '&:hover': {
                backgroundColor: brand.yellowDark,
              },
            }),
        }),
        sizeLarge: {
          padding: '13px 22px',
          fontSize: '1rem',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          '&:active': {
            transform: 'scale(0.94)',
          },
          transition: 'transform 120ms ease, background-color 150ms ease',
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: brand.yellow,
          color: brand.ink,
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: `0 10px 28px ${alpha(brand.orange, 0.38)}`,
          '&:hover': {
            backgroundColor: brand.yellowDark,
          },
          '&:active': {
            boxShadow: `0 6px 16px ${alpha(brand.orange, 0.32)}`,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: brand.surface,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(brand.ink, 0.14),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha(brand.ink, 0.32),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brand.ink,
            borderWidth: 1.5,
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: brand.ink,
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ ownerState }) => ({
          ...(!ownerState.fullScreen && {
            borderRadius: 24,
          }),
        }),
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          letterSpacing: '-0.01em',
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          minWidth: 220,
          boxShadow:
            '0 4px 12px rgba(22, 22, 26, 0.08), 0 16px 40px rgba(22, 22, 26, 0.12)',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 44,
          fontWeight: 500,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          alignItems: 'center',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 99,
        },
        bar: {
          borderRadius: 99,
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(brand.canvas, 0.88),
          backdropFilter: 'saturate(180%) blur(16px)',
          color: brand.ink,
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha(brand.ink, 0.06)}`,
        },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          height: 64,
          backgroundColor: 'transparent',
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: brand.muted,
          gap: 4,
          '&.Mui-selected': {
            color: brand.ink,
          },
        },
        label: {
          fontWeight: 600,
          fontSize: '0.75rem',
          '&.Mui-selected': {
            fontSize: '0.75rem',
          },
        },
      },
    },
  },
})

export default theme
