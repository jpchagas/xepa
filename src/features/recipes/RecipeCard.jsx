// Third-party
import {
  Box,
  ButtonBase,
  Typography
} from '@mui/material'

import ScheduleIcon from '@mui/icons-material/Schedule'

// Utils
import {
  CATEGORY_TINTS,
  formatMinutes
} from '../../utils/recipeHelpers'
import { formatCurrency } from '../../utils/shoppingHelpers'


// `cost` is the CEASA-priced share of the ingredients (0 when unknown).
function RecipeCard({ recipe, cost, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label={`Ver receita: ${recipe.name}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        textAlign: 'left',
        borderRadius: '18px',
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        transition: 'transform 150ms ease',
        '&:active': { transform: 'scale(0.98)' }
      }}
    >
      <Box
        aria-hidden
        sx={{
          aspectRatio: '4 / 3',
          display: 'grid',
          placeItems: 'center',
          fontSize: 52,
          bgcolor: CATEGORY_TINTS[recipe.category] ?? 'background.default'
        }}
      >
        {recipe.emoji}
      </Box>

      <Box sx={{ p: 1.5, pt: 1.25, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {recipe.name}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
        >
          <ScheduleIcon sx={{ fontSize: 14 }} />
          {formatMinutes(recipe.minutes)} · {recipe.servings} porções
        </Typography>

        {cost > 0 && (
          <Typography
            variant="caption"
            sx={{ mt: 'auto', pt: 0.75, fontWeight: 700, color: 'success.dark' }}
          >
            ≈ {formatCurrency(cost)} no CEASA
          </Typography>
        )}
      </Box>
    </ButtonBase>
  )
}

export default RecipeCard
