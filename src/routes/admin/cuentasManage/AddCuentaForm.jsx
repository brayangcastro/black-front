import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const AddCuentaForm = ({ showAddModal, setShowAddModal, agregarCuenta }) => {
    const [newCuenta, setNewCuenta] = useState({
        Nombre: '',
        Valor_total: '',
        Abonado: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCuenta({ ...newCuenta, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarCuenta(newCuenta);
        setShowAddModal(false);
    };

    return (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nueva Cuenta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="Nombre" value={newCuenta.Nombre} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Valor Total</Form.Label>
                        <Form.Control type="text" name="Valor_total" value={newCuenta.Valor_total} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Abonado</Form.Label>
                        <Form.Control type="text" name="Abonado" value={newCuenta.Abonado} onChange={handleChange} />
                    </Form.Group>
                    <Button type="submit">Agregar Cuenta</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCuentaForm;
