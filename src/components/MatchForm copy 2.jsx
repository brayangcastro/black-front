import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const MatchForm = ({ showMatchForm, setShowMatchForm, selectedMatch, handleUpdateMatch,handleFinalizeMatch }) => {
    // Suponiendo que `selectedMatch` tiene la estructura con la información del partido incluyendo los goles de cada equipo.
    const [matchDetails, setMatchDetails] = useState({
        golesEquipo1: '',
        golesEquipo2: '',
        // Incluye otros estados necesarios como ID del partido si es necesario
    });

    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleFinalizeButtonClick = () => {
        handleFinalizeMatch(selectedMatch); // Implementa esta función para finalizar el partido en el backend
        setShowMatchForm(false);
    };
    // Llenar el estado con los detalles del partido seleccionado cuando se muestra el formulario
    useEffect(() => {
        if (selectedMatch && showMatchForm) {
            setMatchDetails({
                golesEquipo1: selectedMatch.golesEquipo1 || '',
                golesEquipo2: selectedMatch.golesEquipo2 || '',
                // Copia otros valores necesarios como el ID del partido
            });
        }
    }, [selectedMatch, showMatchForm]);

    const handleClose = () => {
        setShowMatchForm(false);
        setShowSuccessMessage(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMatchDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleUpdateMatch(matchDetails); // Esta función debe ser implementada para actualizar el partido en el backend
        setShowSuccessMessage(true);
    };

    return (
        <Modal show={showMatchForm || showSuccessMessage} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{showSuccessMessage ? 'Partido Actualizado' : 'Actualizar Partido'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showSuccessMessage ? (
                    <Alert variant="success">
                        Partido actualizado exitosamente
                    </Alert>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Goles Equipo 1</Form.Label>
                            <Form.Control
                                type="number"
                                name="golesEquipo1"
                                value={matchDetails.golesEquipo1}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Goles Equipo 2</Form.Label>
                            <Form.Control
                                type="number"
                                name="golesEquipo2"
                                value={matchDetails.golesEquipo2}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="success" type="submit">Guardar Cambios</Button>
                        <Button variant="danger" onClick={handleFinalizeButtonClick}>Finalizar Partido</Button>
           
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MatchForm;
