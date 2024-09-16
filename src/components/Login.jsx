import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Container,
  Typography,
  Fade,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StyledButton from "./StyledButton"; // Importa el botón estilizado

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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
            identifier: identifier.trimEnd(),
            password,
          },
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("token", response.data.token);
        navigate("/home");
        enqueueSnackbar("Bienvenido!", { variant: "success" });
      } catch (error) {
        setLoginAttempts((prevAttempts) => prevAttempts + 1);
        if (loginAttempts >= 0) {
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
      <Paper elevation={3}>
        <Typography variant="h4" align="center">
          Padel Match
        </Typography>
      </Paper>
      <Typography component="h5" variant="h5">
        Iniciar sesión
      </Typography>
      <div>
        <Typography variant="body2" style={{ marginBottom: "16px" }}>
          Bienvenid@ a Padel Match, tu aplicación para encontrar partidos de
          padel
        </Typography>
        <Typography variant="body2">Inicia sesión para continuar.</Typography>
      </div>
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
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <StyledButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Entrar
        </StyledButton>

        <Divider variant="middle" style={{ margin: "20px 0" }} />

        <Typography variant="h6">¿No tienes cuenta?</Typography>

        <StyledButton onClick={handleSignup} fullWidth variant="outlinedButton">
          Registrarse
        </StyledButton>
      </form>
      <Fade
        in={showForgotPassword}
        timeout={duration}
        style={{ marginTop: "20px" }}
      >
        <form onSubmit={handleForgotPassword}>
          <Divider variant="middle" style={{ margin: "20px 0" }} />
          <Typography variant="h6">¿Olvidaste tu contraseña?</Typography>
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
          <StyledButton
            type="submit"
            fullWidth
            variant="outlined"
            color="primary"
            style={{ backgroundColor: "#F4DDA7" }}
          >
            Enviar correo de recuperación
          </StyledButton>
        </form>
      </Fade>
    </Container>
  );
};

export default Login;
