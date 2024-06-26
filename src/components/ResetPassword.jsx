import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(true); // Nuevo estado
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Validación de contraseña (al menos 8 caracteres, letras y números)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    setPasswordIsValid(passwordRegex.test(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Las contraseñas no coinciden", { type: "error" });
      return;
    }
    // Validación de contraseña (al menos 8 caracteres, letras y números)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast(
        "La contraseña debe tener al menos 8 caracteres, incluyendo letras y números",
        { type: "error" }
      );
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/players/reset/${token}`,
        {
          password,
        }
      );
      toast("Contraseña restablecida con éxito");
      navigate("/login");
    } catch (error) {
      toast("Error al restablecer la contraseña", { type: "error" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange} // Usar el nuevo manejador
        placeholder="Nueva contraseña"
        required
        className={passwordIsValid ? "" : "invalid"} // Nueva clase
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar nueva contraseña"
        required
      />
      <button type="submit">Restablecer contraseña</button>
    </form>
  );
};

export default ResetPassword;
