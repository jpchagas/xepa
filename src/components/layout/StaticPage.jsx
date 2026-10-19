// Third-party
import {
  Box,
  Container,
  Paper
} from '@mui/material'

// Components
import PageAppBar from '../navigation/PageAppBar'
import PageSlide from './PageSlide'


// Shell for simple text pages (privacy, contact).
export default function StaticPage({ title, children }) {
  return (
    <PageSlide>
      <Box
        sx={{
          minHeight: '100dvh',
          bgcolor: 'background.default',
          pb: 'calc(32px + env(safe-area-inset-bottom))'
        }}
      >
        <PageAppBar title={title} />

        <Container maxWidth="sm" sx={{ pt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: '18px',
              border: 1,
              borderColor: 'divider',
              '& h2': { mt: 3, mb: 0.75 },
              '& h2:first-of-type': { mt: 0 },
              '& p': { color: 'text.secondary', lineHeight: 1.65 }
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </PageSlide>
  )
}
