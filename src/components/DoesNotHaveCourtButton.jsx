// src/components/DoesNotHaveCourtButton.jsx
import axios from "axios";
import { useState } from "react";
import PropTypes from "prop-types";

const DoesNotHaveCourtButton = ({ setSchedules, setPayer, setShowButtons }) => {
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
    <button onClick={handleClick} disabled={isLoading}>
      No tengo pista, me apunto para jugar
    </button>
  );
};

export default DoesNotHaveCourtButton;

DoesNotHaveCourtButton.propTypes = {
  setSchedules: PropTypes.func.isRequired,
  setPayer: PropTypes.func.isRequired,
  setShowButtons: PropTypes.func.isRequired,
};
