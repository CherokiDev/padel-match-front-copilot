import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Box, Typography, Button } from "@mui/material";

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

  if (!profile) return null;

  return (
    <Box sx={{ m: 2 }}>
      <Typography variant="h2" gutterBottom>
        Perfil
      </Typography>
      <Typography variant="h4" gutterBottom>
        {profile.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {profile.email}
      </Typography>
      <Button variant="contained" color="primary">
        Editar Perfil
      </Button>
    </Box>
  );
};

export default Profile;

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
