// src/components/Home.js
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import moment from "moment";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Home.css";
import HaveCourtButton from "./HaveCourtButton";
import DoesNotHaveCourtButton from "./DoesNotHaveCourtButton";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";

const Home = () => {
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
      await axios.get(`${import.meta.env.VITE_API_URL}/players/profile`, {
        headers: {
          Authorization: token,
        },
      });
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
        `${import.meta.env.VITE_API_URL}/players/${playerId}/schedules`,
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "60px",
        marginBottom: "60px",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      {showButtons ? (
        <Grid
          container
          direction="row"
          justify="center"
          style={{ height: "400px" }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HaveCourtButton
              setSchedules={setSchedules}
              setPayer={setPayer}
              setShowButtons={setShowButtons}
              fetchSchedules={fetchSchedules}
              style={{ width: "70%", height: "60%" }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DoesNotHaveCourtButton
              setSchedules={setSchedules}
              setPayer={setPayer}
              setShowButtons={setShowButtons}
              style={{ width: "70%", height: "60%" }}
            />
          </Grid>
        </Grid>
      ) : (
        <Box m={2}>
          {payer && (
            <Typography variant="h6">
              ¿Cuándo tienes la pista alquilada?
            </Typography>
          )}
          {!payer && (
            <Typography variant="h6">¿Cúando quieres jugar?</Typography>
          )}
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
          <Divider style={{ width: "100%", margin: "10px 0" }} />{" "}
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selectedSchedule}
              style={{
                flex: 1,
                height: "50px",
                backgroundColor: !selectedSchedule ? "#9E9E9E" : "#4CAF50", // Gris cuando está deshabilitado
                color: "white",
              }}
            >
              Apuntarme
            </Button>
            <Button
              variant="contained"
              onClick={handleBackClick}
              style={{
                flex: 1,
                height: "50px",
                backgroundColor: "#AF6666",
                color: "white",
              }} // Gris
            >
              Volver
            </Button>
          </Box>
        </Box>
      )}

      {/* {selectedSchedule && (
        <Box m={2}>
          Selected Schedule:{" "}
          {moment(selectedSchedule.dateOfReservation).format(
            "DD/MM/YYYY, HH:mm"
          )}{" "}
          - Pista {selectedSchedule.courtNumber}
        </Box>
      )} */}
    </div>
  );
};

export default Home;
