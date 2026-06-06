import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/profileSlice";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import LoadingScreen from "./LoadingScreen";
import "./Profile.css";

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
    if (token) dispatch(fetchProfile(token));
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "success" });
    navigate("/login");
  };

  if (profileStatus === "loading" || !profileData?.id) return <LoadingScreen />;
  if (profileError) return <div><p>Error: {profileError}</p></div>;

  const initials = profileData.name
    ? profileData.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="profile-wrapper">
      <div className="profile-avatar">{initials}</div>
      <div className="profile-name">{profileData.name}</div>
      <div className="profile-username">@{profileData.username}</div>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-row-icon"><EmailOutlinedIcon fontSize="small" /></span>
          <div className="profile-row-content">
            <span className="profile-row-label">Email</span>
            <span className="profile-row-value">{profileData.email}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row-icon"><PhoneOutlinedIcon fontSize="small" /></span>
          <div className="profile-row-content">
            <span className="profile-row-label">Teléfono</span>
            <span className="profile-row-value">{profileData.phone}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row-icon"><BadgeOutlinedIcon fontSize="small" /></span>
          <div className="profile-row-content">
            <span className="profile-row-label">Nombre de usuario</span>
            <span className="profile-row-value">@{profileData.username}</span>
          </div>
        </div>
        <div className="profile-row">
          <span className="profile-row-icon"><CalendarTodayOutlinedIcon fontSize="small" /></span>
          <div className="profile-row-content">
            <span className="profile-row-label">Miembro desde</span>
            <span className="profile-row-value">
              {new Date(profileData.createdAt).toLocaleDateString("es-ES", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-btn-edit" disabled>
          Editar perfil
        </button>
        <button className="profile-btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Profile;
