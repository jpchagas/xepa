import { Box, Button, Typography, Chip, Stack } from '@mui/material'

function ListControls({
  selectedList,
  members,
  onCreateList,
  onClearItems,
  onShareClick
}) {

  if (!selectedList) return null

  return (
    <Box sx={{ mb: 2 }}>

      <Typography variant="subtitle1">
        Lista: {selectedList.name}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2, mt: 1 }}>
        {members.map(member => (
          <Chip key={member.id} label={member.email} size="small" />
        ))}
      </Stack>

      <Stack direction="row" spacing={1}>
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
          onClick={onShareClick}
        >
          Compartilhar
        </Button>
      </Stack>

    </Box>
  )
}

export default ListControls