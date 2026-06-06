import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import LoadingScreen from "./LoadingScreen";
import ChatModal from "./ChatModal";

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
  const [activeScheduleId, setActiveScheduleId] = useState(null);
  const [activeScheduleIds, setActiveScheduleIds] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPeer, setChatPeer] = useState(null);
  const [admittedScheduleIds, setAdmittedScheduleIds] = useState([]);

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

  useEffect(() => {
    if (!profileData) return;
    const token = localStorage.getItem("token");
    axios
      .get(`${import.meta.env.VITE_API_URL}/messages/admitted-schedules`, {
        headers: { Authorization: token },
      })
      .then(({ data }) => setAdmittedScheduleIds(data.data))
      .catch(() => {});
  }, [profileData]);

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

  const deleteScheduleGroup = async (scheduleIds) => {
    const playerId = profileData?.id;
    const token = localStorage.getItem("token");
    setIsSending(true);
    try {
      await Promise.all(
        scheduleIds.map((sid) =>
          axios
            .delete(`${import.meta.env.VITE_API_URL}/players/${playerId}/schedules`, {
              data: { scheduleId: sid },
              headers: { Authorization: token },
            })
            .catch(() => {})
        )
      );
      dispatch(fetchProfile(token));
      enqueueSnackbar("Horario eliminado correctamente", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error al eliminar el horario", { variant: "error" });
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

  const handleOpen = (scheduleId, allIds = null) => {
    const ids = allIds || [scheduleId];
    const availablePlayers = players?.filter(
      (player) =>
        player.id !== profileData.id &&
        player.schedules.some((schedule) => ids.includes(schedule.id))
    );
    setSelectedPlayers(availablePlayers);
    setActiveScheduleId(scheduleId);
    setActiveScheduleIds(ids);
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
                    player.id !== profileData.id &&
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length === 0
                }
              >
                Ver jugadores (
                {
                  players?.filter((player) =>
                    player.id !== profileData.id &&
                    player.schedules.some((s) => s.id === schedule.id)
                  ).length
                }
                )
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
        {(() => {
          const nonPayerSchedules =
            profileData.schedules?.filter((s) => !s.playerSchedules.payer) || [];
          const byTime = {};
          nonPayerSchedules.forEach((s) => {
            const key = s.dateOfReservation;
            if (!byTime[key]) byTime[key] = [];
            byTime[key].push(s);
          });
          return Object.entries(byTime).map(([time, schedules]) => {
            const ids = schedules.map((s) => s.id);
            const admittedId = ids.find((id) => admittedScheduleIds.includes(id));
            const isAdmitted = !!admittedId;
            const playersInGroup =
              players?.filter(
                (player) =>
                  player.id !== profileData.id &&
                  player.schedules.some((s) => ids.includes(s.id))
              ) || [];
            return (
              <div key={time} className="card">
                <div className="title-h5">
                  Fecha: {moment(time).format("DD/MM/YYYY, HH:mm")}
                </div>
                <button
                  className="secondary-button"
                  onClick={() => handleOpen(admittedId || ids[0], ids)}
                  disabled={!isAdmitted}
                >
                  {isAdmitted
                    ? `Ver jugadores (${playersInGroup.length})`
                    : "Pendiente de admisión"}
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteScheduleGroup(ids)}
                >
                  Eliminar
                </button>
              </div>
            );
          });
        })()}
      </div>
      {open && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-sheet-header">
              <span className="title-h3" style={{ margin: 0 }}>Jugadores disponibles</span>
              <button className="modal-close-btn" onClick={handleClose}>✕</button>
            </div>
            {selectedPlayers
              .filter((player) => {
                const mySchedule = profileData.schedules.find(
                  (s) => s.id === activeScheduleId
                );
                if (mySchedule?.playerSchedules?.payer) return true;
                return player.schedules.some(
                  (s) => activeScheduleIds.includes(s.id) && s.playerSchedules?.payer
                );
              })
              .map((player) => (
                <div key={player.id} className="card">
                  <div className="title-h4">
                    {player.name} ({player.username})
                  </div>
                  <div className="title-h5">Teléfono: {player.phone}</div>
                  {false && profileData.schedules.some(
                    (s) =>
                      s.playerSchedules.payer &&
                      player.schedules.some((ps) => ps.id === s.id)
                  ) && (
                    <button
                      className="primary-button"
                      href={`https://wa.me/${player.phone}?text=Hola%20${player.username}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Enviar whatsapp a {player.username}
                    </button>
                  )}
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setChatPeer(player);
                      setChatOpen(true);
                    }}
                  >
                    Chatear con {player.username}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        peer={chatPeer || {}}
        scheduleId={activeScheduleId}
        scheduleInfo={profileData.schedules.find((s) => s.id === activeScheduleId) || null}
      />
    </>
  );
};

export default MatchList;
