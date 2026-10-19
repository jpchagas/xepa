// React
import { useState } from 'react'

// Third-party
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography
} from '@mui/material'

import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined'

// Components
import UserAvatar from '../../components/display/UserAvatar'


const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/


// Invite by email + see/remove who has access.
// `onInvite(email)` resolves to an error message, or null on success.
function MembersDialog({
  open,
  onClose,
  list,
  members,
  currentUserId,
  isOwner,
  onInvite,
  onRemoveMember
}) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    const value = email.trim()

    if (!EMAIL_PATTERN.test(value)) {
      setError('Digite um email válido.')
      return
    }

    setSending(true)
    setError('')

    try {
      const inviteError = await onInvite(value)

      if (inviteError) setError(inviteError)
      else setEmail('')
    } finally {
      setSending(false)
    }
  }

  const handleExited = () => {
    setEmail('')
    setError('')
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: { onExited: handleExited }
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        Compartilhar lista
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Quem tem acesso vê e edita “{list?.name}” em tempo real.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', gap: 1, mt: 2.5, alignItems: 'flex-start' }}
        >
          <TextField
            size="small"
            type="email"
            label="Email"
            placeholder="nome@email.com"
            value={email}
            onChange={event => {
              setEmail(event.target.value)
              setError('')
            }}
            error={!!error}
            helperText={error || undefined}
            slotProps={{
              htmlInput: {
                inputMode: 'email',
                autoCapitalize: 'none',
                autoCorrect: 'off'
              }
            }}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={sending || !email.trim()}
            sx={{ height: 40, flexShrink: 0, minWidth: 96 }}
          >
            {sending ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              'Convidar'
            )}
          </Button>
        </Box>

        {!error && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', mt: 0.75 }}
          >
            A pessoa precisa ter uma conta no Xepa.
          </Typography>
        )}

        <Typography
          variant="overline"
          color="text.secondary"
          component="h3"
          sx={{ display: 'block', mt: 3 }}
        >
          Pessoas com acesso · {members.length}
        </Typography>

        <List disablePadding>
          {members.map(member => {
            const memberIsOwner = member.id === list?.ownerId
            const isYou = member.id === currentUserId

            const description =
              [
                memberIsOwner && 'Dono da lista',
                isYou && 'Você'
              ]
                .filter(Boolean)
                .join(' · ') || 'Pode editar'

            return (
              <ListItem
                key={member.id}
                disableGutters
                secondaryAction={
                  isOwner && !memberIsOwner && (
                    <IconButton
                      edge="end"
                      aria-label={`Remover ${member.email}`}
                      onClick={() => onRemoveMember(member)}
                    >
                      <PersonRemoveOutlinedIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <UserAvatar email={member.email} />
                </ListItemAvatar>

                <ListItemText
                  primary={member.email}
                  secondary={description}
                  slotProps={{
                    primary: { noWrap: true, sx: { fontWeight: 600 } }
                  }}
                />
              </ListItem>
            )
          })}
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MembersDialog
