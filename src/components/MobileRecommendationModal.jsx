// src/components/MobileRecommendationModal.jsx
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const MobileRecommendationModal = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Typography variant="h5" align="center" gutterBottom>
          Estamos trabajando en adaptar esta aplicación para pantallas más
          grandes.
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          Por ahora, recomendamos visualizarla en un dispositivo móvil para una
          mejor experiencia.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

MobileRecommendationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MobileRecommendationModal;
