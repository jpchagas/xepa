// Third-party
import { Link, Typography } from '@mui/material'

// Components
import StaticPage from '../components/layout/StaticPage'


export default function PrivacyPolicy() {
  return (
    <StaticPage title="Privacidade">
      <Typography variant="h6" component="h2">
        Política de Privacidade
      </Typography>

      <Typography>
        O aplicativo Xepa respeita sua privacidade. Este aplicativo coleta
        apenas as informações necessárias para fornecer seus serviços.
      </Typography>

      <Typography variant="subtitle1" component="h2">
        Informações que coletamos
      </Typography>

      <Typography>
        Podemos coletar seu endereço de e-mail para autenticação e para permitir
        o compartilhamento de listas de compras.
      </Typography>

      <Typography variant="subtitle1" component="h2">
        Publicidade
      </Typography>

      <Typography>
        Este aplicativo utiliza serviços de publicidade para exibir anúncios.
        Esses serviços podem utilizar cookies ou tecnologias similares.
      </Typography>

      <Typography variant="subtitle1" component="h2">
        Cookies
      </Typography>

      <Typography>
        Terceiros podem usar cookies para exibir anúncios com base em visitas
        anteriores ao site ou outros sites.
      </Typography>

      <Typography variant="subtitle1" component="h2">
        Contato
      </Typography>

      <Typography>
        Para dúvidas sobre esta política, entre em contato pelo e-mail{' '}
        <Link href="mailto:contato@xepa.app" color="text.primary" fontWeight={600}>
          contato@xepa.app
        </Link>
        .
      </Typography>
    </StaticPage>
  )
}
