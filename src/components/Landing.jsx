// src/components/Landing.jsx
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-container">
      <h1>Bienvenido a Nuestra Aplicación</h1>
      <p>Descripción breve de la aplicación.</p>
      <div className="landing-buttons">
        <Link to="/login" className="btn">
          Iniciar Sesión
        </Link>
        <Link to="/signup" className="btn">
          Registrarse
        </Link>
      </div>
    </div>
  );
};

export default Landing;
