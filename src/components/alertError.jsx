import { useEffect } from "react";
import { Alert, Fade } from "react-bootstrap";

const AlertError = (props) => {
  const { showFeedbackError, setShowFeedbackError } = props;

  useEffect(() => {
    // Establecer el temporizador para cambiar la visibilidad después de 5 segundos
    const timer = setTimeout(() => {
      setShowFeedbackError(false);
    }, 5000);

    // Limpiar el temporizador si el componente se desmonta antes de que expire
    return () => clearTimeout(timer);
  }, [showFeedbackError, setShowFeedbackError]);

  return (
    <>
      <Fade in={showFeedbackError}>
        <Alert variant="warning" show={showFeedbackError}>
          Ocurrió un error, intentelo más tarde.
        </Alert>
      </Fade>
    </>
  );
};

export default AlertError;