import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Container,
  Typography,
  Fade,
  Paper,
  Divider,
} from "@mui/material";
import { useSnackbar } from "notistack";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    return () => {
      setIdentifier("");
      setPassword("");
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/players/login`,
          {
            identifier,
            password,
          },
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
        enqueueSnackbar("Bienvenido!", { variant: "success" });
      } catch (error) {
        setLoginAttempts((prevAttempts) => prevAttempts + 1);
        if (loginAttempts >= 1) {
          setShowForgotPassword(true);
        }
        if (error.response && error.response.data.message) {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        } else {
          enqueueSnackbar("Ocurrió un error al iniciar sesión", {
            variant: "error",
          });
        }
      }
    },
    [identifier, password, navigate, enqueueSnackbar, loginAttempts]
  );

  const handleSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/players/forgot`, {
        email: forgotPasswordEmail,
      });
      enqueueSnackbar("Correo electrónico de recuperación enviado.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const duration = 2000;

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" align="center">
          Padel Match
        </Typography>
      </Paper>
      <Typography component="h1" variant="h5">
        Iniciar sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="identifier"
          label="Email o nombre de usuario"
          name="identifier"
          autoComplete="identifier"
          autoFocus
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          style={{ marginBottom: "0px" }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Contraseña"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginBottom: "10px" }}
        >
          Iniciar sesión
        </Button>

        <Divider variant="middle" style={{ margin: "20px 0" }} />

        <Typography variant="body1" style={{ marginTop: "10px" }}>
          ¿No tienes cuenta?
        </Typography>

        <Button
          onClick={handleSignup}
          fullWidth
          variant="outlined"
          color="primary"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          Regístrate
        </Button>
      </form>
      <Fade
        in={showForgotPassword}
        timeout={duration}
        style={{ marginTop: "50px" }}
      >
        <form onSubmit={handleForgotPassword}>
          <Typography variant="body1" style={{ marginTop: "10px" }}>
            ¿Olvidaste tu contraseña?
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="forgotPasswordEmail"
            label="Email para recuperar contraseña"
            name="forgotPasswordEmail"
            autoComplete="email"
            value={forgotPasswordEmail}
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            style={{ backgroundColor: "#F4DDA7" }}
          >
            Enviar correo de recuperación
          </Button>
        </form>
      </Fade>
    </Container>
  );
};

export default Login;
