import { Fab } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

function AddItemFab({ onClick }) {
  return (
    <Fab
      color="primary"
      onClick={onClick}
      sx={{ position: 'fixed', bottom: 80, right: 20 }}
    >
      <AddIcon />
    </Fab>
  )
}

export default AddItemFab