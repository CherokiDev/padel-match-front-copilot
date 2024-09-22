import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  TextField,
  Container,
  Typography,
  Fade,
  Paper,
  Divider,
  InputAdornment,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StyledButton from "./StyledButton";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      setIdentifier("");
      setPassword("");
    };
  }, []);

  const handleSubmit = async (e) => {
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
      enqueueSnackbar("Bienvenid@!", { variant: "success" });
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
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/players/forgot`, {
        email: forgotPasswordEmail,
      });
      enqueueSnackbar("Correo electrónico de recuperación enviado.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const duration = 2000;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3}>
        <Typography variant="h4" align="center">
          Padel Match
        </Typography>
      </Paper>
      <div>
        <Typography
          component="h5"
          variant="h5"
          style={{ marginBottom: "16px" }}
        >
          Bienvenid@ a Padel Match
        </Typography>

        <Typography
          component="h6"
          variant="h6"
          style={{ marginBottom: "16px" }}
        >
          Únete a la comunidad de jugadores de pádel de Puerto Serrano.
        </Typography>

        <Divider variant="middle" style={{ margin: "20px 0" }} />

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
            disabled={isSending}
          >
            {isSending ? (
              <CircularProgress size={24} />
            ) : (
              "Enviar correo de recuperación"
            )}
          </StyledButton>
        </form>
      </Fade>
    </Container>
  );
};

export default Login;
