import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import './MatchForm.css'; // Asegúrate de que la ruta sea correcta

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
    <div className="d-flex justify-content-around align-items-center mb-3">
        <div className="team">
            <Form.Group>
                <Form.Label>Nombre Equipo 1</Form.Label>
                <div className="d-flex align-items-center">
                    <Form.Control
                        className="mr-2"
                        type="text"
                        placeholder="Equipo 1"
                        readOnly
                        value={matchDetails.equipo1}
                    />
                    {/* Placeholder para el logo, ajusta según necesites */}
                    <div className="logo-placeholder mr-2">Logo</div>
                    <Button>-</Button>
                    <Form.Control
                        className="mx-2 text-center"
                        type="text"
                        style={{ maxWidth: "60px" }}
                        value={matchDetails.golesEquipo1}
                        readOnly
                    />
                    <Button>+</Button>
                </div>
            </Form.Group>
        </div>

        <div className="vs">VS</div>

        <div className="team">
            <Form.Group>
                <Form.Label>Nombre Equipo 2</Form.Label>
                <div className="d-flex align-items-center">
                    <Form.Control
                        className="mr-2"
                        type="text"
                        placeholder="Equipo 2"
                        readOnly
                        value={matchDetails.equipo2}
                    />
                    {/* Placeholder para el logo, ajusta según necesites */}
                    <div className="logo-placeholder mr-2">Logo</div>
                    <Button>-</Button>
                    <Form.Control
                        className="mx-2 text-center"
                        type="text"
                        style={{ maxWidth: "60px" }}
                        value={matchDetails.golesEquipo2}
                        readOnly
                    />
                    <Button>+</Button>
                </div>
            </Form.Group>
        </div>
    </div>
</Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MatchForm;
