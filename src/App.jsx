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
import { ThemeProvider } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Schedules from "./components/Schedules";
import theme from "./theme";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));
const Profile = lazy(() => import("./components/Profile"));
const NotFound = lazy(() => import("./components/NotFound"));

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
            style={{ height: "45px" }}
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
                <Route
                  path="/schedules"
                  element={<ProtectedRoute element={<Schedules />} />}
                />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />{" "}
              </Routes>
            </Suspense>
          </SnackbarProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
