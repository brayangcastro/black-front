import React from 'react';
import { Modal, Button, Badge, Card } from 'react-bootstrap';
import './BoletoDetalleModal.css'; // Importamos los estilos específicos

const BoletoDetalleModal = ({ show, handleClose, boletoSeleccionado, handleCancelarBoleto, handleLimpiarBoleto, handleApartarBoleto }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Boleto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {boletoSeleccionado && (
                    <Card className="boleto-info-card">
                        <p><strong>Número:</strong> {boletoSeleccionado.Numero}</p>
                        <p><strong>Nombre:</strong> {boletoSeleccionado.Nombre}</p>
                        <p><strong>Fecha:</strong> {boletoSeleccionado.Fecha}</p>
                        <p><strong>Sorteo:</strong> {boletoSeleccionado.Sorteo}</p>
                        <p>
                            <strong>Estado:</strong>
                            <Badge 
                                className="badge-status" 
                                bg={
                                    boletoSeleccionado.Estado === 'CONFIRMADO' 
                                        ? 'success' 
                                        : boletoSeleccionado.Estado === 'PROCESANDO' 
                                        ? 'warning' 
                                        : 'secondary'
                                }
                            >
                                {boletoSeleccionado.Estado}
                            </Badge>
                        </p>
                    </Card>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn-action btn-danger" onClick={handleCancelarBoleto}>
                    Cancelar Boleto
                </Button>
                <Button className="btn-action btn-warning" onClick={handleLimpiarBoleto}>
                    Limpiar Boleto
                </Button>
                <Button className="btn-action btn-info" onClick={handleApartarBoleto}>
                    Apartar Boleto
                </Button>
                <Button className="btn-action btn-secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BoletoDetalleModal;
