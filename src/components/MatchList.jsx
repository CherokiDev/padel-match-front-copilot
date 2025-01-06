import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import { enqueueSnackbar } from "notistack";

const MatchList = () => {
  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
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
      console.error("Error fetching profile:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fetchPlayers = useCallback(async () => {
    if (!profile) return;
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/players/same-schedule/${profile.id}`,
        { headers: { Authorization: token } }
      );
      setPlayers(response.data.players);
    } catch (error) {
      console.error("Error fetching players", error);
    }
  }, [profile]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers, profile]);

  const deleteSchedule = async (scheduleId) => {
    const playerId = profile?.id;
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
      fetchProfile();
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    } finally {
      setIsSending(false);
    }
  };

  if (!profile) return null;

  const handleOpen = (scheduleId) => {
    const availablePlayers = players.filter((player) =>
      player.schedules.some((schedule) => schedule.id === scheduleId)
    );
    setSelectedPlayers(availablePlayers);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!profile) return null;

  return (
    <div className="container-main-logged">
      <div className={open ? "inert" : undefined}>
        <div className="title-h3">Reservas Actuales</div>
        <div className="title-h4">Reservadas por mí</div>
        {profile.schedules
          .filter((schedule) => schedule.playerSchedules.payer)
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
                  players.filter((player) =>
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length === 0
                }
              >
                Jugadores disponibles:{" "}
                {
                  players.filter((player) =>
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length
                }
              </button>
              <button
                className="secondary-button"
                onClick={() => deleteSchedule(schedule.id)}
                disabled={isSending}
              >
                {isSending ? <div className="loading-spinner" /> : "Eliminar"}
              </button>
            </div>
          ))}
        <div className="hr-separator"></div>
        <div className="title-h4">Apuntado para jugar</div>
        {profile.schedules
          .filter((schedule) => !schedule.playerSchedules.payer)
          .map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="title-h5">
                Fecha:{" "}
                {moment(schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")}{" "}
                - Pista: {schedule.courtNumber}
              </div>
              <button
                className="secondary-button"
                onClick={() => deleteSchedule(schedule.id)}
                disabled={isSending}
              >
                {isSending ? <div className="loading-spinner" /> : "Eliminar"}
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
                {isSending ? <div className="loading-spinner" /> : "Cerrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchList;
