import { Paper, Typography, TextField, Alert, Button } from '@mui/material'

function SettingsPanel({ newPassword, setNewPassword, passwordError, passwordMessage, handleChangePassword, handleLogout, isAdmin, handlePriceUpload }) {
  return (
    <Paper sx={{ p: 3, minHeight: '60vh' }}>
      <Typography variant="h6" mb={2}>Configurações</Typography>

      <Typography variant="subtitle1">Alterar Senha</Typography>

      <TextField label="Nova Senha" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} />

      {passwordError && <Alert severity="error">{passwordError}</Alert>}
      {passwordMessage && <Alert severity="success">{passwordMessage}</Alert>}

      <Button variant="contained" fullWidth onClick={handleChangePassword} sx={{ mb: 2 }}>Alterar Senha</Button>
      <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>Sair</Button>

      {isAdmin && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4 }}>Upload Planilha de Preços</Typography>
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Selecionar Arquivo CSV/XLSX
            <input type="file" hidden accept=".csv,.xlsx" onChange={handlePriceUpload} />
          </Button>
        </>
      )}
    </Paper>
  )
}

export default SettingsPanel