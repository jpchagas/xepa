// Third-party
import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'


// Stays aligned with the centered 600px column on wide screens.
function AddItemFab({ onClick }) {
  return (
    <Fab
      variant="extended"
      onClick={onClick}
      sx={{
        position: 'fixed',
        bottom: 'calc(80px + env(safe-area-inset-bottom))',
        right: 'max(16px, calc((100vw - 600px) / 2 + 16px))',
        zIndex: theme => theme.zIndex.appBar,
        px: 2.5,
        gap: 0.75
      }}
    >
      <AddIcon />
      Adicionar item
    </Fab>
  )
}

export default AddItemFab
