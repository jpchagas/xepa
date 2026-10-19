// React
import { useState } from 'react'

// Third-party
import {
  Box,
  IconButton,
  InputBase,
  Typography
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RemoveIcon from '@mui/icons-material/Remove'

// Utils
import {
  formatDecimal,
  parseDecimal
} from '../../utils/shoppingHelpers'


// Avoids 0.30000000000000004 after +/- on decimals.
const roundAmount = value =>
  Math.round(value * 1000) / 1000


// Input is not data: the field is edited freely and only
// saved (and validated) on blur.
function QuantityStepper({ value, unit, onChange, onRemove }) {
  const [draft, setDraft] = useState(formatDecimal(value))
  const [syncedValue, setSyncedValue] = useState(value)

  // Someone else changed the amount (or +/- was tapped).
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(formatDecimal(value))
  }

  const commit = () => {
    const amount = parseDecimal(draft)

    if (isNaN(amount) || amount < 0 || amount === value) {
      setDraft(formatDecimal(value))
      return
    }

    onChange(roundAmount(amount))
  }

  const canDecrease = value > 1

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        p: 0.25,
        borderRadius: 99,
        bgcolor: 'background.default'
      }}
    >
      <IconButton
        size="small"
        onClick={() =>
          canDecrease
            ? onChange(roundAmount(value - 1))
            : onRemove()
        }
        aria-label={canDecrease ? 'Diminuir quantidade' : 'Remover item'}
        sx={{ bgcolor: 'background.paper' }}
      >
        {canDecrease ? (
          <RemoveIcon fontSize="small" />
        ) : (
          <DeleteOutlineIcon fontSize="small" />
        )}
      </IconButton>

      <InputBase
        value={draft}
        onChange={event => setDraft(event.target.value)}
        onFocus={event => event.target.select()}
        onBlur={commit}
        onKeyDown={event => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        slotProps={{
          input: {
            inputMode: 'decimal',
            'aria-label': 'Quantidade',
            style: {
              width: 36,
              padding: 0,
              textAlign: 'center',
              fontWeight: 700
            }
          }
        }}
      />

      {unit && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mr: 0.5, fontWeight: 600 }}
        >
          {unit}
        </Typography>
      )}

      <IconButton
        size="small"
        onClick={() => onChange(roundAmount(value + 1))}
        aria-label="Aumentar quantidade"
        sx={{ bgcolor: 'background.paper' }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}

export default QuantityStepper
