import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import MainContainer from "./MainContainer";
import { fetchSchedules } from "../redux/schedulesSlice";
import { fetchProfile } from "../redux/profileSlice";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Schedules = () => {
  const location = useLocation();
  const { payer } = location.state;
  const dispatch = useDispatch();
  const [selectedSchedule, setSelectedSchedule] = useState(null);

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

      console.log("Respuesta del backend:", response.data);
    } catch (error) {
      console.error("Error:", error);
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
    const isPayer = userSchedules.some(
      (userSchedule) =>
        userSchedule.id === schedule.id && userSchedule.playerSchedules.payer
    );
    return {
      id: schedule.id,
      title: `Pista ${schedule.courtNumber}`,
      start,
      end,
      courtNumber: schedule.courtNumber,
      disabled: isPayer,
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

  return (
    <MainContainer>
      <h1>{payer ? "Con la pista alquilada" : "Sin la pista alquilada"}</h1>
      <p>
        {payer
          ? "Contenido para cuando el usuario tiene la pista alquilada"
          : "Contenido para cuando el usuario no tiene la pista alquilada"}
      </p>
      <h2>Schedules</h2>
      <Calendar
        views={["month", "day"]}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => !event.disabled && setSelectedSchedule(event)}
        eventPropGetter={eventStyleGetter}
      />
      {selectedSchedule && (
        <div>
          <h3>Selected Schedule</h3>
          <p>Court Number: {selectedSchedule.courtNumber}</p>
          <p>
            Date of Reservation:{" "}
            {new Date(selectedSchedule.start).toLocaleString()}
          </p>
          <button onClick={handleSendToBackend}>Confirmar Reserva</button>
        </div>
      )}
    </MainContainer>
  );
};

export default Schedules;
