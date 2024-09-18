import { AppBar, Toolbar, IconButton, Badge, Avatar, Box } from "@mui/material";
// import { Notifications, Menu } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Header = ({ notificationCount }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <AppBar
      position="fixed"
      style={{
        background: "linear-gradient(to right, #3775DF, #F0D053)",
        height: "60px",
        margin: 0,
        padding: 0,
      }}
    >
      <Toolbar style={{ height: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <Avatar
              onClick={handleHomeClick}
              sx={{ bgcolor: "#9E9E9EFF", marginLeft: 1, fontSize: 14 }}
            >
              PM
            </Avatar>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <IconButton color="inherit">
              <Badge badgeContent={notificationCount} color="error">
                {/* <Notifications /> */}
              </Badge>
            </IconButton>
            <IconButton color="inherit">{/* <Menu /> */}</IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  notificationCount: PropTypes.number,
};

export default Header;
