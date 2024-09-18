import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EditCuentaForm = ({ showEditModal, setShowEditModal, cuenta, editarCuenta }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        setFormData(cuenta || {});
    }, [cuenta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        editarCuenta(formData);
        setShowEditModal(false);
    };

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Cuenta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="Nombre" value={formData.Nombre || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Valor Total</Form.Label>
                        <Form.Control type="text" name="Valor_total" value={formData.Valor_total || ''} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Abonado</Form.Label>
                        <Form.Control type="text" name="Abonado" value={formData.Abonado || ''} onChange={handleChange} />
                    </Form.Group>
                    <Button type="submit">Guardar Cambios</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditCuentaForm;
