import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import apiUrls from '../../../api';

const AgregarDisponibilidad = ({ show, onClose }) => {
    const [fecha, setFecha] = useState('');
    const [horarios, setHorarios] = useState([{ horario: '', capacidad: '' }]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {
                const response = await axios.post(apiUrls.obtenerHorarios);
                setHorariosDisponibles(response.data); // Supone que el response.data ya está en el formato correcto
            } catch (error) {
                console.error('Error al obtener horarios del backend:', error);
                alert('Error al cargar horarios disponibles.');
            }
        };
        obtenerHorarios();
    }, []);

    const handleFechaChange = (e) => {
        setFecha(e.target.value);
    };

    const handleHorarioChange = (index, value) => {
        const newHorarios = [...horarios];
        newHorarios[index].horario = value;
        setHorarios(newHorarios);
    };

    const handleCapacidadChange = (index, value) => {
        const newHorarios = [...horarios];
        newHorarios[index].capacidad = Number(value);
        setHorarios(newHorarios);
    };

    const agregarHorario = () => {
        setHorarios([...horarios, { horario: '', capacidad: '' }]);
    };

    const eliminarHorario = (index) => {
        const newHorarios = [...horarios];
        newHorarios.splice(index, 1);
        setHorarios(newHorarios);
    };

    const enviarDisponibilidad = async () => {
        try {
            const response = await axios.post(apiUrls.agregarDisponibilidad, { fecha, horarios });
            alert('Disponibilidad agregada: ' + response.data.message);
            onClose();  // Cerrar el modal después de enviar
        } catch (error) {
            alert('Error al agregar disponibilidad: ' + error.message);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
              
                <Modal.Title>Agregar Disponibilidad</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            value={fecha}
                            onChange={handleFechaChange}
                        />
                    </Form.Group>
                    {horarios.map((horario, index) => (
                        <div key={index}>
                            <Form.Group>
                                <Form.Label>Horario</Form.Label>
                                <Form.Control as="select" value={horario.horario} onChange={(e) => handleHorarioChange(index, e.target.value)}>
                                    {horariosDisponibles.map((horarioDisp, i) => (
                                        <option key={i} value={horarioDisp.horario}>
                                            {horarioDisp.horario}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Capacidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={horario.capacidad}
                                    onChange={(e) => handleCapacidadChange(index, e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="danger" onClick={() => eliminarHorario(index)}>Eliminar Horario</Button>
                        </div>
                    ))}
                    <Button onClick={agregarHorario}>Agregar Horario</Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cerrar</Button>
                <Button variant="primary" onClick={enviarDisponibilidad}>Enviar Disponibilidad</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AgregarDisponibilidad;
