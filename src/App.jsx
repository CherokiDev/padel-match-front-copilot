import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./components/ResetPassword";
import { SnackbarProvider } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));

const theme = createTheme({
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
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
