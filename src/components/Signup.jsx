import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Container, Typography, Paper } from "@mui/material";
import { useSnackbar } from "notistack";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setEmailIsValid(emailRegex.test(e.target.value));
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    const phoneRegex = /^[0-9]{9}$/;
    setPhoneIsValid(phoneRegex.test(e.target.value));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,}$/;
    setPasswordIsValid(passwordRegex.test(e.target.value));
    setPasswordsMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(password === e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      enqueueSnackbar("Las contraseñas no coinciden", { variant: "error" });
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/players`, {
        email,
        name: name.trimEnd(),
        phone,
        username: username.trimEnd(),
        password,
      });
      enqueueSnackbar("Usuario creado con éxito", { variant: "success" });

      // Log in the user after successful registration
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/players/login`,
        {
          identifier: username.trimEnd(), // or you can use email
          password,
        },
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("token", loginResponse.data.token);

      // Send registration details email
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/send-registration-details-email`,
          {
            email,
          }
        );
        enqueueSnackbar("Correo de confirmación enviado con éxito", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("Error al enviar el correo de confirmación", {
          variant: "error",
        });
      }

      navigate("/home"); // Change this to the route you want after logging in
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" align="center">
          Padel Match
        </Typography>
      </Paper>
      <Typography component="h1" variant="h5">
        Registrarse
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
          error={!emailIsValid}
          helperText={!emailIsValid && "Email no válido"}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="name"
          label="Nombre"
          name="name"
          autoComplete="name"
          value={name}
          onChange={handleNameChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="phone"
          label="Teléfono"
          name="phone"
          autoComplete="phone"
          value={phone}
          onChange={handlePhoneChange}
          error={!phoneIsValid}
          helperText={
            !phoneIsValid &&
            "Número de teléfono no válido, debe de tener 9 dígitos"
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Nombre de usuario"
          name="username"
          autoComplete="username"
          value={username}
          onChange={handleUsernameChange}
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
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
          error={!passwordIsValid || !passwordsMatch}
          helperText={
            !passwordIsValid
              ? "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y al menos una letra mayúscula"
              : !passwordsMatch && "Las contraseñas no coinciden"
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          id="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!passwordsMatch}
          helperText={!passwordsMatch && "Las contraseñas no coinciden"}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginBottom: "10px" }}
          disabled={isSubmitting}
        >
          Registrarse
        </Button>
        <Button
          type="button"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleGoToLogin}
        >
          Volver al inicio de sesión
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
