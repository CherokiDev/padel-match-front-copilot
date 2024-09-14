import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import MainContainer from "./MainContainer";
// import { fetchSchedules } from "../redux/schedulesSlice";
import { useNavigate } from "react-router-dom";

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
      // dispatch(fetchSchedules(token));
    }
  }, [dispatch]);

  const handleButtonClick = (payer) => {
    navigate("/schedules", { state: { payer } });
  };

  if (profileStatus === "loading")
    return <MainContainer>Loading...</MainContainer>;
  if (profileError)
    return (
      <MainContainer>
        <p>Error: {profileError}</p>
      </MainContainer>
    );

  return (
    <MainContainer>
      <h1>Profile</h1>
      {profileData && <p> Name: {profileData.name}</p>}

      <p>Hola {profileData.username}, primero de nada, que estás buscando?</p>

      <button onClick={() => handleButtonClick(true)}>
        Tengo la pista alquilada y busco jugadores
      </button>

      <button onClick={() => handleButtonClick(false)}>
        Quiero jugar, busco a gente que la tenga alquilada
      </button>
    </MainContainer>
  );
};

export default Home;
