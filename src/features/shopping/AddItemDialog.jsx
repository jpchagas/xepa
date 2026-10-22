// React
import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

// Third-party
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Dialog,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

// Components
import SeasonBadge from './SeasonBadge'

// Utils
import {
  formatDecimal,
  getDisplayUnit,
  getItemAmount,
  getProductLabel,
  normalizeText
} from '../../utils/shoppingHelpers'


const MAX_RESULTS = 80

const SlideUp = forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const formatUnit = unit => {
  if (!unit) return null
  // Priced per unit everywhere in the app (CEASA quotes the dozen).
  if (unit === 'DZ') return 'por unidade'

  return `por ${getDisplayUnit(unit)}`
}


function AddItemDialog({
  open,
  onClose,
  products,
  items,
  onAdd,
  season,
  seasonalIds
}) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const inputRef = useRef(null)

  const [search, setSearch] = useState('')
  const [pendingKey, setPendingKey] = useState(null)
  const [lastAdded, setLastAdded] = useState(null)


  // Hide the "added" confirmation after a moment.
  useEffect(() => {
    if (!lastAdded) return

    const timer = setTimeout(() => setLastAdded(null), 2200)

    return () => clearTimeout(timer)
  }, [lastAdded])


  const amountsByProduct = useMemo(
    () =>
      new Map(
        items.map(item => [item.productId, getItemAmount(item)])
      ),
    [items]
  )

  const sortedProducts = useMemo(
    () =>
      products
        .filter(product => product.name)
        .sort((a, b) =>
          a.name.localeCompare(b.name, 'pt-BR') ||
          (a.brand ?? '').localeCompare(b.brand ?? '', 'pt-BR')
        ),
    [products]
  )

  const query = normalizeText(search)

  // Names starting with the query first, then the rest. The brand is
  // part of the searched text: "sabão ypê" and "ypê" both find it.
  const results = useMemo(() => {
    if (!query) return sortedProducts

    const startsWith = []
    const contains = []

    sortedProducts.forEach(product => {
      const label = normalizeText(getProductLabel(product))

      if (label.startsWith(query)) startsWith.push(product)
      else if (label.includes(query)) contains.push(product)
    })

    return [...startsWith, ...contains]
  }, [query, sortedProducts])

  // "sabão" only matches a brandless Sabão, so a new one can still be
  // created when the name exists under other brands.
  const exactMatch = results.find(
    product => normalizeText(getProductLabel(product)) === query
  )

  const canCreate = !!query && !exactMatch


  const add = async (newItem, key, name) => {
    if (pendingKey === key) return

    setPendingKey(key)

    try {
      const result = await onAdd(newItem)

      if (result) {
        setLastAdded({ name, status: result.status, at: Date.now() })
        setSearch('')
      }
    } finally {
      setPendingKey(current => (current === key ? null : current))
      inputRef.current?.focus()
    }
  }

  const addProduct = product =>
    add({ type: 'existing', product }, product.id, getProductLabel(product))

  const addNewProduct = () => {
    const name = search.trim()

    add({ type: 'new', name }, 'new', name)
  }

  // Enter adds the exact match, or creates the product when
  // nothing matches. Partial matches need a tap.
  const handleKeyDown = event => {
    if (event.key !== 'Enter' || !query) return

    event.preventDefault()

    if (exactMatch) addProduct(exactMatch)
    else if (results.length === 0) addNewProduct()
  }

  const handleExited = () => {
    setSearch('')
    setLastAdded(null)
  }

  // With an empty search, produce in season comes first.
  const seasonal = query
    ? []
    : results.filter(product => seasonalIds.has(product.id))

  const others = seasonal.length
    ? results.filter(product => !seasonalIds.has(product.id))
    : results

  const visibleResults = others.slice(0, MAX_RESULTS)

  const sectionTitle = text => (
    <Typography
      variant="overline"
      color="text.secondary"
      component="h3"
      sx={{ display: 'block', px: 2, pt: 1.5, pb: 0.25 }}
    >
      {text}
    </Typography>
  )

  // The badge is redundant inside the "Da estação" section itself.
  const renderProduct = (product, { showSeason = true } = {}) => {
    const amount = amountsByProduct.get(product.id)

    return (
      <ListItemButton
        key={product.id}
        onClick={() => addProduct(product)}
      >
        <ListItemText
          primary={product.name}
          secondary={
            <Box
              component="span"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}
            >
              {[product.brand, formatUnit(product.unit)]
                .filter(Boolean)
                .join(' · ')}
              {showSeason && seasonalIds.has(product.id) && (
                <SeasonBadge season={season} />
              )}
            </Box>
          }
          slotProps={{
            primary: { sx: { fontWeight: 600 } }
          }}
        />

        {pendingKey === product.id ? (
          <CircularProgress size={22} />
        ) : amount !== undefined ? (
          <Chip
            size="small"
            label={`${formatDecimal(amount)} na lista`}
            sx={{ bgcolor: 'primary.main' }}
          />
        ) : (
          <AddCircleOutlineIcon color="action" />
        )}
      </ListItemButton>
    )
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      slots={{ transition: SlideUp }}
      slotProps={{
        transition: { onExited: handleExited },
        paper: {
          sx: {
            bgcolor: 'background.default',
            height: { sm: '80vh' }
          }
        }
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: fullScreen ? 'calc(12px + env(safe-area-inset-top))' : 2,
          pb: 1.5,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" component="h2">
            Adicionar itens
          </Typography>

          <Button variant="contained" size="small" onClick={onClose}>
            Concluir
          </Button>
        </Box>

        <TextField
          inputRef={inputRef}
          autoFocus
          fullWidth
          placeholder="Buscar ou criar produto"
          value={search}
          onChange={event => setSearch(event.target.value)}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    aria-label="Limpar busca"
                    onClick={() => {
                      setSearch('')
                      inputRef.current?.focus()
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            },
            htmlInput: {
              enterKeyHint: 'done',
              autoCorrect: 'off',
              'aria-label': 'Buscar produto'
            }
          }}
          sx={{ mt: 1.5 }}
        />

        <Collapse in={!!lastAdded}>
          <Box
            role="status"
            sx={{
              mt: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'success.dark'
            }}
          >
            <CheckCircleIcon fontSize="small" />

            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {lastAdded?.status === 'incremented'
                ? `+1 ${lastAdded?.name} na lista`
                : `${lastAdded?.name} adicionado à lista`}
            </Typography>
          </Box>
        </Collapse>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1,
          pt: 1,
          pb: 'calc(16px + env(safe-area-inset-bottom))'
        }}
      >
        <List disablePadding>
          {canCreate && (
            <ListItemButton
              onClick={addNewProduct}
              sx={{ mb: 0.5, bgcolor: 'background.paper' }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  mr: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  flexShrink: 0
                }}
              >
                {pendingKey === 'new' ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <AddIcon fontSize="small" />
                )}
              </Box>

              <ListItemText
                primary={<>Criar “<b>{search.trim()}</b>”</>}
                secondary="Novo produto · informe marca e preço na lista"
              />
            </ListItemButton>
          )}

          {seasonal.length > 0 && (
            <>
              {sectionTitle(`Da estação · ${season.name}`)}
              {seasonal.map(product => renderProduct(product, { showSeason: false }))}
              {sectionTitle('Todos os produtos')}
            </>
          )}

          {visibleResults.map(product => renderProduct(product))}
        </List>

        {others.length > MAX_RESULTS && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', py: 2 }}
          >
            Mostrando {MAX_RESULTS} de {others.length} produtos.
            Digite para refinar.
          </Typography>
        )}

        {!query && results.length === 0 && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: 'center', py: 6, px: 3 }}
          >
            Nenhum produto cadastrado ainda. Digite um nome para criar
            o primeiro.
          </Typography>
        )}
      </Box>
    </Dialog>
  )
}

export default AddItemDialog
