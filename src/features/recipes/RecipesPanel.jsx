// React
import { useMemo, useState } from 'react'

// Third-party
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

// Components
import RecipeCard from './RecipeCard'

// Utils
import {
  estimateRecipeCost,
  searchRecipes
} from '../../utils/recipeHelpers'


function RecipesPanel({
  recipes,
  categories,
  productsById,
  productsByName,
  onOpenRecipe
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(null)

  const results = useMemo(
    () => searchRecipes(recipes, search, category),
    [recipes, search, category]
  )

  const costs = useMemo(
    () =>
      new Map(
        recipes.map(recipe => [
          recipe.id,
          estimateRecipeCost(recipe, productsById, productsByName)
        ])
      ),
    [recipes, productsById, productsByName]
  )

  return (
    <Box sx={{ pt: 'calc(16px + env(safe-area-inset-top))' }}>
      <Typography variant="h5" component="h1" sx={{ px: 0.5 }}>
        Receitas
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ px: 0.5, mt: 0.25 }}
      >
        Escolha um prato e mande os ingredientes para a lista.
      </Typography>

      <TextField
        fullWidth
        placeholder="Buscar receita ou ingrediente"
        value={search}
        onChange={event => setSearch(event.target.value)}
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
                  onClick={() => setSearch('')}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          },
          htmlInput: {
            enterKeyHint: 'search',
            'aria-label': 'Buscar receita'
          }
        }}
        sx={{ mt: 2 }}
      />

      {/* Category filter; scrolls sideways on small screens */}
      <Box
        role="tablist"
        aria-label="Categorias"
        sx={{
          display: 'flex',
          gap: 1,
          mt: 1.5,
          mx: -2,
          px: 2,
          pb: 0.5,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {[null, ...categories].map(option => {
          const selected = option === category

          return (
            <Chip
              key={option ?? 'all'}
              role="tab"
              aria-selected={selected}
              label={option ?? 'Todas'}
              onClick={() => setCategory(option)}
              sx={{
                flexShrink: 0,
                bgcolor: selected ? 'text.primary' : 'background.paper',
                color: selected ? 'background.paper' : 'text.primary',
                border: 1,
                borderColor: selected ? 'text.primary' : 'divider',
                '&:hover': {
                  bgcolor: selected ? 'text.primary' : 'background.paper'
                }
              }}
            />
          )
        })}
      </Box>

      {results.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))'
            },
            gap: 1.5,
            mt: 2
          }}
        >
          {results.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              cost={costs.get(recipe.id)}
              onClick={() => onOpenRecipe(recipe)}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
          <Typography variant="h6" component="p">
            Nenhuma receita encontrada
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Tente buscar por um ingrediente, como “frango” ou “batata”.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default RecipesPanel
