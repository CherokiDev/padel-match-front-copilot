import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast("Las contraseñas no coinciden", { type: "error" });
      return;
    }
    try {
      await axios.post(`http://localhost:3000/players/reset/${token}`, {
        password,
      });
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
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nueva contraseña"
        required
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
