import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const NuevoAbonoForm = ({ showAbonoModal, setShowAbonoModal, crearAbono }) => {
    const [nuevoAbono, setNuevoAbono] = useState({
        Nombre: '',
        Vendedor: '',
        Abono: '',
        Cuenta: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoAbono({ ...nuevoAbono, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        crearAbono(nuevoAbono);
        setShowAbonoModal(false);
    };

    return (
        <Modal show={showAbonoModal} onHide={() => setShowAbonoModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nuevo Abono</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Cliente</Form.Label>
                        <Form.Control type="text" name="Cliente" value={nuevoAbono.Cliente} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Vendedor</Form.Label>
                        <Form.Control type="text" name="Vendedor" value={nuevoAbono.Vendedor} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Abono</Form.Label>
                        <Form.Control type="text" name="Abono" value={nuevoAbono.Abono} onChange={handleChange} />
                    </Form.Group>
                    <Button type="submit">Siguiente</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NuevoAbonoForm;
