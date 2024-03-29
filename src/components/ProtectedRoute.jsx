// src/components/ProtectedRoute.js
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // O puedes retornar un componente de carga
  }

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default ProtectedRoute;
