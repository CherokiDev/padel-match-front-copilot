import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import "./BottomNavBar.css";
import LoadingScreen from "./LoadingScreen";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (location.pathname === "/home") setValue(0);
    else if (location.pathname === "/matchlist") setValue(1);
    else if (location.pathname === "/profile") setValue(2);
  }, [location.pathname]);

  const handleNavigation = (newValue) => {
    setIsSending(true);
    setValue(newValue);
    if (newValue === 0) navigate("/home");
    if (newValue === 1) navigate("/matchlist");
    if (newValue === 2) navigate("/profile");
    setIsSending(false);
  };

  if (isSending) {
    return <LoadingScreen />;
  }

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => handleNavigation(newValue)}
      showLabels
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        backgroundColor: "#3E4953FF",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
      <BottomNavigationAction label="Partidos" icon={<SportsTennisIcon />} />
      <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
    </BottomNavigation>
  );
};

export default BottomNavBar;
