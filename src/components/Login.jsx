import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";
import "./Login.css";
import LoadingScreen from "./LoadingScreen";

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
  const { isAuthenticated } = useAuth();

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
    setIsSending(true);
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
    } finally {
      setIsSending(false);
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

  if (isSending) {
    return <LoadingScreen />;
  }

  return (
    <div className="container-main-unlogged">
      <div className="container-header-unlogged">
        <div className="header-text-unlogged">PADELERO</div>
      </div>
      <div className="container-body-unlogged">
        <div className="title-h4">
          Únete a la comunidad de jugadores de pádel de Puerto Serrano.
        </div>
        <hr className="hr-separator" />
        <div className="title-h4">Inicia sesión para continuar.</div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="title-h5" htmlFor="identifier">
              Email o nombre de usuario
            </label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="form-input"
            />
            <label className="title-h5" htmlFor="password">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="form-toggle-password"
            >
              {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            </button>
          </div>
          <button type="submit" className="form-primary-button">
            Entrar
          </button>
          <hr className="hr-separator" />
          <div className="title-h4">¿No tienes cuenta?</div>
          <button
            type="button"
            onClick={handleSignup}
            className="form-secondary-button"
          >
            Registrarse
          </button>
        </form>
        {showForgotPassword && (
          <div>
            <hr className="hr-separator" />
            <div className="title-h4">¿Olvidaste tu contraseña?</div>
            <form className="form" onSubmit={handleForgotPassword}>
              <div className="form-group">
                <label className="title-h5" htmlFor="forgotPasswordEmail">
                  Email para recuperar la contraseña
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  name="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <button type="submit" className="form-primary-button">
                Enviar email de recuperación
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
