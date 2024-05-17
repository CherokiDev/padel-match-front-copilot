import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneIsValid, setPhoneIsValid] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    setEmailIsValid(emailRegex.test(e.target.value));
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    const phoneRegex = /^[0-9]{9}$/;
    setPhoneIsValid(phoneRegex.test(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    setPasswordIsValid(passwordRegex.test(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      toast("Email no válido", { type: "error" });
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast(
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
        { type: "error" }
      );
      return;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      toast("Número de teléfono no válido, debe de tener 9 dígitos", {
        type: "error",
      });
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/players`, {
        email,
        name,
        phone,
        username,
        password,
      });
      navigate("/login");
      toast("Usuario creado con éxito");
    } catch (error) {
      toast(error.response.data.message, { type: "error" });
    }
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        required
        className={emailIsValid ? "" : "invalid"}
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="Phone"
        required
        className={phoneIsValid ? "" : "invalid"}
      />
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Apodo"
        required
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        required
        className={passwordIsValid ? "" : "invalid"}
      />
      <button type="submit">Signup</button>
      <button type="button" onClick={handleGoToLogin}>
        Go to Login
      </button>
    </form>
  );
};

export default Signup;
