import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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

  if (profileStatus === "loading") return;
  <div className="container-loading">
    <div className="loading-spinner"></div>
  </div>;

  if (profileError)
    return (
      <div>
        <p>Error: {profileError}</p>
      </div>
    );

  return (
    <div className="container-main-logged">
      <div className="title-h5">
        Hola {profileData.username}, ¿qué estás buscando?
      </div>

      <div className="container-buttons-home">
        <button className="button-home" onClick={() => handleButtonClick(true)}>
          <div>
            <div className="title-h6">
              Tengo la pista alquilada, <strong>busco jugadores </strong>
            </div>
          </div>
          <div className="icon-button-home">👥</div>
        </button>

        <button
          className="button-home"
          onClick={() => handleButtonClick(false)}
        >
          <div>
            <div className="title-h6">
              Quiero jugar, <strong>busco pista</strong>
            </div>
          </div>
          <div className="icon-button-home">🎾</div>
        </button>
      </div>
    </div>
  );
};

export default Home;
