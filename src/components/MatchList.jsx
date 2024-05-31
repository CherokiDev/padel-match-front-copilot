import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";

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
    <Box m={2} mb={15}>
      {/* <Box
        bgcolor="primary.light" // Use a lighter color
        color="primary.contrastText"
        p={2}
        borderRadius={2}
      > */}
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
      {/* </Box> */}
      <Divider variant="middle" sx={{ my: 3 }} />
      <Box
        bgcolor="secondary.main"
        color="secondary.contrastText"
        p={2}
        borderRadius={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ mt: 2, mb: 3 }}
        >
          {" "}
          {/* Add margin-bottom here */}
          <Avatar>
            <SportsTennisIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            Jugadores disponibles
          </Typography>
        </Stack>
        {players.map((player) =>
          player.schedules.map((schedule) => (
            <Card key={schedule.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {player.name} ({player.username})
                </Typography>
                <Typography variant="body1">
                  Teléfono: {player.phone}
                </Typography>
                <Typography variant="body1">
                  Fecha:{" "}
                  {moment(schedule.dateOfReservation).format(
                    "DD/MM/YYYY, HH:mm"
                  )}
                </Typography>
                <Typography variant="body1">
                  Pista: {schedule.courtNumber}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1 }}
                  href={`https://wa.me/${player.phone}?text=Hola%20${player.username},%20jugamos%20al%20padel?.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar whatsapp a {player.username}
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );
};

MatchList.propTypes = {
  profile: PropTypes.object.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default MatchList;
