import { io } from "socket.io-client";

export const connectSocket = () => {
  const token = localStorage.getItem("token");
  return io(import.meta.env.VITE_API_URL, {
    // Allow websocket with fallback to polling to improve local robustness
    transports: ["websocket", "polling"],
    auth: { token },
  });
};