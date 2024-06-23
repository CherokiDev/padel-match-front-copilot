import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/profileSlice";
import MainContainer from "./MainContainer";

const Home = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.data);
  const status = useSelector((state) => state.profile.status);
  const error = useSelector((state) => state.profile.error);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchProfile(token));
    }
  }, [dispatch]);

  if (status === "loading") return <MainContainer>Loading...</MainContainer>;
  if (error)
    return (
      <MainContainer>
        <p>Error: {error}</p>
      </MainContainer>
    );

  return (
    <MainContainer>
      <h1>Profile</h1>
      {profile && <p> Name: {profile.name}</p>}
    </MainContainer>
  );
};

export default Home;
