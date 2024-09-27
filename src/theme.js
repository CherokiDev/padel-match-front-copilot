// src/theme.js
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
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "20px",
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
  },
});

export default theme;
