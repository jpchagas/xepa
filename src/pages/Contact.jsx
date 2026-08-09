import PageSlide from "../components/layout/PageSlide";
import PageAppBar from "../components/navigation/PageAppBar";
import { Paper, Typography } from "@mui/material";

export default function Contact() {
  return (
    <PageSlide>
      <PageAppBar title="Contato" />

      <Paper sx={{ p: 3, minHeight: "60vh" }}>
        <Typography paragraph>
          Se você tiver dúvidas, sugestões ou encontrar algum problema
          no aplicativo Xepa, entre em contato com o desenvolvedor.
        </Typography>

        <Typography variant="subtitle1">
          Email
        </Typography>

        <Typography>
          contato@xepa.app
        </Typography>

        <Typography sx={{ mt: 3 }}>
          Responderemos assim que possível.
        </Typography>
      </Paper>
    </PageSlide>
  );
}