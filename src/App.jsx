import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/ResetPassword";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));
const Profile = lazy(() => import("./components/Profile")); // Import the Profile component

const theme = createTheme({
  palette: {
    type: "light", // o 'dark'
    // otras opciones del tema
  },
  typography: {
    fontFamily: "'Roboto Slab', serif",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          style={{ marginBottom: "56px" }} // Adjust this value based on the height of BottomNavBar
        >
          <Suspense
            fallback={
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
              >
                <CircularProgress />
              </Box>
            }
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset/:token" element={<ResetPassword />} />
              <Route
                path="/home"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />} // Add the Profile route
              />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<ProtectedRoute element={<Home />} />} />
            </Routes>
          </Suspense>
        </SnackbarProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
