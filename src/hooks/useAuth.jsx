import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/verify-token`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuth;
