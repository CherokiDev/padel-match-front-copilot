import PropTypes from "prop-types";

const MainContainer = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      marginTop: "60px",
      marginBottom: "60px",
      minHeight: "calc(100vh - 120px)",
    }}
  >
    {children}
  </div>
);

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainContainer;
