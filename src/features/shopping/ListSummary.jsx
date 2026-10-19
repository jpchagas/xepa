// Third-party
import {
  Box,
  LinearProgress,
  Typography
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

// Utils
import { brand, brandGradient } from '../../theme'
import {
  formatCurrency,
  formatShortDate
} from '../../utils/shoppingHelpers'


function SavingsBadge({ savings }) {
  // Ignore rounding noise.
  if (Math.abs(savings) < 0.01) return null

  const cheaper = savings > 0
  const Icon = cheaper ? TrendingDownIcon : TrendingUpIcon

  return (
    <Box
      sx={{
        mt: 1.5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 99,
        bgcolor: 'rgba(255, 255, 255, 0.72)'
      }}
    >
      <Icon
        sx={{
          fontSize: 18,
          color: cheaper ? 'success.dark' : 'error.dark'
        }}
      />

      <Typography variant="caption" sx={{ fontWeight: 700 }}>
        {formatCurrency(Math.abs(savings))}{' '}
        {cheaper ? 'mais barato' : 'mais caro'} que a cotação anterior
      </Typography>
    </Box>
  )
}


function ListSummary({
  total,
  cartTotal,
  itemCount,
  checkedCount,
  savings,
  priceDate
}) {
  const progress =
    itemCount ? (checkedCount / itemCount) * 100 : 0

  const allChecked =
    itemCount > 0 && checkedCount === itemCount

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        mt: 0.5,
        mb: 2.5,
        p: 2.5,
        borderRadius: '24px',
        background: brandGradient,
        boxShadow: `0 16px 40px ${alpha(brand.orange, 0.28)}`
      }}
    >
      {/* Decorative highlight */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: -60,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.2)'
        }}
      />

      <Box sx={{ position: 'relative' }}>
        <Typography variant="overline" sx={{ opacity: 0.72 }}>
          Total estimado
        </Typography>

        <Typography
          variant="h4"
          component="p"
          sx={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}
        >
          {formatCurrency(total)}
        </Typography>

        <Typography
          variant="body2"
          sx={{ mt: 0.5, fontWeight: 500, opacity: 0.8 }}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'itens'}
          {priceDate &&
            ` · Cotação CEASA de ${formatShortDate(priceDate)}`}
        </Typography>

        <SavingsBadge savings={savings} />

        {itemCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.75
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {allChecked
                  ? 'Tudo no carrinho!'
                  : `${checkedCount} de ${itemCount} no carrinho`}
              </Typography>

              <Typography
                variant="caption"
                sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCurrency(cartTotal)}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Progresso das compras"
              sx={{
                bgcolor: 'rgba(22, 22, 26, 0.12)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'text.primary'
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default ListSummary
