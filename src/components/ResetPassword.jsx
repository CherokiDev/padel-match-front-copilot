import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StyledButton from "./StyledButton";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/players/reset/${token}`,
        {
          password,
        }
      );
      enqueueSnackbar("Contraseña restablecida con éxito", {
        variant: "success",
      });
      navigate("/login");
    } catch (error) {
      enqueueSnackbar("Error al restablecer la contraseña", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" align="center">
          Padel Match
        </Typography>
      </Paper>
      <Typography component="h5" variant="h5">
        Restablecer contraseña
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Nueva contraseña"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          error={!passwordIsValid || !passwordsMatch}
          helperText={
            !passwordIsValid
              ? "La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y al menos una letra mayúscula"
              : !passwordsMatch && "Las contraseñas no coinciden"
          }
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
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Confirmar nueva contraseña"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={!passwordsMatch}
          helperText={!passwordsMatch && "Las contraseñas no coinciden"}
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
          variant="contained"
          color="primary"
          fullWidth
          disabled={!passwordIsValid || !passwordsMatch || isSubmitting}
        >
          Restablecer contraseña
        </StyledButton>
      </form>
    </Container>
  );
};

export default ResetPassword;
