import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const MatchList = ({ profile, deleteSchedule }) => {
  const [players, setPlayers] = useState([]);

  const fetchPlayers = useCallback(async () => {
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
    <Box m={2}>
      <Typography variant="h5" gutterBottom>
        Reservas Actuales
      </Typography>
      {profile.schedules.map((schedule) => (
        <Box
          key={schedule.id}
          my={2}
          p={2}
          border={1}
          borderRadius={2}
          borderColor="divider"
        >
          <Typography variant="body1">
            Fecha:{" "}
            {moment(schedule.dateOfReservation).format("DD/MM/YYYY, HH:mm")} -
            Pista: {schedule.courtNumber} - Reservado por mí:{" "}
            {schedule.playerSchedules.payer ? "Sí" : "No"}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteSchedule(schedule.id)}
            sx={{ mt: 1 }}
          >
            Eliminar
          </Button>
        </Box>
      ))}
      <Typography variant="h5" gutterBottom>
        Jugadores en el mismo horario que yo tengo la pista reservada
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">WhatsApp</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Apodo</TableCell>
              <TableCell align="center">Tlf</TableCell>
              <TableCell align="center">Fecha</TableCell>
              <TableCell align="center">Pista</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) =>
              player.schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <a
                      href={`https://wa.me/${player.phone}?text=Hola%20${player.username},%20jugamos%20al%20padel?.`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="contained" color="primary">
                        Enviar whatsapp a {player.username}
                      </Button>
                    </a>
                  </TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.username}</TableCell>
                  <TableCell>{player.phone}</TableCell>
                  <TableCell>
                    {moment(schedule.dateOfReservation).format(
                      "DD/MM/YYYY, HH:mm"
                    )}
                  </TableCell>
                  <TableCell>{schedule.courtNumber}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

MatchList.propTypes = {
  profile: PropTypes.object.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default MatchList;
