// React
import {
  forwardRef,
  useMemo,
  useState
} from 'react'

// Third-party
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Slide,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RemoveIcon from '@mui/icons-material/Remove'
import ScheduleIcon from '@mui/icons-material/Schedule'

// Utils
import {
  buildRecipeLines,
  CATEGORY_TINTS,
  formatMinutes,
  formatQuantity,
  isSelectedByDefault
} from '../../utils/recipeHelpers'
import {
  formatCurrency,
  formatDecimal,
  getDisplayUnit
} from '../../utils/shoppingHelpers'


const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// "0,3 kg", "1 un"
const formatListAmount = (amount, unit) =>
  `${formatDecimal(amount)} ${getDisplayUnit(unit) || 'un'}`


function ServingsStepper({ value, onChange }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        p: 0.25,
        borderRadius: 99,
        bgcolor: 'background.default'
      }}
    >
      <IconButton
        size="small"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Menos porções"
        sx={{ bgcolor: 'background.paper' }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        sx={{ fontWeight: 700, minWidth: 74, textAlign: 'center' }}
        aria-live="polite"
      >
        {value} {value === 1 ? 'porção' : 'porções'}
      </Typography>

      <IconButton
        size="small"
        onClick={() => onChange(value + 1)}
        disabled={value >= 30}
        aria-label="Mais porções"
        sx={{ bgcolor: 'background.paper' }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  )
}


function IngredientRow({ line, scale, selected, inList, onToggle }) {
  const { resolved } = line

  return (
    <ListItemButton
      onClick={onToggle}
      role="checkbox"
      aria-checked={selected}
      sx={{ alignItems: 'flex-start', gap: 1.25, py: 1, px: 1 }}
    >
      <Box sx={{ pt: 0.25, color: selected ? 'success.main' : 'text.disabled' }}>
        {selected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {line.ingredients.map(ingredient => (
          <Typography
            key={ingredient.name}
            variant="body1"
            sx={{ fontWeight: 600, opacity: selected ? 1 : 0.6 }}
          >
            {ingredient.name}{' '}
            <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary' }}>
              · {formatQuantity(ingredient.qty, ingredient.unit, scale)}
              {ingredient.note && ` · ${ingredient.note}`}
            </Box>
          </Typography>
        ))}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.75,
            mt: 0.25
          }}
        >
          {selected && (resolved.ceasa || line.amount > 1) && (
            <Typography variant="caption" color="text.secondary">
              Lista: {formatListAmount(line.amount, resolved.product?.unit)}
              {resolved.ceasa && ` · ${resolved.name}`}
            </Typography>
          )}

          {line.pantry && !selected && (
            <Typography variant="caption" color="text.secondary">
              Geralmente já tem em casa
            </Typography>
          )}

          {inList && (
            <Chip
              size="small"
              label="já na lista"
              sx={{ height: 20, fontSize: 11, bgcolor: 'primary.main' }}
            />
          )}
        </Box>
      </Box>

      {selected && line.cost != null && (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums', pt: 0.25 }}
        >
          {formatCurrency(line.cost)}
        </Typography>
      )}
    </ListItemButton>
  )
}


// Recipe detail: pick servings and ingredients, then add to the list.
// onAdd(entries, recipe) receives [{ productId, name, ceasa, amount }].
function RecipeDialog({
  recipe,
  onClose,
  productsById,
  productsByName,
  listProductIds,
  listName,
  canAdd,
  onAdd
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // Keep the last recipe while the dialog slides out, and reset the
  // choices whenever a different recipe opens.
  const [current, setCurrent] = useState(recipe)
  const [servings, setServings] = useState(recipe?.servings ?? 1)
  const [toggled, setToggled] = useState(() => new Set())

  if (recipe && recipe !== current) {
    setCurrent(recipe)
    setServings(recipe.servings)
    setToggled(new Set())
  }

  const scale = current ? servings / current.servings : 1

  const lines = useMemo(
    () =>
      current
        ? buildRecipeLines(current, scale, productsById, productsByName)
        : [],
    [current, scale, productsById, productsByName]
  )

  // `toggled` holds the lines the user flipped from their default.
  const isSelected = line =>
    toggled.has(line.key)
      ? !isSelectedByDefault(line)
      : isSelectedByDefault(line)

  const selectedLines = lines.filter(isSelected)

  const selectedCost = selectedLines.reduce(
    (sum, line) => sum + (line.cost ?? 0),
    0
  )

  const toggle = key =>
    setToggled(previous => {
      const next = new Set(previous)

      if (next.has(key)) next.delete(key)
      else next.add(key)

      return next
    })

  const handleAdd = () => {
    onAdd(
      selectedLines.map(line => ({
        productId: line.resolved.productId,
        name: line.resolved.name,
        ceasa: line.resolved.ceasa,
        amount: line.amount
      })),
      current
    )
  }

  const count = selectedLines.length

  return (
    <Dialog
      open={!!recipe}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: {
          sx: { bgcolor: 'background.default', height: { sm: '88vh' } }
        }
      }}
    >
      {current && (
        <>
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {/* Hero */}
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                placeItems: 'center',
                height: 180,
                pt: 'env(safe-area-inset-top)',
                fontSize: 84,
                bgcolor: CATEGORY_TINTS[current.category] ?? 'background.paper'
              }}
              aria-hidden
            >
              {current.emoji}
            </Box>

            <IconButton
              onClick={onClose}
              aria-label="Fechar receita"
              sx={{
                position: 'absolute',
                top: 'calc(12px + env(safe-area-inset-top))',
                left: 12,
                bgcolor: 'background.paper',
                boxShadow: 1,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <CloseIcon />
            </IconButton>

            <Box sx={{ px: 2.5, pt: 2.5, pb: 3 }}>
              <Typography variant="overline" color="text.secondary">
                {current.category}
              </Typography>

              <Typography variant="h5" component="h2">
                {current.name}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  mt: 1.5
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <ScheduleIcon sx={{ fontSize: 18 }} />
                  {formatMinutes(current.minutes)}
                </Typography>

                <ServingsStepper value={servings} onChange={setServings} />
              </Box>


              {/* Ingredients */}
              <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
                Ingredientes
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Desmarque o que você já tem em casa.
              </Typography>

              <Paper
                elevation={0}
                sx={{ borderRadius: '18px', border: 1, borderColor: 'divider', p: 0.5 }}
              >
                <List disablePadding>
                  {lines.map(line => (
                    <IngredientRow
                      key={line.key}
                      line={line}
                      scale={scale}
                      selected={isSelected(line)}
                      inList={
                        !!line.resolved.productId &&
                        listProductIds.has(line.resolved.productId)
                      }
                      onToggle={() => toggle(line.key)}
                    />
                  ))}
                </List>
              </Paper>


              {/* Steps */}
              <Typography variant="h6" component="h3" sx={{ mt: 3, mb: 1.5 }}>
                Modo de preparo
              </Typography>

              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                {current.steps.map((step, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{ display: 'flex', gap: 1.5, mb: 2 }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 28,
                        height: 28,
                        flexShrink: 0,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        fontWeight: 800,
                        fontSize: 14
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography sx={{ pt: 0.25, lineHeight: 1.6 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>


          {/* Sticky action */}
          <Box
            sx={{
              px: 2,
              pt: 1.5,
              pb: 'calc(12px + env(safe-area-inset-bottom))',
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!canAdd || count === 0}
              onClick={handleAdd}
            >
              {count === 0
                ? 'Selecione os ingredientes'
                : `Adicionar ${count} ${count === 1 ? 'item' : 'itens'} à lista`}
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', textAlign: 'center', mt: 0.75 }}
            >
              {listName && `em ${listName}`}
              {selectedCost > 0 && ` · ≈ ${formatCurrency(selectedCost)} nos produtos do CEASA`}
            </Typography>
          </Box>
        </>
      )}
    </Dialog>
  )
}

export default RecipeDialog
