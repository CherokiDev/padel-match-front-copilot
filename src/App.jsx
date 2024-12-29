// App.jsx
import { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import theme from "./theme";
import LoadingScreen from "./components/LoadingScreen";
import MobileRecommendationModal from "./components/MobileRecommendationModal";
import "./App.css";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));
const Profile = lazy(() => import("./components/Profile"));
const Schedules = lazy(() => import("./components/Schedules"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const MatchList = lazy(() => import("./components/MatchList"));
const NotFound = lazy(() => import("./components/NotFound"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the loading time as needed

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
            {isLoading ? (
              <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
            ) : (
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
                  <Route
                    path="/matchlist"
                    element={<ProtectedRoute element={<MatchList />} />}
                  />
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                {!isMobile && (
                  <MobileRecommendationModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                  />
                )}
              </Suspense>
            )}
          </SnackbarProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
