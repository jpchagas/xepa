// React
import { useState } from 'react'

// Third-party
import {
  AvatarGroup,
  Badge,
  Box,
  ButtonBase,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import CheckIcon from '@mui/icons-material/Check'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import RemoveDoneIcon from '@mui/icons-material/RemoveDone'

// Components
import UserAvatar from '../../components/display/UserAvatar'


const roundButtonSx = {
  width: 40,
  height: 40,
  bgcolor: 'background.paper',
  border: 1,
  borderColor: 'divider'
}


function ListHeader({
  lists,
  selectedList,
  members,
  isOwner,
  itemCount,
  checkedCount,
  unreadCount,
  onOpenNotifications,
  onSelectList,
  onCreateList,
  onOpenMembers,
  onRemoveChecked,
  onClearItems,
  onDeleteList,
  onLeaveList
}) {
  const [listMenuAnchor, setListMenuAnchor] = useState(null)
  const [actionsAnchor, setActionsAnchor] = useState(null)

  const runFromListMenu = action => () => {
    setListMenuAnchor(null)
    action()
  }

  const runFromActions = action => () => {
    setActionsAnchor(null)
    action()
  }

  const isShared = members.length > 1

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: theme => theme.zIndex.appBar,
        mx: -2,
        px: 2,
        pt: 'calc(12px + env(safe-area-inset-top))',
        pb: 1.5,
        bgcolor: theme => alpha(theme.palette.background.default, 0.88),
        backdropFilter: 'saturate(180%) blur(16px)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Who has access; opens sharing */}
          <ButtonBase
            onClick={onOpenMembers}
            aria-label={isShared ? `Compartilhada com ${members.length} pessoas` : 'Compartilhar lista'}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75, borderRadius: 99, minHeight: 24 }}
          >
            <Typography variant="overline" color="text.secondary" noWrap>
              {isShared ? 'Compartilhada' : 'Lista de compras'}
            </Typography>

            {isShared ? (
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatar-root': {
                    width: 22,
                    height: 22,
                    fontSize: 11,
                    borderWidth: 1.5,
                    borderColor: 'background.default'
                  }
                }}
              >
                {members.map(member => (
                  <UserAvatar
                    key={member.id}
                    email={member.email}
                    size={22}
                  />
                ))}
              </AvatarGroup>
            ) : (
              <Typography
                variant="caption"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.25, fontWeight: 700 }}
              >
                <PersonAddAlt1OutlinedIcon sx={{ fontSize: 16 }} />
                Convidar
              </Typography>
            )}
          </ButtonBase>

          <ButtonBase
            onClick={event => setListMenuAnchor(event.currentTarget)}
            aria-haspopup="menu"
            aria-label="Trocar de lista"
            sx={{
              display: 'flex',
              maxWidth: '100%',
              justifyContent: 'flex-start',
              textAlign: 'left',
              borderRadius: '10px'
            }}
          >
            <Typography variant="h5" component="h1" noWrap>
              {selectedList.name}
            </Typography>

            <KeyboardArrowDownIcon sx={{ ml: 0.25, flexShrink: 0 }} />
          </ButtonBase>
        </Box>

        <IconButton
          onClick={onOpenNotifications}
          aria-label={
            unreadCount > 0
              ? `Notificações, ${unreadCount} novas`
              : 'Notificações'
          }
          sx={roundButtonSx}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={9}
            sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton
          onClick={event => setActionsAnchor(event.currentTarget)}
          aria-label="Mais opções"
          aria-haspopup="menu"
          sx={roundButtonSx}
        >
          <MoreHorizIcon />
        </IconButton>
      </Box>


      {/* List switcher */}

      <Menu
        anchorEl={listMenuAnchor}
        open={!!listMenuAnchor}
        onClose={() => setListMenuAnchor(null)}
      >
        {lists.map(list => {
          const selected = list.id === selectedList.id

          return (
            <MenuItem
              key={list.id}
              selected={selected}
              onClick={runFromListMenu(() => onSelectList(list.id))}
            >
              <ListItemIcon>
                {selected && <CheckIcon fontSize="small" />}
              </ListItemIcon>

              <ListItemText
                primary={list.name}
                secondary={
                  list.members.length > 1
                    ? `${list.members.length} pessoas`
                    : 'Só você'
                }
              />
            </MenuItem>
          )
        })}

        <Divider />

        <MenuItem onClick={runFromListMenu(onCreateList)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Nova lista
        </MenuItem>
      </Menu>


      {/* List actions */}

      <Menu
        anchorEl={actionsAnchor}
        open={!!actionsAnchor}
        onClose={() => setActionsAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={runFromActions(onOpenMembers)}>
          <ListItemIcon>
            <PersonAddAlt1OutlinedIcon fontSize="small" />
          </ListItemIcon>
          Compartilhar lista
        </MenuItem>

        <MenuItem onClick={runFromActions(onCreateList)}>
          <ListItemIcon>
            <AddIcon fontSize="small" />
          </ListItemIcon>
          Nova lista
        </MenuItem>

        {checkedCount > 0 && (
          <MenuItem onClick={runFromActions(onRemoveChecked)}>
            <ListItemIcon>
              <RemoveDoneIcon fontSize="small" />
            </ListItemIcon>
            Remover itens marcados ({checkedCount})
          </MenuItem>
        )}

        {itemCount > 0 && (
          <MenuItem onClick={runFromActions(onClearItems)}>
            <ListItemIcon>
              <DeleteSweepOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Limpar lista
          </MenuItem>
        )}

        <Divider />

        {isOwner ? (
          <MenuItem
            onClick={runFromActions(onDeleteList)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            Excluir lista
          </MenuItem>
        ) : (
          <MenuItem
            onClick={runFromActions(onLeaveList)}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sair da lista
          </MenuItem>
        )}
      </Menu>
    </Box>
  )
}

export default ListHeader
