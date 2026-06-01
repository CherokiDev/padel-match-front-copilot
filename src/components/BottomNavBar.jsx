import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction, Badge } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import ChatIcon from "@mui/icons-material/Chat";
import axios from "axios";
import { connectSocket } from "../services/socket";
import "./BottomNavBar.css";
import LoadingScreen from "./LoadingScreen";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchUnread = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/messages/conversations`,
        { headers: { Authorization: token } }
      );
      const count = data.data.reduce((sum, c) => sum + c.unreadCount, 0);
      setTotalUnread(count);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    fetchUnread();
    const socket = connectSocket();
    socket.on("message:new", fetchUnread);
    window.addEventListener("messages:read", fetchUnread);
    return () => {
      socket.disconnect();
      window.removeEventListener("messages:read", fetchUnread);
    };
  }, [fetchUnread]);

  // Reset badge when user navigates to chats
  useEffect(() => {
    if (location.pathname === "/chats") setTotalUnread(0);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/home") setValue(0);
    else if (location.pathname === "/matchlist") setValue(1);
    else if (location.pathname === "/chats") setValue(2);
    else if (location.pathname === "/profile") setValue(3);
  }, [location.pathname]);

  const handleNavigation = (newValue) => {
    setIsSending(true);
    setValue(newValue);
    if (newValue === 0) navigate("/home");
    if (newValue === 1) navigate("/matchlist");
    if (newValue === 2) navigate("/chats");
    if (newValue === 3) navigate("/profile");
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
      <BottomNavigationAction
        label="Chats"
        icon={
          <Badge badgeContent={totalUnread} color="error" max={99}>
            <ChatIcon />
          </Badge>
        }
      />
      <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
    </BottomNavigation>
  );
};

export default BottomNavBar;
