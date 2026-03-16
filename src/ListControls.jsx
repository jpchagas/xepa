import { Box, Button, Typography, Chip, Stack, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

function ListControls({
  selectedList,
  members,
  onCreateList,
  onClearItems,
  onShareClick,
  onDeleteList,
  onRemoveMember,
  onLeaveList,
  currentUserId
}) {

  if (!selectedList) return null

  const getInitials = (email) => email?.charAt(0).toUpperCase()

  return (
    <Box sx={{ mb: 2 }}>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Lista: {selectedList.name}
      </Typography>

      {/* Members */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">

        {members.map(member => {

          const isOwner = member.id === selectedList.ownerId

          return (
            <Chip
              key={member.id}
              avatar={<Avatar>{getInitials(member.email)}</Avatar>}
              label={isOwner ? `👑 ${member.email}` : member.email}
              size="small"
              color={isOwner ? 'primary' : 'default'}
              variant={isOwner ? 'filled' : 'outlined'}
              onDelete={
                currentUserId === selectedList.ownerId && !isOwner
                  ? () => onRemoveMember(member.id)
                  : undefined
              }
              deleteIcon={<CloseIcon />}
            />
          )
        })}

        <Chip
          label="+"
          size="small"
          onClick={onShareClick}
          sx={{ cursor: 'pointer' }}
        />

      </Stack>

      {/* Controls */}
      <Stack direction="row" spacing={1} flexWrap="wrap">

        <Button variant="contained" onClick={onCreateList}>
          Nova Lista
        </Button>

        <Button variant="outlined" color="error" onClick={onClearItems}>
          Limpar Lista
        </Button>

        <Button variant="outlined" color="error" onClick={onDeleteList}>
          Excluir Lista
        </Button>

        {selectedList.ownerId !== currentUserId && (
          <Button
            variant="outlined"
            color="warning"
            onClick={onLeaveList}
          >
            Sair da Lista
          </Button>
        )}

      </Stack>

    </Box>
  )
}

export default ListControls