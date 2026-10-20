// React
import { useState } from 'react'

// Third-party
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  Typography
} from '@mui/material'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

// Utils
import { formatRelativeTime } from '../../utils/timeHelpers'


const TYPE_STYLES = {
  items_added: {
    icon: AddShoppingCartIcon,
    bgcolor: 'primary.main',
    color: 'text.primary'
  },
  price_increase: {
    icon: TrendingUpIcon,
    bgcolor: 'error.light',
    color: 'error.dark'
  }
}


function NotificationRow({ notification, highlight, onClick }) {
  const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.items_added
  const Icon = style.icon

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        alignItems: 'flex-start',
        gap: 1.5,
        py: 1.25,
        bgcolor: highlight ? 'rgba(255, 212, 0, 0.12)' : 'transparent'
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '50%',
          bgcolor: style.bgcolor,
          color: style.color
        }}
      >
        <Icon fontSize="small" />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ lineHeight: 1.35 }}>
          {notification.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          {notification.body}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          {formatRelativeTime(notification.updatedAt?.toDate?.())}
        </Typography>
      </Box>

      {highlight && (
        <Box
          aria-label="Nova"
          sx={{
            width: 8,
            height: 8,
            mt: 0.75,
            flexShrink: 0,
            borderRadius: '50%',
            bgcolor: 'error.main'
          }}
        />
      )}
    </ListItemButton>
  )
}


// Opening the panel marks everything as read, so the notifications
// that were new at that moment are remembered to keep them highlighted.
function NotificationsDialog({ open, onClose, notifications, onOpenNotification }) {
  const [wasOpen, setWasOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(() => new Set())

  if (open !== wasOpen) {
    setWasOpen(open)

    if (open) {
      setHighlighted(
        new Set(
          notifications
            .filter(notification => !notification.read)
            .map(notification => notification.id)
        )
      )
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pb: 1 }}>
        Notificações
      </DialogTitle>

      <DialogContent sx={{ px: 1.5 }}>
        {notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5, px: 2 }}>
            <NotificationsNoneIcon sx={{ fontSize: 44, color: 'text.disabled' }} />

            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Nada por aqui ainda
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Avisamos quando alguém adicionar itens às suas listas
              compartilhadas ou quando um preço da lista subir.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map(notification => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                highlight={highlighted.has(notification.id)}
                onClick={() => onOpenNotification(notification)}
              />
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NotificationsDialog
