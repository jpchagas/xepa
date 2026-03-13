import { Paper, Typography, TextField, Alert, Button, Box, Snackbar} from '@mui/material'
import { useState } from 'react'
import { db, auth } from './firebase'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'


function ShareListPanel({ selectedList }) {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' })

  const showAlert = (severity, message) => {
    setAlert({
      open: true,
      severity,
      message
    })
  }

  const shareList = async () => {
    if (!email || !selectedList) return

    const userQuery = query(collection(db, 'users'), where('email', '==', email))
    const userSnap = await getDocs(userQuery)

    if (userSnap.empty) {
      showAlert('error', 'Usuário não encontrado')
      return
    }

    const userId = userSnap.docs[0].id

    if (selectedList.members.includes(userId)) {
      showAlert('warning', 'Usuário já tem acesso')
      return
    }

    const listRef = doc(db, 'sharedLists', selectedList.id)

    await updateDoc(listRef, {
      members: [...selectedList.members, userId]
    })

    showAlert('success', 'Lista compartilhada com sucesso!')
    setEmail('')
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1">
        Compartilhar Lista
      </Typography>

      <TextField
        label="Email do usuário"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        sx={{ mb: 1 }}
      />

      <Button
        variant="contained"
        onClick={shareList}
      >
        Compartilhar Lista
      </Button>

      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          onClose={() => setAlert({ ...alert, open: false })}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

function SettingsPanel({ newPassword, setNewPassword, passwordError, passwordMessage, handleChangePassword, handleLogout, isAdmin, selectedList, products, addItem, handlePriceUpload }) {
  return (
    <Paper sx={{ p: 3, minHeight: '60vh' }}>
      <Typography variant="h6" mb={2}>Configurações</Typography>

      <Typography variant="subtitle1">Alterar Senha</Typography>
      <TextField label="Nova Senha" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 2 }} />
      {passwordError && <Alert severity="error">{passwordError}</Alert>}
      {passwordMessage && <Alert severity="success">{passwordMessage}</Alert>}
      <Button variant="contained" fullWidth onClick={handleChangePassword} sx={{ mb: 2 }}>Alterar Senha</Button>
      <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>Sair</Button>

      {selectedList && <ShareListPanel selectedList={selectedList} />}

      {isAdmin && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 4 }}>Upload Planilha de Preços</Typography>
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
    </Paper>
  )
}

export default SettingsPanel