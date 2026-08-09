import PageSlide from "../components/layout/PageSlide";
import PageAppBar from "../components/navigation/PageAppBar";
import { Paper, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <PageSlide>
      <PageAppBar title="Política de Privacidade" />

      <Paper sx={{ p: 3, minHeight: "60vh" }}>
              <Typography paragraph>
                O aplicativo Xepa respeita sua privacidade. Este aplicativo coleta
                apenas as informações necessárias para fornecer seus serviços.
              </Typography>
      
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Informações que coletamos
              </Typography>
      
              <Typography paragraph>
                Podemos coletar seu endereço de e-mail para autenticação e para permitir
                o compartilhamento de listas de compras.
              </Typography>
      
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Publicidade
              </Typography>
      
              <Typography paragraph>
                Este aplicativo utiliza serviços de publicidade para exibir anúncios.
                Esses serviços podem utilizar cookies ou tecnologias similares.
              </Typography>
      
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Cookies
              </Typography>
      
              <Typography paragraph>
                Terceiros podem usar cookies para exibir anúncios com base em visitas
                anteriores ao site ou outros sites.
              </Typography>
      
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Contato
              </Typography>
      
              <Typography>
                Para dúvidas sobre esta política, entre em contato pelo e-mail:
                contato@xepa.app
              </Typography>
            </Paper>
    </PageSlide>
  );
}