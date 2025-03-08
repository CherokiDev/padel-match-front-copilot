import { createTheme } from "@mui/material/styles";
import { deepPurple, blue } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: blue[700],
    },
    secondary: {
      main: deepPurple[900],
    },
  },
  typography: {
    fontFamily: "'Roboto Slab', serif",
    h4: {
      color: "white",
    },
    h5: {
      color: "#1976d2",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    h6: {
      color: "#1976d2",
      marginTop: "10px",
    },
    body2: {
      color: "#1976d2",
    },
    body3: {
      // color: "#1976d2",
      fontSize: "0.7rem",
    },
    titleHeader: {
      color: "white",
      fontSize: "1.5rem",
      fontFamily: "'Roboto Slab', serif",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#0B2136FF",
          height: "60px",
          margin: 0,
          padding: 0,
          borderRadius: "0 0 10px 10px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          height: "50px",
        },
        containedSecondary: {
          backgroundColor: "#f5f5f5",
          color: blue[700],
          "&:hover": {
            backgroundColor: "#e0e0e0",
          },
        },
        outlinedButton: {
          backgroundColor: "#e0e0e0",
          color: blue[700],
          "&:hover": {
            backgroundColor: "#CCCCCCFF",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "20px",
          marginBottom: "20px",
          // background: "linear-gradient(to right, #3775DF, #F0D053)",
          // background: "linear-gradient(to right, #3775DF, #53F082FF)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "20px",
          background: "white",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "#C9C9C9FF",
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: "white",
          "&$selected": {
            color: blue[700],
          },
        },
      },
    },
  },
});

export default theme;
