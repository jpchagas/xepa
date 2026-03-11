import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import SettingsIcon from '@mui/icons-material/Settings'

function MainBottomNavigation({ value, onChange }) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={(e, val) => onChange(val)}>
        <BottomNavigationAction label="Lista" icon={<ListIcon />} />
        <BottomNavigationAction label="Configurações" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  )
}

export default MainBottomNavigation