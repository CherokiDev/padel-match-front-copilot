import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import LoadingScreen from "./LoadingScreen";

const MatchList = () => {
  const dispatch = useDispatch();
  const {
    data: profileData,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);

  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch]);

  const fetchPlayers = useCallback(async () => {
    if (!profileData || !profileData.id) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/players/same-schedule/${
          profileData.id
        }`,
        { headers: { Authorization: token } }
      );
      setPlayers(response.data.players);
    } catch (error) {
      console.error("Error fetching players", error);
    }
  }, [profileData]);

  useEffect(() => {
    if (profileData) {
      fetchPlayers();
    }
  }, [fetchPlayers, profileData]);

  const deleteSchedule = async (scheduleId) => {
    const playerId = profileData?.id;
    const token = localStorage.getItem("token");
    setIsSending(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/players/${playerId}/schedules`,
        {
          data: { scheduleId },
          headers: { Authorization: token },
        }
      );
      dispatch(fetchProfile(token));
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setIsSending(false);
    }
  };

  if (profileStatus === "loading") return <LoadingScreen />;

  if (profileError)
    return (
      <div>
        <p>Error: {profileError}</p>
      </div>
    );

  if (!profileData) return null;

  const handleOpen = (scheduleId) => {
    const availablePlayers = players?.filter((player) =>
      player.schedules.some((schedule) => schedule.id === scheduleId)
    );
    setSelectedPlayers(availablePlayers);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isSending) {
    return <LoadingScreen />;
  }

  return (
    <>
      <div className={open ? "inert" : "container-main-logged"}>
        <div className="title-h3">Reservas Actuales</div>
        <hr className="hr-separator" />
        <div className="title-h4">Alquiladas por mí</div>
        {profileData.schedules
          ?.filter((schedule) => schedule.playerSchedules.payer)
          .map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="title-h5">
                Fecha:{" "}
                {moment(schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")}{" "}
                - Pista: {schedule.courtNumber}
              </div>
              <button
                className="primary-button"
                onClick={() => handleOpen(schedule.id)}
                disabled={
                  players?.filter((player) =>
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length === 0
                }
              >
                Jugadores disponibles:{" "}
                {
                  players?.filter((player) =>
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length
                }
              </button>
              <button
                className="delete-button"
                onClick={() => deleteSchedule(schedule.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        <hr className="hr-separator" />
        <div className="title-h4">Apuntado para jugar</div>
        {profileData.schedules
          ?.filter((schedule) => !schedule.playerSchedules.payer)
          .map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="title-h5">
                Fecha:{" "}
                {moment(schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")}{" "}
                - Pista: {schedule.courtNumber}
              </div>
              <button
                className="delete-button"
                onClick={() => deleteSchedule(schedule.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>
      {open && (
        <div className="modal">
          <div className="modal-content">
            <div className="title-h3">Jugadores disponibles</div>
            {selectedPlayers.map((player) => (
              <div key={player.id} className="card">
                <div className="title-h4">
                  {player.name} ({player.username})
                </div>
                <div className="title-h5">Teléfono: {player.phone}</div>
                <button
                  className="primary-button"
                  href={`https://wa.me/${player.phone}?text=Hola%20${player.username}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar whatsapp a {player.username}
                </button>
              </div>
            ))}
            <div className="modal-actions">
              <button onClick={handleClose} className="secondary-button">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MatchList;
