// Third-party
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined'


function ForgotPasswordForm({
  email,
  sent,
  loading,
  error,
  onEmailChange,
  onSubmit,
}) {
  if (sent) {
    return (
      <Box sx={{ mt: 2.5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            mx: 'auto',
            mb: 2,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            bgcolor: 'success.light',
            color: 'success.dark'
          }}
        >
          <MarkEmailReadOutlinedIcon fontSize="large" />
        </Box>

        <Typography color="text.secondary">
          Se existir uma conta para <b>{email.trim()}</b>, você vai
          receber um link para redefinir a senha. Confira também a
          caixa de spam.
        </Typography>
      </Box>
    )
  }

  return (
    <Stack
      component="form"
      onSubmit={onSubmit}
      spacing={2}
      sx={{ mt: 3 }}
    >
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        slotProps={{ htmlInput: { inputMode: 'email' } }}
        required
        fullWidth
      />

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Enviar link'
        )}
      </Button>
    </Stack>
  )
}

export default ForgotPasswordForm
