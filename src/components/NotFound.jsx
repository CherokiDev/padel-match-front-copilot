import { useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <Container
      component="main"
      maxWidth="md"
      style={{ textAlign: "center", marginTop: "50px" }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Página no encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleGoHome}>
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
