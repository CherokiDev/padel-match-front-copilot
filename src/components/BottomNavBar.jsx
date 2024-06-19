import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const BottomNavBar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <BottomNavigation
      position="fixed"
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        if (newValue === 0) navigate("/home");
        if (newValue === 1) navigate("/profile");
        if (newValue === 2) handleLogout();
      }}
      showLabels
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#f0f0f0",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
      <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
      <BottomNavigationAction label="Cerrar sesión" icon={<ExitToAppIcon />} />
    </BottomNavigation>
  );
};

export default BottomNavBar;
