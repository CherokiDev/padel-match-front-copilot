import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import MainContainer from "./MainContainer";
import { fetchSchedules } from "../redux/schedulesSlice";
import { fetchProfile } from "../redux/profileSlice";
import { useSnackbar } from "notistack";
import LoadingScreen from "./LoadingScreen";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Schedules.css";
import "./customCalendarStyles.css";

const localizer = momentLocalizer(moment);

const Schedules = () => {
  const location = useLocation();
  const { payer } = location.state;
  const dispatch = useDispatch();
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

    setIsSending(true);
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
      setOpenDialog(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Ocurrió un error al confirmar la reserva", {
          variant: "error",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  if (schedulesStatus === "loading" || profileStatus === "loading")
    return <LoadingScreen />;

  if (isSending) {
    return <LoadingScreen />;
  }

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

  const handleSelectEvent = (event) => {
    if (!event.disabled) {
      setSelectedSchedule(event);
      setOpenDialog(true);
    }
  };

  return (
    <div className="container-main-logged">
      {payer ? (
        <div className="title-h4">¿Cuándo la tienes alquilada?</div>
      ) : (
        <>
          <div className="title-h4">¿Cuándo quieres jugar?</div>
          <div className="title-h6">
            Se te avisará cuando alguien con la pista alquilada quiera ponerse
            en contacto contigo.
          </div>
        </>
      )}

      <div className="container-date-picker">
        <div className="date-picker-buttons">
          <button
            className="primary-button"
            onClick={() =>
              handleNavigate(moment(selectedDate).subtract(1, "days").toDate())
            }
          >
            {"<"}
          </button>
          <button
            className="primary-button"
            onClick={() =>
              handleNavigate(moment(selectedDate).add(1, "days").toDate())
            }
          >
            {">"}
          </button>
          <button
            className="primary-button"
            onClick={() => handleNavigate(new Date())}
          >
            Hoy
          </button>
        </div>
        <input
          className="date-picker"
          type="date"
          value={moment(selectedDate).format("YYYY-MM-DD")}
          onChange={handleDateChange}
        />
      </div>
      <div className="title-h5">
        {new Intl.DateTimeFormat("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
          .format(selectedDate)
          .replace(/ de /g, " ")}
      </div>

      <Calendar
        views={["day"]}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        defaultView="day"
        date={selectedDate}
        onNavigate={handleNavigate}
        min={new Date(1970, 1, 1, 8, 0, 0)} // 8:00 AM
        max={new Date(1970, 1, 1, 22, 0, 0)} // 10:00 PM
        className="custom-calendar"
      />
      {openDialog && (
        <div className="modal">
          <div className="modal-content">
            <div className="title-h4">Horario Seleccionado</div>
            <div className="title-h5">
              <div>Pista: {selectedSchedule?.courtNumber}</div>
              <div>
                Fecha:{" "}
                {`${new Date(selectedSchedule?.start).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )} a las ${new Date(selectedSchedule?.start).toLocaleTimeString(
                  undefined,
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}`}
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setOpenDialog(false)}
              >
                Cancelar
              </button>
              <button className="primary-button" onClick={handleSendToBackend}>
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedules;
