import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

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
    <div>
      <div>
        <h1>PADELERO</h1>
      </div>
      <h5>Restablecer contraseña</h5>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={password}
            onChange={handlePasswordChange}
            className={`input ${
              !passwordIsValid || !passwordsMatch ? "input-error" : ""
            }`}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {!passwordIsValid && (
          <span className="error-text">
            La contraseña debe tener al menos 8 caracteres, incluyendo letras,
            números y al menos una letra mayúscula
          </span>
        )}
        {!passwordsMatch && (
          <span className="error-text">Las contraseñas no coinciden</span>
        )}
        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`input ${!passwordsMatch ? "input-error" : ""}`}
          />
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {!passwordsMatch && (
          <span className="error-text">Las contraseñas no coinciden</span>
        )}
        <button
          type="submit"
          disabled={!passwordIsValid || !passwordsMatch || isSubmitting}
        >
          Restablecer contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
