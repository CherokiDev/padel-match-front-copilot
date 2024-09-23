import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import MainContainer from "./MainContainer";
import { useNavigate } from "react-router-dom";
import { Typography, Button, Box, CircularProgress } from "@mui/material";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import PeopleIcon from "@mui/icons-material/People";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: profileData,
    status: profileStatus,
    error: profileError,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch]);

  const handleButtonClick = (payer) => {
    navigate("/schedules", { state: { payer } });
  };

  if (profileStatus === "loading")
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

  if (profileError)
    return (
      <MainContainer>
        <p>Error: {profileError}</p>
      </MainContainer>
    );

  return (
    <MainContainer>
      <Typography variant="h6" component="h6" gutterBottom>
        Hola {profileData.username}, ¿qué estás buscando?
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mt={2}
        width="80%"
        mx="auto"
      >
        <Button
          variant="contained"
          color="primary"
          startIcon={<SportsTennisIcon />}
          onClick={() => handleButtonClick(true)}
          sx={{
            marginBottom: { xs: 2, sm: 0 },
            marginRight: { sm: 2 },
            width: { xs: "100%", sm: "45%" },
            height: { xs: "auto", sm: "45vw" },
            minHeight: "150px",
            padding: { xs: 2, sm: 1 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Tengo la pista alquilada,</Typography>
          <Typography>busco jugadores</Typography>
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<PeopleIcon />}
          onClick={() => handleButtonClick(false)}
          sx={{
            width: { xs: "100%", sm: "45%" },
            height: { xs: "auto", sm: "45vw" },
            minHeight: "150px",
            padding: { xs: 2, sm: 1 },
            fontSize: { xs: "1rem", sm: "0.875rem" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography>Quiero jugar,</Typography>
          <Typography>busco a gente que la tenga alquilada</Typography>
        </Button>
      </Box>
    </MainContainer>
  );
};

export default Home;
