import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaInfoCircle, FaServicestack, FaRegListAlt } from 'react-icons/fa';
import axios from 'axios';
import apiUrls from '../../../api';
import AgregarDisponibilidad from './AgregarDisponibilidad';

const ModalAgregarEvento = ({ show, handleClose, saveEvento, initialDate, initialHour, fixedHour, availabilityText, onDisponibilidadClose, isUnavailable }) => {
    const [newEvent, setNewEvent] = useState({
        description: '',
        status: 'pendiente',
        date: initialDate || '',
        hour: initialHour || '',
        servicio: ''
    });
    const [availableHours, setAvailableHours] = useState([]);
    const [showAgregarDisponibilidad, setShowAgregarDisponibilidad] = useState(false);
    const [addAvailability, setAddAvailability] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [canSave, setCanSave] = useState(true);

    const resetEvent = () => {
        setNewEvent({
            description: '',
            status: 'pendiente',
            servicio: ''
        });
        setAddAvailability(false); // Desactivar el checkbox
    };
    
    // Estados para errores específicos
    const [errors, setErrors] = useState({
        description: '',
        servicio: ''
    });

    useEffect(() => {
        if (!show) {
            setErrors({
                description: '',
                servicio: ''
            });
            setErrorMessage('');
            resetEvent(); // Limpiar los campos y desactivar el checkbox al cerrar el modal
        }
    }, [show]);
        
    useEffect(() => {
        setNewEvent(prev => ({
            ...prev,
            date: initialDate || '',
            hour: initialHour || ''
        }));
        if (fixedHour) {
            setAvailableHours([initialHour]);
        }
    }, [initialDate, initialHour, fixedHour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({
            ...prev,
            [name]: name === 'hour' ? value.split(' (')[0] : value
        }));

        if (name === 'date' && !fixedHour) {
            fetchAvailableHours(value);
        }

        // Restablecer los mensajes de error y el estado de guardado al cambiar la hora o la fecha
        setErrors(prev => ({ ...prev, [name]: '' }));
        setErrorMessage('');
        setCanSave(true);
    };

    const fetchAvailableHours = async (date) => {
        try {
            const response = await axios.post(apiUrls.obtenerDisponibilidadRealPorFecha, { fecha: date });
            const filteredHours = response.data.filter(hour => parseInt(hour.EspaciosDisponibles) > 0)
                .map(hour => `${hour.Horario} (${hour.EspaciosDisponibles} espacios disponibles)`);
            setAvailableHours(filteredHours);

            if (filteredHours.length > 0) {
                setNewEvent(prev => ({
                    ...prev,
                    hour: filteredHours[0].split(' (')[0]
                }));
            }
        } catch (error) {
            setAvailableHours([]);
            setNewEvent(prev => ({ ...prev, hour: '' }));
        }
    };

    const handleSubmit = () => {
        // Validar campos
        const newErrors = {};
        if (!newEvent.description) newErrors.description = 'La descripción es obligatoria';
        if (!newEvent.date) newErrors.date = 'La fecha es obligatoria';
        if (!newEvent.hour) newErrors.hour = 'El horario es obligatorio';
        if (!newEvent.servicio) newErrors.servicio = 'El servicio es obligatorio';

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setErrorMessage('Por favor, complete todos los campos obligatorios');
            setCanSave(false);
            return;
        }

        if (isUnavailable && !addAvailability) {
            setErrorMessage('No hay espacios disponibles.');
            setCanSave(false);
            return;
        }

        if (addAvailability) {
            const [inicio, fin] = newEvent.hour.split(' - '); // Divide el string en inicio y fin
            const horarios = [{
                inicio: inicio.trim(), // Asegúrate de eliminar espacios en blanco
                fin: fin.trim(),
                capacidad: 1
            }];

            axios.post(apiUrls.agregarDisponibilidad, {
                fecha: newEvent.date,
                horarios: horarios
            }).then(response => {
                console.log('Disponibilidad aumentada:', response.data);
                saveEventAndClose();
            }).catch(error => {
                console.error('Error al agregar disponibilidad:', error);
                setErrorMessage('Error al agregar disponibilidad.');
            });
        } else {
            saveEventAndClose();
        }
    };

    const saveEventAndClose = () => {
        const evento = {
            description: newEvent.description,
            date: new Date(newEvent.date).toISOString().split('T')[0], // Asegurarse de que la fecha está en el formato correcto
            hour: newEvent.hour.split(' (')[0], // Extraer solo la hora sin los espacios disponibles
            servicio: newEvent.servicio,
            status: newEvent.status
        };
        saveEvento(evento);
        handleClose();
        setAddAvailability(false);  // Desmarcar el checkbox
        resetEvent(); // Limpiar los campos después de guardar
    };    

    useEffect(() => {
        if (newEvent.date && !fixedHour) {
            fetchAvailableHours(newEvent.date);
        }
    }, [newEvent.date, fixedHour]);

    useEffect(() => {
        if (addAvailability) {
            setErrorMessage('');
            setCanSave(true);
        }
    }, [addAvailability]);

    const [services, setServices] = useState([]);

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

    const handleDisponibilidadClose = () => {
        fetchAvailableHours(newEvent.date);
        setShowAgregarDisponibilidad(false);
        if (newEvent.date && !fixedHour) {
            fetchAvailableHours(newEvent.date);
        }
    };

    // Limpiar errores al cerrar el modal
    useEffect(() => {
        if (!show) {
            setErrors({
                description: '',
                date: '',
                hour: '',
                servicio: ''
            });
            setErrorMessage('');
        }
    }, [show]);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nuevo Evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><FaInfoCircle /> Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                value={newEvent.description}
                                onChange={handleChange}
                                isInvalid={!!errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.description}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaServicestack /> Servicio</Form.Label>
                            <Form.Control
                                as="select"
                                name="servicio"
                                value={newEvent.servicio}
                                onChange={handleChange}
                                isInvalid={!!errors.servicio}
                            >
                                <option value="">Seleccione un servicio</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.nombre}</option>
                                ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                {errors.servicio}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaCalendarAlt /> Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="date"
                                value={newEvent.date}
                                onChange={handleChange}
                                isInvalid={!!errors.date}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.date}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaClock /> Horario</Form.Label>
                            <div className="d-flex align-items-center">
                                {fixedHour ? (
                                    <Form.Control
                                        as="input"
                                        name="hour"
                                        value={availabilityText || newEvent.hour}
                                        readOnly
                                    />
                                ) : (
                                    <Form.Control
                                        as="select"
                                        name="hour"
                                        value={newEvent.hour}
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
                                )}
                                <Button style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }} onClick={() => setShowAgregarDisponibilidad(true)}>
                                    +
                                </Button>
                            </div>
                            {errorMessage && (
                                <div className="text-danger mt-2">
                                    {errorMessage}
                                </div>
                            )}
                            <Form.Control.Feedback type="invalid">
                                {errors.hour}
                            </Form.Control.Feedback>
                            {isUnavailable && (
                                <Form.Check
                                    type="checkbox"
                                    label="Agregar disponibilidad"
                                    checked={addAvailability}
                                    onChange={(e) => setAddAvailability(e.target.checked)}
                                />
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><FaRegListAlt /> Estado</Form.Label>
                            <Form.Control as="select" name="status" value={newEvent.status} onChange={handleChange}>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmado">Confirmado</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Guardar Evento
                    </Button>
                </Modal.Footer>
            </Modal>

            {showAgregarDisponibilidad && (
                <AgregarDisponibilidad
                    show={showAgregarDisponibilidad}
                    onClose={handleDisponibilidadClose}
                    initialDate={newEvent.date}
                    initialHour={newEvent.hour}
                />
            )}
        </>
    );
};

export default ModalAgregarEvento;
