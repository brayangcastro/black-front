import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaRegCalendarAlt, FaClock, FaInfo, FaRegListAlt } from 'react-icons/fa';
import axios from 'axios';
import apiUrls from '../../../api';
import ModalAgregarEvento from './ModalAgregarEvento';

const ModalEvento = ({ show, handleClose, event, updateEvent, saveEvento, editarEvento }) => {
    const [editedEvent, setEditedEvent] = useState({
        id: event.id || '',
        description: event.description || '',
        fecha: event.fecha ? new Date(event.fecha).toISOString().split('T')[0] : '',
        hour: event.hour || '',
        service: event.service || '',  // Aquí se asegura que el service ID se inicializa correctamente
        name: event.name || '',
        status: event.status || 'pendiente'
    });

    const [errors, setErrors] = useState({
        description: '',
        service: '',
        fecha: '',
        hour: ''
    });
    const [availableHours, setAvailableHours] = useState([]);
    const [services, setServices] = useState([]);

    const resetEvent = () => {
        setEditedEvent({
            id: event.id || '',
            description: '',
            fecha: '',
            hour: '',
            service: '',
            name: '',
            status: 'pendiente'
        });
    };

    useEffect(() => {
        setEditedEvent({
            id: event.id || '',
            description: event.description || '',
            fecha: event.fecha ? new Date(event.fecha).toISOString().split('T')[0] : '',
            hour: event.hour || '',
            service: event.service || '',
            name: event.name || '',
            status: event.status || 'pendiente'
        });
        setErrors({
            description: '',
            service: '',
            fecha: '',
            name:  '',
            hour: ''
        });
        console.log("SERVICIOO EDITADO",event)
    }, [event]);

    const fetchServices = async () => {
        try {
            const response = await axios.post(apiUrls.obtenerServicios);
            setServices(response.data);
        } catch (error) {
            setServices([]);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchAvailableHours = async (date) => {
        try {
            const response = await axios.post(apiUrls.obtenerDisponibilidadRealPorFecha, { fecha: date });
            const filteredHours = response.data.filter(hour => parseInt(hour.EspaciosDisponibles) > 0)
                .map(hour => `${hour.Horario} (${hour.EspaciosDisponibles} espacios disponibles)`);
            setAvailableHours(filteredHours);

            if (filteredHours.length > 0 && !editedEvent.hour) {
                setEditedEvent(prev => ({
                    ...prev,
                    hour: filteredHours[0].split(' (')[0]
                }));
            }
        } catch (error) {
            console.error('Error fetching available hours:', error);
            setAvailableHours([]);
            setEditedEvent(prev => ({ ...prev, hour: '' }));
        }
    };

    useEffect(() => {
        if (editedEvent.fecha) {
            fetchAvailableHours(editedEvent.fecha);
        }
    }, [editedEvent.fecha]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'fecha') {
            fetchAvailableHours(value);
        }

        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateField = (name, value) => {
        let formErrors = { ...errors };
        switch (name) {
            case 'description':
                formErrors.description = value ? '' : 'La descripción es requerida';
                break;
            case 'service':
                formErrors.service = value ? '' : 'El servicio es requerido';
                break;
                case 'name':
                    formErrors.name = value ? '' : 'El nombre es requerido';
                    break;
            case 'fecha':
                formErrors.fecha = value ? '' : 'La fecha es requerida';
                break;
            case 'hour':
                formErrors.hour = value ? '' : 'El horario es requerido';
                break;
            default:
                break;
        }
        setErrors(formErrors);
    };

    const validateForm = () => {
        let formErrors = {};
        
        if (!editedEvent.service) formErrors.service = 'El servicio es requerido';
        if (!editedEvent.fecha) formErrors.fecha = 'La fecha es requerida';
        if (!editedEvent.hour) formErrors.hour = 'El horario es requerido';
        if (!editedEvent.name) formErrors.hour = 'La descripción es requerido';
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const saveChanges = async () => {
        console.log("ES VALIDO",validateForm())
        if (validateForm()) {
            try {
                await editarEvento(editedEvent);
                updateEvent(editedEvent);
                handleClose();
                resetEvent(); // Limpiar los campos después de guardar
            } catch (error) {
                console.error('Error guardando los cambios del evento:', error);
            }
        }
        else{

        }
    };

    useEffect(() => {
        if (!show) {
            resetEvent();
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>ID del Evento</Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={editedEvent.id}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaInfo /> Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={editedEvent.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaInfo /> Servicio</Form.Label>
                            <Form.Control
                                as="select"
                                name="service"
                                value={editedEvent.service}  // Aquí se asegura que el servicio correcto se muestre como seleccionado
                                onChange={handleChange}
                                isInvalid={!!errors.service}
                            >
                                <option value="">Seleccione un servicio</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.service}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaRegListAlt /> Estado</Form.Label>
                            <Form.Control as="select" name="status" value={editedEvent.status} onChange={handleChange}>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="cancelado">Cancelado</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaRegCalendarAlt /> Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={editedEvent.fecha}
                                onChange={handleChange}
                                isInvalid={!!errors.fecha}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.fecha}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaClock /> Horario</Form.Label>
                            <Form.Control as="select" name="hour"
                                value={editedEvent.hour}
                                onChange={handleChange}
                                disabled={!availableHours.length}
                                isInvalid={!!errors.hour}
                            >
                                {availableHours.length === 0 ? (
                                    <option value="">No hay horarios disponibles</option>
                                ) : (
                                    availableHours.map((hour, index) => (
                                        <option key={index} value={hour.split(' (')[0]}>
                                            {hour}
                                        </option>
                                    ))
                                )}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.hour}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={saveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalEvento;
