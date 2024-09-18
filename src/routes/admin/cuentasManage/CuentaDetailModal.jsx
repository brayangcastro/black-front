import React from 'react';
import { Modal, ListGroup, Button } from 'react-bootstrap';

const CuentaDetailModal = ({ show, handleClose, cuenta }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Cuenta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {cuenta ? (
                    <ListGroup variant="flush">
                        <ListGroup.Item>ID: {cuenta.ID}</ListGroup.Item>
                        <ListGroup.Item>Nombre: {cuenta.Nombre}</ListGroup.Item>
                        <ListGroup.Item>Valor Total: {cuenta.Valor_total}</ListGroup.Item>
                        <ListGroup.Item>Abonado: {cuenta.Abonado}</ListGroup.Item>
                    </ListGroup>
                ) : (
                    <p>No se ha seleccionado ninguna cuenta.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CuentaDetailModal;
