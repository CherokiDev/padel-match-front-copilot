import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";

const Profile = ({ profile, deleteSchedule }) => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:3000/players/same-schedule/${profile.id}`,
        { headers: { Authorization: token } }
      );
      setPlayers(response.data.players);
    } catch (error) {
      console.error("Error fetching players", error);
    }
  }, [profile.id]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Add this useEffect to update players when profile.schedules changes
  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers, profile.schedules]);

  if (!profile) return null;

  return (
    <div>
      <div>-------------Esto ya es de Profile----------------</div>
      <h2>Profile</h2>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <ul>
        {profile.schedules.map((schedule) => (
          <li key={schedule.id}>
            {moment(schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")} -
            Pista {schedule.courtNumber} - La he alquilado yo:{" "}
            {schedule.playerSchedules.payer ? "Si" : "No"}
            <button onClick={() => deleteSchedule(schedule.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <h2>Jugadores en el mismo horario que yo tengo la pista reservada</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Apodo</th>
            <th>Phone</th>
            <th>Date of Reservation</th>
            <th>Court Number</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) =>
            player.schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{player.name}</td>
                <td>{player.email}</td>
                <td>{player.username}</td>
                <td>{player.phone}</td>
                <td>
                  {moment(schedule.dateOfReservation).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </td>
                <td>{schedule.courtNumber}</td>
                <td>
                  <a
                    href={`https://wa.me/${player.phone}?text=Hola%20${player.username},%20jugamos%20al%20padel?.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button>Enviar whatsapp a {player.username}</button>
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default Profile;
