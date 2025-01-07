import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/profileSlice";
import PropTypes from "prop-types";
import LoadingScreen from "./LoadingScreen";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: profileData,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "success" });
    navigate("/login");
  };

  if (profileStatus === "loading") return <LoadingScreen />;

  if (profileError)
    return (
      <div>
        <p>Error: {profileError}</p>
      </div>
    );

  if (!profileData) return null;

  return (
    <div className="container-main-logged">
      <div className="title-h3">Perfil</div>
      <div className="title-h5">Nombre: {profileData.name}</div>
      <div className="title-h5">Email: {profileData.email}</div>
      <div className="title-h5">Teléfono: {profileData.phone}</div>
      <div className="title-h5">Usuario (apodo): {profileData.username}</div>
      <div className="title-h5">
        Usuario desde: {new Date(profileData.createdAt).toLocaleDateString()}
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
  profileData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
