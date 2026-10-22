// React
import { useState } from 'react'

// Third-party
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'

// Utils
import { parseDecimal } from '../../utils/shoppingHelpers'


const UNITS = ['kg', 'un', 'L']


// Price entry for items without a CEASA price.
// The unit is only asked when the product doesn't have one yet; the
// brand (optional) only for user-created products without one.
function PriceEditor({ needsUnit, askBrand, onSave }) {
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('')
  const [brand, setBrand] = useState('')

  const parsedPrice = parseDecimal(price)

  const isValid =
    parsedPrice > 0 && (!needsUnit || !!unit)

  const handleSubmit = event => {
    event.preventDefault()

    if (!isValid) return

    onSave(
      Math.round(parsedPrice * 100) / 100,
      needsUnit ? unit : null,
      (askBrand && brand.trim()) || null
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1.5 }}>
      {askBrand && (
        <TextField
          label="Marca (opcional)"
          placeholder="Ex.: Ypê"
          size="small"
          fullWidth
          autoFocus
          value={brand}
          onChange={event => setBrand(event.target.value)}
          slotProps={{
            htmlInput: {
              maxLength: 40,
              autoCapitalize: 'words',
              enterKeyHint: 'next'
            }
          }}
          sx={{ mb: 1 }}
        />
      )}

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextField
          label="Preço"
          placeholder="0,00"
          size="small"
          autoFocus={!askBrand}
          value={price}
          onChange={event => setPrice(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              )
            },
            htmlInput: {
              inputMode: 'decimal',
              enterKeyHint: 'done'
            }
          }}
          sx={{ flex: 1, minWidth: 0 }}
        />

        {needsUnit && (
          <TextField
            select
            label="Por"
            size="small"
            value={unit}
            onChange={event => setUnit(event.target.value)}
            sx={{ width: 84, flexShrink: 0 }}
          >
            {UNITS.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={!isValid}
          sx={{ height: 40, flexShrink: 0 }}
        >
          Salvar
        </Button>
      </Box>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 0.75 }}
      >
        {askBrand
          ? 'Marcas diferentes têm preços diferentes. O preço fica disponível para todos que usam este produto.'
          : 'O preço fica disponível para todos que usam este produto.'}
      </Typography>
    </Box>
  )
}

export default PriceEditor
