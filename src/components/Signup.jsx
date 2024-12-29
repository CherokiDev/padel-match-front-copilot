import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
    <div>
      <div>
        <h1>PADELERO</h1>
      </div>
      <h5>Registrarse</h5>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className={`input ${!emailIsValid ? "input-error" : ""}`}
        />
        {!emailIsValid && <span className="error-text">Email no válido</span>}
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre"
          value={name}
          onChange={handleNameChange}
          className="input"
        />
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="Teléfono"
          value={phone}
          onChange={handlePhoneChange}
          className={`input ${!phoneIsValid ? "input-error" : ""}`}
        />
        {!phoneIsValid && (
          <span className="error-text">
            Número de teléfono no válido, debe de tener 9 dígitos
          </span>
        )}
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Nombre de usuario (apodo)"
          value={username}
          onChange={handleUsernameChange}
          className="input"
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          onChange={handlePasswordChange}
          className={`input ${
            !passwordIsValid || !passwordsMatch ? "input-error" : ""
          }`}
        />
        {!passwordIsValid && (
          <span className="error-text">
            La contraseña debe tener al menos 8 caracteres, incluyendo letras,
            números y al menos una letra mayúscula
          </span>
        )}
        {!passwordsMatch && (
          <span className="error-text">Las contraseñas no coinciden</span>
        )}
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`input ${!passwordsMatch ? "input-error" : ""}`}
        />
        {!passwordsMatch && (
          <span className="error-text">Las contraseñas no coinciden</span>
        )}
        <button type="submit" disabled={isSubmitting}>
          Registrarse
        </button>
        <button onClick={handleGoToLogin}>Volver al inicio de sesión</button>
      </form>
    </div>
  );
};

export default Signup;
