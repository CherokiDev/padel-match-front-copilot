import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          "http://localhost:3000/players/login",
          {
            email,
            password,
          }
        );
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("id", response.data.id);
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
    [email, password, navigate]
  );

  const handleSignup = useCallback(() => {
    navigate("/signup");
  }, [navigate]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
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
    </>
  );
};

export default Login;
