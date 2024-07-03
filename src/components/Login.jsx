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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
            identifier,
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
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          marginBottom: "20px",
          background: "linear-gradient(to right, #3775DF, #F0D053)",
        }}
      >
        <Typography variant="h4" align="center" style={{ color: "white" }}>
          Padel Match
        </Typography>
      </Paper>
      <Typography
        component="h1"
        variant="h6"
        marginBottom={2}
        style={{ color: "#1976d2", fontWeight: "bold" }}
      >
        Iniciar sesión
      </Typography>
      <Typography variant="body2" style={{ color: "#1976d2" }}>
        Bienvenid@ a Padel Match, inicia sesión para continuar.
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{
            marginBottom: "10px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          Entrar
        </Button>

        <Divider variant="middle" style={{ margin: "20px 0" }} />

        <Typography
          variant="body1"
          style={{ marginTop: "10px", color: "#1976d2" }}
        >
          ¿No tienes cuenta?
        </Typography>

        <Button
          onClick={handleSignup}
          fullWidth
          variant="outlined"
          color="primary"
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "20px",
            marginTop: "10px",
          }}
        >
          Registrarse
        </Button>
      </form>
      <Fade
        in={showForgotPassword}
        timeout={duration}
        style={{ marginTop: "50px" }}
      >
        <form onSubmit={handleForgotPassword}>
          <Divider variant="middle" style={{ margin: "20px 0" }} />
          <Typography
            variant="body1"
            style={{ marginTop: "10px", color: "#1976d2" }}
          >
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
            style={{
              backgroundColor: "#F4DDA7",
              borderRadius: "20px",
              marginTop: "10px",
            }}
          >
            Enviar correo de recuperación
          </Button>
        </form>
      </Fade>
    </Container>
  );
};

export default Login;
