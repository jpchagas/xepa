import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  AppBar,
  Toolbar,
  Fab,
  Container,
  BottomNavigation,
  BottomNavigationAction,
  Modal,
  Alert,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import SettingsIcon from '@mui/icons-material/Settings'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { auth } from './firebase'
import { updatePassword, signOut } from 'firebase/auth'
import './MainScreen.css'

function MainScreen() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('xepaItems')
    return saved ? JSON.parse(saved) : []
  })

  const [newItem, setNewItem] = useState('')
  const [open, setOpen] = useState(false)
  const [navValue, setNavValue] = useState(0)

  // Change password states
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    localStorage.setItem('xepaItems', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (newItem.trim() === '') return
    setItems([...items, newItem.trim()])
    setNewItem('')
    setOpen(false)
  }

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordMessage('')

    try {
      await updatePassword(auth.currentUser, newPassword)
      setPasswordMessage('Senha alterada com sucesso!')
      setNewPassword('')
    } catch (err) {
      setPasswordError('Faça login novamente para alterar a senha.')
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 7 }}>
      {/* AppBar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Xepa
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 2 }}>
        {/* LISTA TAB */}
        {navValue === 0 && (
          <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 1, minHeight: '60vh' }}>
            {items.length === 0 ? (
              <Typography textAlign="center" color="text.secondary" sx={{ mt: 2 }}>
                Nenhum item na lista
              </Typography>
            ) : (
              <List>
                <TransitionGroup>
                  {items.map((item, index) => (
                    <CSSTransition key={index} timeout={300} classNames="item">
                      <ListItem
                        secondaryAction={
                          <IconButton
                            edge="end"
                            onClick={() => removeItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={item} />
                      </ListItem>
                    </CSSTransition>
                  ))}
                </TransitionGroup>
              </List>
            )}
          </Paper>
        )}

        {/* CONFIGURAÇÕES TAB */}
        {navValue === 1 && (
          <Paper sx={{ p: 3, minHeight: '60vh' }}>
            <Typography variant="h6" mb={2}>
              Configurações
            </Typography>

            <Typography variant="subtitle1" gutterBottom>
              Alterar Senha
            </Typography>

            <TextField
              label="Nova Senha"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
            />

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            {passwordMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordMessage}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleChangePassword}
              sx={{ mb: 3 }}
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
          </Paper>
        )}
      </Container>

      {/* Floating Action Button (only in Lista tab) */}
      {navValue === 0 && (
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 70,
            right: 20,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Modal for Adding Item */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Adicionar Item
          </Typography>
          <TextField
            label="Novo item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            fullWidth
            onClick={addItem}
          >
            Adicionar
          </Button>
        </Box>
      </Modal>

      {/* Bottom Navigation */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={navValue}
          onChange={(event, newValue) => setNavValue(newValue)}
        >
          <BottomNavigationAction label="Lista" icon={<ListIcon />} />
          <BottomNavigationAction label="Configurações" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default MainScreen