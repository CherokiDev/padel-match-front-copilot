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
  Modal,
  Backdrop,
} from "@mui/material";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";

const MatchList = ({ profile, deleteSchedule }) => {
  const [players, setPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);

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
  }, [fetchPlayers, profile.schedules]);

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
    <Box m={2} mb={15}>
      <Typography variant="h5" gutterBottom>
        Reservas Actuales
      </Typography>
      <Typography variant="h6" gutterBottom>
        Reservadas por mí
      </Typography>
      {profile.schedules
        .filter((schedule) => schedule.playerSchedules.payer)
        .map((schedule) => (
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
              Pista: {schedule.courtNumber}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpen(schedule.id)}
              disabled={
                !players.some((player) =>
                  player.schedules.some((s) => s.id === schedule.id)
                )
              }
              sx={{ mt: 1 }}
            >
              Jugadores disponibles:{" "}
              {
                players.filter((player) =>
                  player.schedules.some((s) => s.id === schedule.id)
                ).length
              }
            </Button>
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
      <Modal open={open} onClose={handleClose}>
        <Backdrop open={open} onClick={handleClose} inert="true">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ height: "100vh" }}
          >
            <Box
              bgcolor="secondary.main"
              color="secondary.contrastText"
              p={2}
              borderRadius={2}
              m={2} // Agrega margen en todos los lados
              maxWidth="90%" // Limita el ancho máximo del contenido
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mt: 2, mb: 3 }}
              >
                <Avatar>
                  <SportsTennisIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  Jugadores disponibles
                </Typography>
              </Stack>
              {selectedPlayers.map((player) => (
                <Card key={player.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {player.name} ({player.username})
                    </Typography>
                    <Typography variant="body1">
                      Teléfono: {player.phone}
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
              ))}
            </Box>
          </Box>
        </Backdrop>
      </Modal>
      <Typography variant="h6" gutterBottom>
        Apuntado para jugar
      </Typography>
      {profile.schedules
        .filter((schedule) => !schedule.playerSchedules.payer)
        .map((schedule) => (
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
              Pista: {schedule.courtNumber}
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
    </Box>
  );
};

MatchList.propTypes = {
  profile: PropTypes.object.isRequired,
  deleteSchedule: PropTypes.func.isRequired,
};

export default MatchList;
