// Third-party
import { Box } from '@mui/material'
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined'


// "da estação" pill for produce in its harvest season (data/seasons.js).
function SeasonBadge({ season }) {
  return (
    <Box
      component="span"
      title={`Época de safra: ${season.name.toLowerCase()} (${season.months})`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
        px: 0.75,
        py: 0.125,
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 700,
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
        bgcolor: '#E3F4E1',
        color: '#2E7D32'
      }}
    >
      <SpaOutlinedIcon sx={{ fontSize: 13 }} />
      da estação
    </Box>
  )
}

export default SeasonBadge
