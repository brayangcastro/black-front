import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

function FormatearCantidad(cantidad) {
  const numero = parseFloat(cantidad);
  return !isNaN(numero) ? numero.toFixed(2) : '0.00';
}

const CambioModal = ({ show, handleClose, cantidadPagada, cambio, efectivoPagado, valePagado }) => {
  // Definiendo los estilos en línea
  const modalStyle = {
    backgroundColor: '#f4f4f4',
    color: '#333',
    borderRadius: '20px',
    border: 'none',
  };

  const closeIconStyle = {
    color: '#999',
    cursor: 'pointer',
    position: 'absolute',
    top: '15px',
    right: '15px',
    fontSize: '24px',
  };

  const cambioAmountStyle = {
    backgroundColor: '#e9e9e9',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '10px',
  };

  const cambioStyle = {
    ...cambioAmountStyle,
    backgroundColor: '#c8e6c9',
    marginBottom: '30px',
  };

  const buttonStyle = {
    width: '100%',
    margin: '10px 0',
    borderRadius: '5px',
  };

  const bodyStyle = {
    backgroundColor: '#f4f4f4',
    borderRadius: '20px',
    border: 'none',
    color: '#333',
    padding: '40px 20px',
    position: 'relative',
    textAlign: 'center',
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body style={bodyStyle}>
        <FontAwesomeIcon icon={faTimesCircle} style={closeIconStyle} onClick={handleClose} />
        <h1 style={{ margin: '0', color: '#333' }}>Pago generado con éxito.</h1>
        <div style={cambioAmountStyle}>
          <p style={{ margin: '0', color: '#555' }}>Pagó con</p>
          <h1 style={{ margin: '0' }}>$ {FormatearCantidad(cantidadPagada)}</h1>
          {efectivoPagado > 0 && (
            <p>Efectivo: $ {FormatearCantidad(efectivoPagado)}</p>
          )}
          {valePagado > 0 && (
            <p>Vale: $ {FormatearCantidad(valePagado)}</p>
          )}
        </div>
        <div style={cambioStyle}>
          <p style={{ margin: '0', color: '#555' }}>Su cambio</p>
          <h1>$ {FormatearCantidad(cambio)}</h1>
        </div>
        <p style={{ margin: '15px 0 30px', color: '#555', fontWeight: 'bold' }}>
          {new Date().toLocaleString()}
        </p>
        <Button variant="outline-dark" style={buttonStyle} onClick={handleClose}>
          SALIR
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default CambioModal;
