// src/components/HaveCourtButton.jsx
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const HaveCourtButton = ({
  setSchedules,
  setPayer,
  setShowButtons,
  fetchSchedules,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const schedulesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedulesAvailables`
      );

      setSchedules(schedulesResponse.data.data);
      setPayer(true);
      setShowButtons(false);
      fetchSchedules();
    } catch (error) {
      console.error("Error handling button click", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      disabled={isLoading}
      style={style}
    >
      Tengo pista.
      <br /> Busco jugadores
    </Button>
  );
};

export default HaveCourtButton;

HaveCourtButton.propTypes = {
  setSchedules: PropTypes.func.isRequired,
  setPayer: PropTypes.func.isRequired,
  setShowButtons: PropTypes.func.isRequired,
  fetchSchedules: PropTypes.func.isRequired,
  style: PropTypes.object,
};
