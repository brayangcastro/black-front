import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ValeModal = ({ show, handleClose, handleSelectVale }) => {
  const [selectedVale, setSelectedVale] = useState(1);
  const [percentageDiscount, setPercentageDiscount] = useState('');

  const vales = [
  
    { id: 1, nombre: 'Vale por porcentaje', estado: 'Activos', total: 0, tipo: 'Porcentaje' },
];


  const handleValeChange = (e) => {
    setSelectedVale(e.target.value);
};

const handleValeSelect = () => {
  if (selectedVale && percentageDiscount) {
      handleSelectVale(selectedVale, parseFloat(percentageDiscount));
  } else {
      handleSelectVale(selectedVale, 0);
  }
  handleClose();
};



  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Seleccionar Vale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {vales.map(vale => (
            <Form.Check
              type="radio"
              key={vale.id}
              name="vale"
              label={`${vale.nombre} - ${vale.tipo} - $${vale.total}`}
              value={vale.id}
              onChange={handleValeChange}
              defaultChecked={vale.id === selectedVale}  // Preseleccionar si es el "Vale por porcentaje"
    
            />
          ))}
          <Form.Group controlId="percentageDiscount">
            <Form.Label>Porcentaje de descuento (%)</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese el porcentaje"
              value={percentageDiscount}
              onChange={(e) => setPercentageDiscount(e.target.value)}
              disabled={!selectedVale} // Habilitar solo si se selecciona un vale
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleValeSelect}>
          Seleccionar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ValeModal;
