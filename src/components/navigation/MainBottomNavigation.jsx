// Third-party
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import ListAltIcon from '@mui/icons-material/ListAlt'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import SettingsIcon from '@mui/icons-material/Settings'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'


function NavIcon({ active, icon: Icon, activeIcon: ActiveIcon }) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 0.4,
        display: 'flex',
        borderRadius: 99,
        bgcolor: active ? 'primary.main' : 'transparent',
        transition: 'background-color 200ms ease'
      }}
    >
      {active ? <ActiveIcon /> : <Icon />}
    </Box>
  )
}


function MainBottomNavigation({ value, onChange }) {
  return (
    <Paper
      component="nav"
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme => theme.zIndex.appBar,
        pb: 'env(safe-area-inset-bottom)',
        bgcolor: theme => alpha(theme.palette.background.paper, 0.92),
        backdropFilter: 'saturate(180%) blur(16px)',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, next) => onChange(next)}
        sx={{ maxWidth: 600, mx: 'auto' }}
      >
        <BottomNavigationAction
          value="list"
          label="Lista"
          icon={
            <NavIcon
              active={value === 'list'}
              icon={ListAltOutlinedIcon}
              activeIcon={ListAltIcon}
            />
          }
        />

        <BottomNavigationAction
          value="recipes"
          label="Receitas"
          icon={
            <NavIcon
              active={value === 'recipes'}
              icon={MenuBookOutlinedIcon}
              activeIcon={MenuBookIcon}
            />
          }
        />

        <BottomNavigationAction
          value="settings"
          label="Ajustes"
          icon={
            <NavIcon
              active={value === 'settings'}
              icon={SettingsOutlinedIcon}
              activeIcon={SettingsIcon}
            />
          }
        />
      </BottomNavigation>
    </Paper>
  )
}

export default MainBottomNavigation
