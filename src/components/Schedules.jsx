import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import MainContainer from "./MainContainer";
import { fetchSchedules } from "../redux/schedulesSlice";
import { fetchProfile } from "../redux/profileSlice";
import { Button, Typography, TextField, Container, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSnackbar } from "notistack";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./customCalendarStyles.css";

const localizer = momentLocalizer(moment);

const Schedules = () => {
  const location = useLocation();
  const { payer } = location.state;
  const dispatch = useDispatch();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
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

  const handleDateChange = (event) => {
    setSelectedDate(new Date(event.target.value));
  };

  const handleNavigate = (date) => {
    setSelectedDate(date);
  };

  return (
    <MainContainer>
      <Typography variant="h5">Elegir Pista</Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2, mt: 2 }}>
        <Button
          onClick={() =>
            handleNavigate(moment(selectedDate).subtract(1, "days").toDate())
          }
        >
          <ArrowBackIcon />
        </Button>
        <Button
          onClick={() =>
            handleNavigate(moment(selectedDate).add(1, "days").toDate())
          }
        >
          <ArrowForwardIcon />
        </Button>
        <Button onClick={() => handleNavigate(new Date())}>Hoy</Button>
        <TextField
          type="date"
          value={moment(selectedDate).format("YYYY-MM-DD")}
          onChange={handleDateChange}
          sx={{ mr: 2 }}
        />
      </Box>
      <Typography variant="h6" sx={{ ml: 2 }}>
        {new Intl.DateTimeFormat("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
          .format(selectedDate)
          .replace(/ de /g, " ")}
      </Typography>

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
        className="custom-calendar"
      />
      {selectedSchedule && (
        <Container>
          <Typography variant="h6">Horario Seleccionado</Typography>
          <Typography>
            Número de Pista: {selectedSchedule.courtNumber}
          </Typography>
          <Typography>
            Fecha de Reserva:{" "}
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
