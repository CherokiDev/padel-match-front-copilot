import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

const Header = ({ notificationCount }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleHomeClick = () => {
    navigate("/home");
    setDrawerOpen(false);
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
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleDrawerToggle}
            >
              <List>
                <ListItem button onClick={handleHomeClick}>
                  <ListItemText
                    primary="Inicio"
                    primaryTypographyProps={{
                      style: { color: theme.palette.primary.main },
                    }}
                  />
                </ListItem>
              </List>
            </Drawer>
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
