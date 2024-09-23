import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./LoadingScreen.css";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          onLoadingComplete();
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 200); // Se puede ajustar el tiempo de carga

    return () => {
      clearInterval(interval);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-background"></div>
      <div className="loading-bar">
        <div
          className="loading-progress"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

LoadingScreen.propTypes = {
  onLoadingComplete: PropTypes.func.isRequired,
};

export default LoadingScreen;
