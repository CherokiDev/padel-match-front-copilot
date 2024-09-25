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
          <Typography variant="h5" gutterBottom>
            Perfil
          </Typography>
          <Typography variant="body2" gutterBottom>
            Nombre: {profile.name}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Email: {profile.email}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Teléfono: {profile.phone}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Usuario (apodo): {profile.username}
          </Typography>
          <Typography variant="body2" gutterBottom>
            Usuario desde: {new Date(profile.createdAt).toLocaleDateString()}
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
