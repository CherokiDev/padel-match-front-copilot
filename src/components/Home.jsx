// src/components/Home.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";
import HaveCourtButton from "./HaveCourtButton";
import DoesNotHaveCourtButton from "./DoesNotHaveCourtButton";
import { enqueueSnackbar } from "notistack";
import MatchList from "./MatchList";
import { Box, Button, Grid, Typography } from "@mui/material";

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [payer, setPayer] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const fetchSchedules = useCallback(async () => {
    try {
      const schedulesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedulesAvailables`
      );
      setSchedules(schedulesResponse.data.data);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login");
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
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isLoading) fetchProfile();
  }, [navigate, isAuthenticated, isLoading, fetchProfile]);

  const handleDateChange = (date) => {
    // Crea una nueva fecha con la hora establecida al mediodía
    const dateWithNoonTime = new Date(date.setHours(12, 0, 0, 0));

    setSelectedDate(dateWithNoonTime);
  };

  const getSchedulesForSelectedDate = () => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];

    return schedules.filter((schedule) => {
      const scheduleDateString = new Date(schedule.dateOfReservation)
        .toISOString()
        .split("T")[0];
      return scheduleDateString === selectedDateString;
    });
  };

  const schedulesForSelectedDate = getSchedulesForSelectedDate();

  const handleBackClick = () => {
    setShowButtons(true);
  };

  const handleScheduleSelect = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const playerId = localStorage.getItem("id");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/player/${playerId}/schedules`,
        {
          scheduleId: selectedSchedule.id,
          payer,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setProfile(response.data.data);
      setSelectedSchedule(null);
      const schedulesEndpoint = payer ? "/schedulesAvailables" : "/schedules";
      const schedulesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}${schedulesEndpoint}`
      );
      setSchedules(schedulesResponse.data.data);
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  const deleteSchedule = async (scheduleId) => {
    const token = localStorage.getItem("token");
    const playerId = localStorage.getItem("id");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/player/${playerId}/schedules`,
        {
          data: { scheduleId },
          headers: { Authorization: token },
        }
      );
      fetchProfile();
      fetchSchedules();
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      {showButtons ? (
        <Box m={2}>
          <Grid
            container
            spacing={3}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <HaveCourtButton
                setSchedules={setSchedules}
                setPayer={setPayer}
                setShowButtons={setShowButtons}
                fetchSchedules={fetchSchedules}
                style={{ width: "300px", height: "100px" }} // Cambia minWidth a width
              />
            </Grid>
            <Grid item xs={12}>
              <DoesNotHaveCourtButton
                setSchedules={setSchedules}
                setPayer={setPayer}
                setShowButtons={setShowButtons}
                style={{ width: "300px", height: "100px" }} // Cambia minWidth a width
              />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box m={2}>
          <Button variant="contained" color="primary" onClick={handleBackClick}>
            Volver
          </Button>
          {payer && (
            <Typography variant="h6">
              Qué día tienes la pista alquilada
            </Typography>
          )}
          {!payer && <Typography variant="h6">Cúando quieres jugar</Typography>}

          <Box display="flex" justifyContent="center" m={1} p={1}>
            <Calendar onChange={handleDateChange} value={selectedDate} />
          </Box>

          {schedulesForSelectedDate.length > 0 && (
            <Box mt={2}>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={6}>
                  {schedulesForSelectedDate
                    .filter((schedule) => schedule.courtNumber === 1)
                    .map((schedule) => (
                      <Button
                        key={schedule.id}
                        variant="contained"
                        color={
                          selectedSchedule &&
                          selectedSchedule.id === schedule.id
                            ? "primary"
                            : "secondary"
                        }
                        fullWidth
                        onClick={() => handleScheduleSelect(schedule)}
                        style={{ marginBottom: "10px" }}
                      >
                        {new Date(
                          schedule.dateOfReservation
                        ).toLocaleTimeString()}{" "}
                        - Pista {schedule.courtNumber}
                      </Button>
                    ))}
                </Grid>
                <Grid item xs={6}>
                  {schedulesForSelectedDate
                    .filter((schedule) => schedule.courtNumber === 2)
                    .map((schedule) => (
                      <Button
                        key={schedule.id}
                        variant="contained"
                        color={
                          selectedSchedule &&
                          selectedSchedule.id === schedule.id
                            ? "primary"
                            : "secondary"
                        }
                        fullWidth
                        onClick={() => handleScheduleSelect(schedule)}
                        style={{ marginBottom: "10px" }}
                      >
                        {new Date(
                          schedule.dateOfReservation
                        ).toLocaleTimeString()}{" "}
                        - Pista {schedule.courtNumber}
                      </Button>
                    ))}
                </Grid>
              </Grid>
            </Box>
          )}
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={!selectedSchedule}
            >
              Apuntarme
            </Button>
          </Box>
        </Box>
      )}

      {selectedSchedule && (
        <Box m={2}>
          Selected Schedule:{" "}
          {moment(selectedSchedule.dateOfReservation).format(
            "DD/MM/YYYY, HH:mm"
          )}{" "}
          - Pista {selectedSchedule.courtNumber}
        </Box>
      )}
      {profile && (
        <Box m={2}>
          <MatchList profile={profile} deleteSchedule={deleteSchedule} />
        </Box>
      )}
    </div>
  );
};

export default Home;
