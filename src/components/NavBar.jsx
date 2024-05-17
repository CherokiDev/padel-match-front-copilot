import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/players`,
          {
            withCredentials: true,
          }
        );
        setPlayers(response.data.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    const role = localStorage.getItem("role");
    if (role === "admin") {
      fetchPlayers();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav>
      <button onClick={handleLogout}>Logout</button>
      <br />
      esto es del Navbar
      <br />
      {players.map((player) => (
        <div key={player.id}>
          <p>{player.email}</p>
        </div>
      ))}
    </nav>
  );
};

export default Navbar;
