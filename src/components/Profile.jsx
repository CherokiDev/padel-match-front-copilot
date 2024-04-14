// src/components/Profile.jsx
import PropTypes from "prop-types";

const Profile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div>
      <div>-------------Esto ya es de Profile----------------</div>
      <h2>Profile</h2>
      <h2>{profile.name}</h2>
      <p>{profile.email}</p>
      <ul>
        {profile.schedules.map((schedule) => (
          <li key={schedule.id}>
            {schedule.dateOfReservation} - Pista {schedule.courtNumber} - La he
            alquilado yo: {schedule.playerSchedules.payer ? "Si" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default Profile;
