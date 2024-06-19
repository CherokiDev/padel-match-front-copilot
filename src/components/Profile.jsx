import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Grid, Typography, Button } from "@mui/material";
import MatchList from "./MatchList";
import { enqueueSnackbar } from "notistack";

const Profile = () => {
  const [profile, setProfile] = useState(null);
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

  const deleteSchedule = async (scheduleId) => {
    const token = localStorage.getItem("token");
    const playerId = localStorage.getItem("id");
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/player/${playerId}/schedules`,
        {
          data: { scheduleId },
          headers: { Authorization: token },
        }
      );
      fetchProfile();
      enqueueSnackbar(response.data.message, { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  if (!profile) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "60px",
        marginBottom: "60px",
        minHeight: "calc(100vh - 120px)",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Perfil
          </Typography>
          <Typography variant="h4" gutterBottom>
            {profile.name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{ wordWrap: "break-word" }}
          >
            {profile.email}
          </Typography>
          <Button disabled variant="contained" color="primary">
            Editar Perfil
          </Button>
          {profile && (
            <Grid item xs={12}>
              <MatchList profile={profile} deleteSchedule={deleteSchedule} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
