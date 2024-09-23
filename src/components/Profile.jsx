import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Grid, Typography, Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import MainContainer from "./MainContainer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "success" });
    setProfile(null);
    navigate("/login");
  };

  if (!profile) return null;

  return (
    <MainContainer>
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
          <Button variant="contained" color="primary" disabled>
            Editar Perfil
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Cerrar sesión
          </Button>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

export default Profile;

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
