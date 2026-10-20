// React
import { useState } from 'react'

// Third-party
import {
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  Typography
} from '@mui/material'
import {
  motion,
  useMotionValue,
  useTransform
} from 'framer-motion'

import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'

// Components
import PriceEditor from './PriceEditor'
import PriceTrendBadge from './PriceTrendBadge'
import SeasonBadge from './SeasonBadge'
import QuantityStepper from './QuantityStepper'

// Utils
import {
  formatCurrency,
  formatShortDate,
  getDisplayUnit,
  getEffectivePrice,
  getItemAmount,
  getItemPricing,
  getItemTotal,
  getPriceTrend,
  getProductName,
  isStalePrice
} from '../../utils/shoppingHelpers'


// Swipe further than this (px) to delete.
const SWIPE_DELETE_OFFSET = -120


function ShoppingListItem({
  item,
  product,
  onToggle,
  onUpdateAmount,
  onRemove,
  onSavePrice,
  swap,
  season,
  onOpenSwap
}) {
  const [editingPrice, setEditingPrice] = useState(false)

  const x = useMotionValue(0)
  const deleteHintOpacity = useTransform(x, [-72, -16], [1, 0])

  const name = getProductName(product, item.productId)
  const unit = product?.unit
  const displayUnit = getDisplayUnit(unit)
  const checked = !!item.checked

  const pricing = getItemPricing(item, product)
  const hasPrice = !!pricing.price

  const unitPrice =
    hasPrice ? getEffectivePrice(unit, pricing.price) : 0

  const trend =
    getPriceTrend(pricing.price, pricing.previousPrice)

  const priceLabel = hasPrice
    ? `${formatCurrency(unitPrice)}${displayUnit ? `/${displayUnit}` : ''}`
    : 'Sem preço do CEASA'

  const handleSavePrice = (price, newUnit) => {
    onSavePrice(item, price, newUnit)
    setEditingPrice(false)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '18px',
        overflow: 'hidden'
      }}
    >
      {/* Revealed while swiping left */}
      <motion.div
        aria-hidden
        style={{
          opacity: deleteHintOpacity,
          position: 'absolute',
          inset: 0
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1,
            pr: 3,
            bgcolor: 'error.main',
            color: 'error.contrastText',
            fontWeight: 700
          }}
        >
          <DeleteOutlineIcon />
          Remover
        </Box>
      </motion.div>

      <motion.div
        drag={editingPrice ? false : 'x'}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.55, right: 0 }}
        dragSnapToOrigin
        style={{ x, position: 'relative' }}
        onDragEnd={(_event, info) => {
          if (
            info.offset.x < SWIPE_DELETE_OFFSET ||
            info.velocity.x < -900
          ) {
            onRemove(item)
          }
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            pl: 0.75,
            borderRadius: '18px',
            border: 1,
            borderColor: 'divider',
            transition: 'opacity 200ms ease',
            opacity: checked ? 0.62 : 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
            <IconButton
              onClick={() => onToggle(item)}
              aria-label={
                checked
                  ? `Desmarcar ${name}`
                  : `Marcar ${name} como no carrinho`
              }
              sx={{
                mt: -0.5,
                color: checked ? 'success.main' : 'text.disabled'
              }}
            >
              {checked ? (
                <CheckCircleIcon />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </IconButton>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                onClick={() => onToggle(item)}
                sx={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1,
                  cursor: 'pointer'
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    overflowWrap: 'anywhere',
                    textDecoration: checked ? 'line-through' : 'none'
                  }}
                >
                  {name}
                </Typography>

                {hasPrice && (
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {formatCurrency(getItemTotal(item, product))}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  columnGap: 0.75,
                  rowGap: 0.25,
                  mt: 0.25
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {priceLabel}
                </Typography>

                <PriceTrendBadge trend={trend} />

                {season && <SeasonBadge season={season} />}

                {hasPrice && isStalePrice(pricing.fileDate) && (
                  <Typography variant="caption" color="warning.dark">
                    cotação de {formatShortDate(pricing.fileDate)}
                  </Typography>
                )}
              </Box>

              {(item.recipes?.length > 0 || item.swappedFrom) && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.25 }}
                >
                  {[
                    item.recipes?.length > 0 && `Para: ${item.recipes.join(', ')}`,
                    item.swappedFrom && `Trocado de ${item.swappedFrom.name}`
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
              )}

              {swap && !checked && (
                <Button
                  size="small"
                  onClick={() => onOpenSwap(item, swap)}
                  startIcon={<LightbulbOutlinedIcon />}
                  sx={{
                    mt: 0.75,
                    px: 1.25,
                    borderRadius: 99,
                    bgcolor: 'success.light',
                    color: 'success.dark',
                    fontWeight: 700,
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    '&:hover': { bgcolor: 'success.light' }
                  }}
                >
                  {swap.alternative.product.name} sai {formatCurrency(swap.savings)} mais barato
                </Button>
              )}

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  mt: 1.25
                }}
              >
                {!hasPrice && !checked ? (
                  <Button
                    size="small"
                    variant={editingPrice ? 'text' : 'outlined'}
                    startIcon={!editingPrice && <SellOutlinedIcon />}
                    onClick={() => setEditingPrice(open => !open)}
                    sx={{ borderRadius: 99 }}
                  >
                    {editingPrice ? 'Cancelar' : 'Informar preço'}
                  </Button>
                ) : (
                  <span />
                )}

                <QuantityStepper
                  value={getItemAmount(item)}
                  unit={displayUnit}
                  onChange={amount => onUpdateAmount(item.id, amount)}
                  onRemove={() => onRemove(item)}
                />
              </Box>

              <Collapse
                in={editingPrice && !hasPrice}
                unmountOnExit
              >
                <PriceEditor
                  needsUnit={!unit}
                  onSave={handleSavePrice}
                />
              </Collapse>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  )
}

export default ShoppingListItem
