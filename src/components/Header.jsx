import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => {
  return (
    <AppBar
      position="fixed"
      style={{
        height: "60px",
        background: "#2B8B2B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Toolbar>
        <Typography variant="h6">Padel Match</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
