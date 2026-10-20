// React
import { useState } from 'react'

// Third-party
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

// Utils
import {
  formatCurrency,
  formatDecimal,
  getDisplayUnit,
  getItemAmount
} from '../../utils/shoppingHelpers'
import { NUTRIENT_ROWS } from '../../utils/swapHelpers'


const numberFormat = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })


function PriceCard({ label, name, unitPrice, unit, highlight }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 1.5,
        borderRadius: '14px',
        border: 1,
        borderColor: highlight ? 'success.main' : 'divider',
        bgcolor: highlight ? 'success.light' : 'background.default'
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="subtitle2" sx={{ lineHeight: 1.3 }}>
        {name}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          fontWeight: 800,
          color: highlight ? 'success.dark' : 'text.primary'
        }}
      >
        {formatCurrency(unitPrice)}/{unit}
      </Typography>
    </Box>
  )
}


// `swap` comes from findSwap(); `item` is the list item it applies to.
function SwapDialog({ swap, item, onClose, onSwap, onKeep }) {
  // Keep the content while the dialog fades out.
  const [shown, setShown] = useState({ swap, item })

  if (swap && swap !== shown.swap) {
    setShown({ swap, item })
  }

  const current = shown.swap?.current
  const alternative = shown.swap?.alternative

  const unit = getDisplayUnit(current?.product.unit)
  const recipes = shown.item?.recipes ?? []

  const approximate = [current?.entry, alternative?.entry]
    .filter(entry => entry?.approx)
    .map(entry => entry.ceasa)

  return (
    <Dialog open={!!swap} onClose={onClose} fullWidth maxWidth="xs">
      {current && alternative && (
        <>
          <DialogTitle sx={{ pb: 0.5 }}>
            Troca mais barata
          </DialogTitle>

          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              Valor nutricional parecido, por um preço menor.
            </Typography>

            {/* Prices */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <PriceCard
                label="Na lista"
                name={current.product.name}
                unitPrice={current.unitPrice}
                unit={unit}
              />

              <ArrowForwardIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />

              <PriceCard
                label="Sugestão"
                name={alternative.product.name}
                unitPrice={alternative.unitPrice}
                unit={unit}
                highlight
              />
            </Box>

            <Typography
              variant="subtitle2"
              sx={{ mt: 1.5, color: 'success.dark', textAlign: 'center' }}
            >
              Economia de {formatCurrency(shown.swap.savings)} nesta lista
              {` (${formatDecimal(getItemAmount(shown.item))} ${unit})`}
            </Typography>


            {/* Recipe impact */}
            {recipes.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2, alignItems: 'flex-start' }}>
                <AlertTitle sx={{ fontWeight: 700 }}>
                  Muda {recipes.length === 1 ? 'a receita' : 'as receitas'}: {recipes.join(', ')}
                </AlertTitle>
                {alternative.entry.note}
              </Alert>
            )}


            {/* Nutrition */}
            <Typography variant="overline" color="text.secondary" component="h3" sx={{ display: 'block', mt: 2.5 }}>
              Nutrição por 100 g
            </Typography>

            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 14,
                '& th, & td': { py: 0.75, borderBottom: 1, borderColor: 'divider' },
                '& th': { textAlign: 'left', fontWeight: 500, color: 'text.secondary' },
                '& td': { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
                '& thead td': { fontWeight: 700, color: 'text.primary', fontSize: 12 }
              }}
            >
              <thead>
                <tr>
                  <th aria-label="Nutriente" />
                  <td>{current.product.name}</td>
                  <td>{alternative.product.name}</td>
                </tr>
              </thead>
              <tbody>
                {NUTRIENT_ROWS.map(row => (
                  <tr key={row.key}>
                    <th scope="row">{row.label}</th>
                    <td>{numberFormat.format(current.nutrition[row.key])} {row.unit}</td>
                    <td>{numberFormat.format(alternative.nutrition[row.key])} {row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </Box>

            {shown.swap.highlights.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5 }}>
                {shown.swap.highlights.map(highlight => (
                  <Chip
                    key={highlight.label}
                    size="small"
                    label={`${highlight.direction === 'more' ? 'Mais' : 'Menos'} ${highlight.label}`}
                    sx={{
                      bgcolor: highlight.direction === 'more' ? 'success.light' : 'warning.light',
                      color: highlight.direction === 'more' ? 'success.dark' : 'warning.dark'
                    }}
                  />
                ))}
              </Box>
            )}


            {/* Cooking */}
            {recipes.length === 0 && (
              <>
                <Typography variant="overline" color="text.secondary" component="h3" sx={{ display: 'block', mt: 2.5 }}>
                  Na cozinha
                </Typography>

                <Typography variant="body2">
                  {alternative.entry.note}
                </Typography>
              </>
            )}


            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 2.5, lineHeight: 1.5 }}>
              Fonte: TabNut (EPM/Unifesp), base USDA SR25 · alimentos crus.
              {approximate.length > 0 &&
                ` Valores aproximados para ${approximate.join(' e ')}, sem dado exato na tabela.`}
            </Typography>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={onKeep} color="inherit">
              Manter {current.product.name}
            </Button>

            <Button variant="contained" onClick={onSwap}>
              Trocar
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default SwapDialog
