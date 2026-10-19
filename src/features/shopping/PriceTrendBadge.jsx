// Third-party
import { Box } from '@mui/material'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'


// `trend` comes from getPriceTrend(); renders nothing when null.
function PriceTrendBadge({ trend }) {
  if (!trend) return null

  const down = trend.direction === 'down'
  const Icon = down ? ArrowDownwardIcon : ArrowUpwardIcon

  return (
    <Box
      component="span"
      title="Comparado à cotação anterior"
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
        bgcolor: down ? 'success.light' : 'error.light',
        color: down ? 'success.dark' : 'error.dark'
      }}
    >
      <Icon sx={{ fontSize: 12 }} />
      {trend.percent}%
    </Box>
  )
}

export default PriceTrendBadge
