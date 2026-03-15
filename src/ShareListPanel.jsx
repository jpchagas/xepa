import { Typography, TextField, Alert, Button, Box, Snackbar } from '@mui/material'
import { useState } from 'react'
import { db } from './firebase'
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'

function ShareListPanel({ selectedList }) {
  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: ''
  })

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
      members: arrayUnion(userId)
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

export default ShareListPanel