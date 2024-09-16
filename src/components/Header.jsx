import { AppBar, Toolbar, Badge, Avatar } from "@mui/material";
import PropTypes from "prop-types";

const Header = ({ notificationCount }) => {
  return (
    <AppBar
      position="fixed"
      style={{
        background: "linear-gradient(to right, #3775DF, #F0D053)",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Badge
          badgeContent={notificationCount}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Avatar sx={{ bgcolor: "#3775DF" }}>PM</Avatar>
        </Badge>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  notificationCount: PropTypes.number,
};

export default Header;
