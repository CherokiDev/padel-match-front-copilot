import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import { enqueueSnackbar } from "notistack";
import MainContainer from "./MainContainer";

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
    <MainContainer>
      <Grid container>
        <div inert={open ? "true" : undefined}>
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
                  {moment(schedule.dateOfReservation).format(
                    "DD/MM/YYYY, HH:mm"
                  )}{" "}
                  - Pista: {schedule.courtNumber}
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
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={200}
                  >
                    Jugadores disponibles:{" "}
                    {
                      players.filter((player) =>
                        player.schedules.some((s) => s.id === schedule.id)
                      ).length
                    }
                  </Box>
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSchedule(schedule.id)}
                  sx={{ mt: 1 }}
                  disabled={isSending}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={100}
                  >
                    {isSending ? <CircularProgress size={24} /> : "Eliminar"}
                  </Box>
                </Button>
              </Box>
            ))}
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
                  {moment(schedule.dateOfReservation).format(
                    "DD/MM/YYYY, HH:mm"
                  )}{" "}
                  - Pista: {schedule.courtNumber}
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => deleteSchedule(schedule.id)}
                  sx={{ mt: 1 }}
                  disabled={isSending}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width={100}
                  >
                    {isSending ? <CircularProgress size={24} /> : "Eliminar"}
                  </Box>
                </Button>
              </Box>
            ))}
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Jugadores disponibles</DialogTitle>
          <DialogContent>
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
                    href={`https://wa.me/${player.phone}?text=Hola%20${player.username}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enviar whatsapp a {player.username}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isSending}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={100}
              >
                {isSending ? <CircularProgress size={24} /> : "Cerrar"}
              </Box>
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </MainContainer>
  );
};

export default MatchList;
