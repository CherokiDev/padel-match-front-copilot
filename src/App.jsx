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
import { deepPurple } from "@mui/material/colors";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Schedules from "./components/Schedules";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));
const Profile = lazy(() => import("./components/Profile"));

const theme = createTheme({
  palette: {
    type: "light", // o 'dark'
    // primary: {
    // main: "#3f51b5", // Este es el color primary por defecto de Material-UI
    // },
    secondary: {
      main: deepPurple[900], // Este es un tono más oscuro de purple
    },
    // otras opciones del tema
  },
  typography: {
    fontFamily: "'Roboto Slab', serif",
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={3000}
            resumeHideDuration={0}
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
                  element={<ProtectedRoute element={<Profile />} />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route
                  path="*"
                  element={<ProtectedRoute element={<Schedules />} />}
                />
              </Routes>
            </Suspense>
          </SnackbarProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
