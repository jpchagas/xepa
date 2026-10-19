// Third-party
import {
  Alert,
  Button,
  Snackbar
} from '@mui/material'


// `alert` comes from useAlert(). Sits above the bottom navigation
// and the add button.
function AppSnackbar({ alert, onClose }) {
  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return

    onClose()
  }

  return (
    <Snackbar
      key={alert.id}
      open={alert.open}
      autoHideDuration={alert.action ? 5000 : 3500}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      sx={{
        bottom: {
          xs: 'calc(148px + env(safe-area-inset-bottom))',
          sm: 'calc(148px + env(safe-area-inset-bottom))'
        }
      }}
    >
      <Alert
        severity={alert.severity}
        variant="filled"
        onClose={alert.action ? undefined : handleClose}
        action={
          alert.action && (
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                alert.action.onClick()
                onClose()
              }}
              sx={{ fontWeight: 800 }}
            >
              {alert.action.label}
            </Button>
          )
        }
        sx={{
          width: '100%',
          fontWeight: 600,
          boxShadow: '0 12px 32px rgba(22, 22, 26, 0.24)',
          ...(alert.severity === 'info' && {
            bgcolor: 'text.primary'
          })
        }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  )
}

export default AppSnackbar
