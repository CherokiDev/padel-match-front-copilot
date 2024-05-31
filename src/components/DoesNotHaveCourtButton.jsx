// src/components/DoesNotHaveCourtButton.jsx
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const DoesNotHaveCourtButton = ({
  setSchedules,
  setPayer,
  setShowButtons,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const schedulesResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/schedules`
      );

      setSchedules(schedulesResponse.data.data);
      setPayer(false);
      setShowButtons(false);
    } catch (error) {
      console.error("Error handling button click", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleClick}
      disabled={isLoading}
      style={style}
    >
      No tengo pista.
      <br /> Me apunto para jugar
    </Button>
  );
};

export default DoesNotHaveCourtButton;

DoesNotHaveCourtButton.propTypes = {
  setSchedules: PropTypes.func.isRequired,
  setPayer: PropTypes.func.isRequired,
  setShowButtons: PropTypes.func.isRequired,
  style: PropTypes.object,
};
