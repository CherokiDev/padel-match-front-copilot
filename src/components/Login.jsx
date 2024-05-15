import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setIdentifier("");
      setPassword("");
      setEmail("");
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        console.log("variable", import.meta.env.VITE_API_URL);
        const response = await axios.post(
          `https://padel-match-backend-28d0b4405030.herokuapp.com/players/login`,
          {
            identifier,
            password,
          }
        );
        console.log("hola", response.data);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        navigate("/home");
        toast("Bienvenido!");
      } catch (error) {
        if (error.response && error.response.data.message) {
          toast(error.response.data.message, { type: "error" });
        } else {
          toast("Ocurrió un error inesperado", { type: "error" });
        }
      }
    },
    [identifier, password, navigate]
  );

  const handleSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `https://padel-match-backend-28d0b4405030.herokuapp.com/players/forgot`,
        {
          email,
        }
      );
      toast("Correo electrónico de recuperación enviado.");
    } catch (error) {
      toast("Error al enviar el correo electrónico de recuperación.", {
        type: "error",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email o nombre de usuario"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email for password reset"
          required
        />
        <button type="submit">Forgot Password</button>
      </form>
    </>
  );
};

export default Login;
