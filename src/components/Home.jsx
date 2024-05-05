// src/components/Home.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar";
import useAuth from "../hooks/useAuth";
import Profile from "./Profile";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [payer, setPayer] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const fetchProfile = useCallback(async () => {
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
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading) fetchProfile();
  }, [navigate, isAuthenticated, isLoading, fetchProfile]);

  const buttonHaveCourt = async (payerValue) => {
    try {
      const schedulesResponse = await axios.get(
        "http://localhost:3000/schedulesAvailables"
      );

      setSchedules(schedulesResponse.data.data);
      setPayer(payerValue);
      console.log(payerValue);
    } catch (error) {
      console.error("Error handling button click", error);
    }
  };

  const buttonDoesNotHaveCourt = async (payerValue) => {
    try {
      const schedulesResponse = await axios.get(
        "http://localhost:3000/schedules"
      );

      setSchedules(schedulesResponse.data.data);
      setPayer(payerValue);
      console.log(payerValue);
    } catch (error) {
      console.error("Error handling button click", error);
    }
  };

  const handleScheduleSubmit = async () => {
    try {
      const playerId = localStorage.getItem("id");
      const response = await axios.post(
        `http://localhost:3000/player/${playerId}/schedules`,
        {
          scheduleId: selectedSchedule,
          payer,
        }
      );

      // Update the profile with the response from the POST request
      setProfile(response.data.data);

      // Reload schedules after submitting
      if (payer) {
        buttonHaveCourt(true);
      } else {
        buttonDoesNotHaveCourt(false);
      }
    } catch (error) {
      console.error("Error submitting schedule", error);
    }
  };

  const handleBackClick = () => {
    setShowButtons(true);
  };

  return (
    <div>
      <Navbar />
      {showButtons ? (
        <>
          <button
            onClick={() => {
              buttonHaveCourt(true);
              setShowButtons(false);
            }}
          >
            Tengo pista, y busco compañeros
          </button>
          <button
            onClick={() => {
              buttonDoesNotHaveCourt(false);
              setShowButtons(false);
            }}
          >
            No tengo pista, me apunto para jugar
          </button>
        </>
      ) : (
        <>
          <button onClick={handleBackClick}>Volver</button>
          {schedules.length > 0 && (
            <div>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
              >
                <option value="" disabled>
                  Seleccionar...
                </option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.dateOfReservation} - Court {schedule.courtNumber}
                  </option>
                ))}
              </select>
              <button onClick={handleScheduleSubmit}>Submit</button>
            </div>
          )}
        </>
      )}

      {profile && <Profile profile={profile} />}
    </div>
  );
};

export default Home;
