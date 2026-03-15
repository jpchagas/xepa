import { Box, Button, Typography, Chip, Stack } from '@mui/material'

function ListControls({
  selectedList,
  members,
  onCreateList,
  onClearItems,
  onShareClick,
  onDeleteList
}) {

  if (!selectedList) return null

  return (
    <Box sx={{ mb: 2 }}>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Lista: {selectedList.name}
      </Typography>

      {/* Members */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2 }}
        flexWrap="wrap"
      >
        {members.map(member => {

          const isOwner = member.id === selectedList.ownerId

          return (
            <Chip
              key={member.id}
              label={isOwner ? `👑 ${member.email}` : member.email}
              size="small"
              color={isOwner ? "primary" : "default"}
              variant={isOwner ? "filled" : "outlined"}
            />
          )
        })}

        {/* Invite Chip */}
        <Chip
          label="+ Convidar"
          size="small"
          variant="outlined"
          onClick={onShareClick}
          sx={{ cursor: 'pointer' }}
        />

      </Stack>

      {/* Controls */}
      <Stack direction="row" spacing={1} flexWrap="wrap">

        <Button
          variant="contained"
          onClick={onCreateList}
        >
          Nova Lista
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={onClearItems}
        >
          Limpar Lista
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={onDeleteList}
        >
          Excluir Lista
        </Button>

      </Stack>

    </Box>
  )
}

export default ListControls