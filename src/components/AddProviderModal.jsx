import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddProviderModal = ({ show, handleClose, agregarProveedor, newProvider, setNewProvider }) => {
    const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProvider({ ...newProvider, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        // Verificar si el campo "Nombre" está vacío
        if (!newProvider.Nombre.trim()) {
            setValidated(true);
            return;
        }

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                console.log("Enviando detalles del proveedor:", newProvider);
                await agregarProveedor(newProvider);
                handleClose();
                setValidated(false);  // Restablecer el estado de validación después de agregar el proveedor
            } catch (error) {
                console.error('Error al agregar el proveedor:', error);
            }
        }
        setValidated(true);
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setNewProvider({
            Nombre: '',
            Telefono: '',
            Correo: '',
        });
        setValidated(false);  // Restablecer el estado de validación
    };

    // Efecto para limpiar el formulario cada vez que se cierra o abre el modal
    useEffect(() => {
        if (show) {
            resetForm();  // Limpiar el formulario cuando se abre el modal
        }
    }, [show]);

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="Nombre"
                            value={newProvider.Nombre}
                            onChange={handleChange}
                            placeholder="Introduce el nombre del proveedor"
                            isInvalid={validated && !newProvider.Nombre.trim()}  // Mostrar el mensaje si el campo está vacío
                        />
                        <Form.Control.Feedback type="invalid">
                            El nombre del proveedor no puede estar vacío.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="Telefono"
                            value={newProvider.Telefono}
                            onChange={handleChange}
                            placeholder="Introduce el teléfono del proveedor"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            type="email"
                            name="Correo"
                            value={newProvider.Correo}
                            onChange={handleChange}
                            placeholder="Introduce el correo del proveedor"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Agregar Proveedor
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal >
    );
};

export default AddProviderModal;
