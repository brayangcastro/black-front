import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditarDisponibilidad = ({ show, fecha, horario, capacidad, espacio, onClose, onSave }) => {
    const [capacidadActual, setCapacidadActual] = useState(capacidad || "1");
    const [espacioActual, setEspacioActual] = useState(espacio);

    const handleCapacidadChange = (e) => {
        setCapacidadActual(e.target.value);
    };

    const handleEspacioChange = (e) => {
        setEspacioActual(e.target.value);
    };

    const handleSave = () => {
        onSave(fecha, horario,espacioActual, capacidadActual); // Pasamos el espacioActual al guardar
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Disponibilidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control type="text" readOnly value={fecha} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Horario</Form.Label>
                        <Form.Control type="text" readOnly value={horario} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Capacidad</Form.Label>
                        <Form.Control
                            type="number"
                            value={capacidadActual}
                            onChange={handleCapacidadChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Espacio</Form.Label>
                        <Form.Control
                            type="number"
                            value={espacioActual}
                            onChange={handleEspacioChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Guardar Cambios
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditarDisponibilidad;
