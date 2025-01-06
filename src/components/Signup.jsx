import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useAuth from "../hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

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
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container-main-unlogged">
      <div className="container-header-unlogged">
        <div className="header-text-unlogged">PADELERO</div>
      </div>
      <div className="container-body-unlogged">
        <div className="title-h4">Registrarse</div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="title-h5" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className={`form-input ${
                !emailIsValid ? "form-input-error" : ""
              }`}
            />
            {!emailIsValid && (
              <div className="form-error-message visible">Email no válido.</div>
            )}
            <label className="title-h5" htmlFor="name">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              className="form-input"
            />
            <label className="title-h5" htmlFor="phone">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={phone}
              onChange={handlePhoneChange}
              className={`form-input ${
                !phoneIsValid ? "form-input-error" : ""
              }`}
            />
            {!phoneIsValid && (
              <div className="form-error-message visible">
                Número de teléfono no válido, debe de tener 9 dígitos
              </div>
            )}
            <label className="title-h5" htmlFor="username">
              Nombre de usuario (apodo)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleUsernameChange}
              className="form-input"
            />
            <label className="title-h5" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className={`form-input ${
                !passwordIsValid ? "form-input-error" : ""
              }`}
            />
            {!passwordIsValid && (
              <div className="form-error-message visible">
                La contraseña debe tener al menos 8 caracteres, incluyendo
                letras, números y al menos una letra mayúscula
              </div>
            )}
            {!passwordsMatch && (
              <span className="error-text">Las contraseñas no coinciden</span>
            )}
            <label className="title-h5" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`form-input ${
                !passwordsMatch ? "form-input-error" : ""
              }`}
            />
            {!passwordsMatch && (
              <div className="form-error-message visible">
                Las contraseñas no coinciden
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="form-primary-button"
          >
            Registrarse
          </button>
          <button
            type="button"
            className="form-secondary-button"
            onClick={handleGoToLogin}
          >
            Volver al inicio de sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
