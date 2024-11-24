// src/components/StyledButton.jsx
import { Button } from "@mui/material";
import { styled } from "@mui/system";

const StyledButton = styled(Button)(({ theme, variant }) => {
  const variantStyles =
    theme.components.MuiButton.styleOverrides[variant] || {};
  return {
    borderRadius: "10px",
    height: "50px",
    marginBottom: "10px",
    marginTop: "20px",
    backgroundColor:
      variantStyles.backgroundColor || theme.palette.primary.main,
    color: variantStyles.color || theme.palette.secondary,
    "&:hover": {
      backgroundColor:
        variantStyles["&:hover"]?.backgroundColor || theme.palette.primary.dark,
    },
  };
});

export default StyledButton;
