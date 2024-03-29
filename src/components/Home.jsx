// src/components/Home.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar";
import useAuth from "../hooks/useAuth";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [payer, setPayer] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        navigate("/login");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/profile", {
          headers: {
            Authorization: token,
          },
        });
        setProfile(response.data.dataValues);
      } catch (error) {
        console.error("Error fetching profile", error);
        navigate("/login");
      }
    };

    if (!isLoading) fetchProfile();
  }, [navigate, isAuthenticated, isLoading]);

  const handleButtonClick = async (path, payerValue) => {
    try {
      const schedulesResponse = await axios.get(
        "http://localhost:3000/schedulesAvailables"
      );
      console.log(schedulesResponse.data.data);
      setSchedules(schedulesResponse.data.data);
      setPayer(payerValue);
      navigate(path);
    } catch (error) {
      console.error("Error handling button click", error);
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      const playerId = localStorage.getItem("id");
      console.log(playerId, selectedSchedule, payer);
      await axios.post(`http://localhost:3000/player/${playerId}/schedules`, {
        scheduleId: selectedSchedule,
        payer,
      });
    } catch (error) {
      console.error("Error submitting schedule", error);
    }
  };

  return (
    <div>
      <Navbar />
      <button onClick={() => handleButtonClick("/find-partners", true)}>
        Tengo pista, y busco compañeros
      </button>
      <button onClick={() => handleButtonClick("/join-game", false)}>
        No tengo pista, me apunto para jugar
      </button>
      {schedules.length > 0 && (
        <div>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
          >
            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.dateOfReservation} - Court {schedule.courtNumber}
              </option>
            ))}
          </select>
          <button onClick={handleScheduleSubmit}>Submit</button>
        </div>
      )}
      {profile && (
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
          {/* Renderiza el resto de los datos del perfil como desees */}
        </div>
      )}
    </div>
  );
};

export default Home;
