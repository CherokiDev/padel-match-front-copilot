import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

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
    <>
      <div>
        <h2>Profile</h2>
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
      </div>
    </>
  );
};

export default Profile;

Profile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
};
