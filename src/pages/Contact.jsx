// Third-party
import { Button, Typography } from '@mui/material'
import MailOutlineIcon from '@mui/icons-material/MailOutline'

// Components
import StaticPage from '../components/layout/StaticPage'


const CONTACT_EMAIL = 'contato@xepa.app'

export default function Contact() {
  return (
    <StaticPage title="Contato">
      <Typography variant="h6" component="h2">
        Fale com a gente
      </Typography>

      <Typography>
        Se você tiver dúvidas, sugestões ou encontrar algum problema
        no aplicativo Xepa, entre em contato com o desenvolvedor.
        Responderemos assim que possível.
      </Typography>

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={<MailOutlineIcon />}
        href={`mailto:${CONTACT_EMAIL}`}
        sx={{ mt: 3 }}
      >
        {CONTACT_EMAIL}
      </Button>
    </StaticPage>
  )
}
