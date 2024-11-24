import { useEffect } from "react";
import PropTypes from "prop-types";
import { CircularProgress, Box } from "@mui/material";

const LoadingScreen = ({ onLoadingComplete }) => {
  useEffect(() => {
    // Simular la finalización de la carga cuando sea necesario
    onLoadingComplete();
  }, [onLoadingComplete]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
};

LoadingScreen.propTypes = {
  onLoadingComplete: PropTypes.func.isRequired,
};

export default LoadingScreen;
