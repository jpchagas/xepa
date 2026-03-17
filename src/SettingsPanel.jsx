import { Paper, Typography, TextField, Alert, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function SettingsPanel({
  newPassword,
  setNewPassword,
  passwordError,
  passwordMessage,
  handleChangePassword,
  handleLogout,
  isAdmin,
  selectedList,
  products,
  addItem,
  handlePriceUpload
}) {

  const navigate = useNavigate()

  return (
    <Paper sx={{ p: 3, minHeight: '60vh' }}>
      <Typography variant="h6" mb={2}>Configurações</Typography>

      <Typography variant="subtitle1">Alterar Senha</Typography>

      <TextField
        label="Nova Senha"
        type="password"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
      />

      {passwordError && <Alert severity="error">{passwordError}</Alert>}
      {passwordMessage && <Alert severity="success">{passwordMessage}</Alert>}

      <Button
        variant="contained"
        fullWidth
        onClick={handleChangePassword}
        sx={{ mb: 2 }}
      >
        Alterar Senha
      </Button>

      <Button
        variant="outlined"
        color="error"
        fullWidth
        onClick={handleLogout}
      >
        Sair
      </Button>

      {isAdmin && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4 }}>
            Upload Planilha de Preços
          </Typography>

          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Selecionar Arquivo CSV/XLSX
            <input
              type="file"
              hidden
              accept=".csv,.xlsx"
              onChange={handlePriceUpload}
            />
          </Button>
        </>
      )}

      {/* Privacy & Contact Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="subtitle1">
          Privacidade e Contato
        </Typography>

        <Button
          variant="text"
          fullWidth
          onClick={() => navigate('/privacy')}
        >
          Política de Privacidade
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={() => navigate('/contact')}
        >
          Contato
        </Button>
      </Box>

    </Paper>
  )
}

export default SettingsPanel