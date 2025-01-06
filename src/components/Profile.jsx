import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/players/profile`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setProfile(response.data.dataValues);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "success" });
    setProfile(null);
    navigate("/login");
  };

  if (!profile) return null;

  return (
    <div className="container-main-logged">
      <div className="title-h3">Perfil</div>
      <div className="title-h5">Nombre: {profile.name}</div>
      <div className="title-h5">Email: {profile.email}</div>
      <div className="title-h5">Teléfono: {profile.phone}</div>
      <div className="title-h5">Usuario (apodo): {profile.username}</div>
      <div className="title-h5">
        Usuario desde: {new Date(profile.createdAt).toLocaleDateString()}
      </div>
      <button className="primary-button" disabled>
        Editar Perfil
      </button>
      <button className="secondary-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Profile;

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
