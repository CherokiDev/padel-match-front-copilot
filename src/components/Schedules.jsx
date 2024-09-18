import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import MainContainer from "./MainContainer";
import { fetchSchedules } from "../redux/schedulesSlice";
import { fetchProfile } from "../redux/profileSlice";
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Container,
} from "@mui/material";
import { useSnackbar } from "notistack";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./customCalendarStyles.css"; // Importa el archivo CSS personalizado

const localizer = momentLocalizer(moment);

const Schedules = () => {
  const location = useLocation();
  const { payer } = location.state;
  const dispatch = useDispatch();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: schedulesResponse,
    status: schedulesStatus,
    error: schedulesError,
  } = useSelector((state) => state.schedules);

  const {
    data: profileData,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchSchedules(token));
      dispatch(fetchProfile(token));
    }
  }, [dispatch]);

  const handleSendToBackend = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected");
      return;
    }

    const playerId = profileData?.id;
    if (!playerId) {
      console.error("Player ID is undefined");
      return;
    }

    const url = `${import.meta.env.VITE_API_URL}/players/${playerId}/schedules`;

    const body = {
      scheduleId: selectedSchedule.id,
      payer,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      dispatch(fetchSchedules(token));
      dispatch(fetchProfile(token));

      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      if (error.response && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Ocurrió un error al confirmar la reserva", {
          variant: "error",
        });
      }
    }
  };

  if (schedulesStatus === "loading" || profileStatus === "loading")
    return <MainContainer>Loading...</MainContainer>;
  if (schedulesError || profileError)
    return (
      <MainContainer>Error: {schedulesError || profileError}</MainContainer>
    );

  const schedulesData = schedulesResponse?.data || [];
  const userSchedules = profileData?.schedules || [];

  const events = schedulesData.map((schedule) => {
    const start = new Date(schedule.dateOfReservation);
    const end = moment(start).add(1, "hours").add(30, "minutes").toDate();
    const isReservedByUser = userSchedules.some(
      (userSchedule) => userSchedule.id === schedule.id
    );
    return {
      id: schedule.id,
      title: `Pista ${schedule.courtNumber}`,
      start,
      end,
      courtNumber: schedule.courtNumber,
      disabled: isReservedByUser,
    };
  });

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: event.disabled
        ? "#d3d3d3"
        : event.id === selectedSchedule?.id
        ? "#DDD165FF"
        : "#3174ad",
      pointerEvents: event.disabled ? "none" : "auto",
    };
    return {
      style,
    };
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
    closeModal();
  };

  const handleNavigate = (date) => {
    setSelectedDate(date);
  };

  return (
    <MainContainer>
      <h1>{payer ? "Con la pista alquilada" : "Sin la pista alquilada"}</h1>
      <p>
        {payer
          ? "Contenido para cuando el usuario tiene la pista alquilada"
          : "Contenido para cuando el usuario no tiene la pista alquilada"}
      </p>
      <h2>Schedules</h2>
      <Button variant="contained" color="primary" onClick={openModal}>
        Select Date
      </Button>
      <Modal open={modalIsOpen} onClose={closeModal}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "110px",
            marginBottom: "60px",
            minHeight: "calc(100vh - 170px)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              // width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Select a Date
            </Typography>
            <TextField
              type="date"
              fullWidth
              onChange={handleDateChange}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={closeModal}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </div>
      </Modal>
      <Calendar
        views={["day"]}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => !event.disabled && setSelectedSchedule(event)}
        eventPropGetter={eventStyleGetter}
        defaultView="day"
        date={selectedDate}
        onNavigate={handleNavigate}
        min={new Date(1970, 1, 1, 8, 0, 0)} // 8:00 AM
        max={new Date(1970, 1, 1, 22, 0, 0)} // 10:00 PM
      />
      {selectedSchedule && (
        <Container>
          <Typography variant="h6">Selected Schedule</Typography>
          <Typography>Court Number: {selectedSchedule.courtNumber}</Typography>
          <Typography>
            Date of Reservation:{" "}
            {new Date(selectedSchedule.start).toLocaleString()}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendToBackend}
          >
            Confirmar Reserva
          </Button>
        </Container>
      )}
    </MainContainer>
  );
};

export default Schedules;
