import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Home = lazy(() => import("./components/Home"));

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Suspense fallback={<div>Loading con Suspense...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<ProtectedRoute element={<Home />} />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
