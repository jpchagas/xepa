// Third-party
import {
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from '@mui/material'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import PrivacyTipOutlinedIcon from '@mui/icons-material/PrivacyTipOutlined'
import SyncIcon from '@mui/icons-material/Sync'

// Routing
import { useNavigate } from 'react-router-dom'

// Components
import UserAvatar from '../../components/display/UserAvatar'

// Utils
import { formatShortDate } from '../../utils/shoppingHelpers'


const formatDateTime = timestamp =>
  timestamp?.toDate
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(timestamp.toDate())
    : ''

// `status` is the meta/ceasa doc written by the import function.
function describeCeasaStatus(status) {
  if (!status) return 'Nenhuma importação automática ainda'

  if (status.lastStatus === 'error') {
    return `Última tentativa falhou em ${formatDateTime(status.lastRunAt)}`
  }

  return [
    status.latestFileDate &&
      `Cotação de ${formatShortDate(status.latestFileDate)}`,
    status.lastRunAt &&
      `verificado em ${formatDateTime(status.lastRunAt)}`
  ]
    .filter(Boolean)
    .join(' · ')
}


function SettingsSection({ title, children }) {
  return (
    <Box component="section" sx={{ mt: 3 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        component="h2"
        sx={{ display: 'block', px: 1, mb: 0.75 }}
      >
        {title}
      </Typography>

      <Paper
        elevation={0}
        sx={{ borderRadius: '18px', border: 1, borderColor: 'divider' }}
      >
        <List disablePadding sx={{ p: 0.75 }}>
          {children}
        </List>
      </Paper>
    </Box>
  )
}


function SettingsRow({
  icon,
  label,
  description,
  onClick,
  danger,
  trailing,
  ...props
}) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{ py: 1.25, color: danger ? 'error.main' : 'inherit' }}
      {...props}
    >
      <ListItemIcon sx={{ minWidth: 44, color: 'inherit' }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={label}
        secondary={description}
        slotProps={{ primary: { sx: { fontWeight: 600 } } }}
      />

      {trailing ?? (
        !danger && <ChevronRightIcon sx={{ color: 'text.disabled' }} />
      )}
    </ListItemButton>
  )
}


function SettingsPanel({
  email,
  isAdmin,
  ceasaStatus,
  refreshing,
  onChangePassword,
  onLogout,
  onRefreshPrices
}) {
  const navigate = useNavigate()

  return (
    <Box sx={{ pt: 'calc(16px + env(safe-area-inset-top))' }}>
      <Typography variant="h5" component="h1" sx={{ px: 0.5 }}>
        Ajustes
      </Typography>

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.75,
          borderRadius: '18px',
          border: 1,
          borderColor: 'divider'
        }}
      >
        <UserAvatar email={email} size={52} />

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap>
            {email}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isAdmin ? 'Administrador' : 'Conta Xepa'}
          </Typography>
        </Box>
      </Paper>


      <SettingsSection title="Conta">
        <SettingsRow
          icon={<LockOutlinedIcon />}
          label="Alterar senha"
          onClick={onChangePassword}
        />

        <SettingsRow
          icon={<LogoutIcon />}
          label="Sair da conta"
          onClick={onLogout}
          danger
        />
      </SettingsSection>


      {isAdmin && (
        <SettingsSection title="Administração">
          <SettingsRow
            icon={<SyncIcon />}
            label={refreshing ? 'Atualizando preços…' : 'Atualizar preços agora'}
            description={describeCeasaStatus(ceasaStatus)}
            onClick={onRefreshPrices}
            disabled={refreshing}
            trailing={
              refreshing ? <CircularProgress size={20} /> : undefined
            }
          />
        </SettingsSection>
      )}


      <SettingsSection title="Sobre">
        <SettingsRow
          icon={<PrivacyTipOutlinedIcon />}
          label="Política de privacidade"
          onClick={() => navigate('/privacy')}
        />

        <SettingsRow
          icon={<MailOutlineIcon />}
          label="Contato"
          onClick={() => navigate('/contact')}
        />
      </SettingsSection>

      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ display: 'block', textAlign: 'center', mt: 3 }}
      >
        Xepa · Preços de referência do CEASA/RS
        {ceasaStatus?.latestFileDate &&
          ` · cotação de ${formatShortDate(ceasaStatus.latestFileDate)}`}
      </Typography>
    </Box>
  )
}


export default SettingsPanel
