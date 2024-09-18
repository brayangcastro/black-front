import React, { useState } from 'react';
import { Button, Modal, InputGroup, Form, Alert } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; 

const TournamentForm = (props) => {
    const { showTournamentForm, setShowTournamentForm, handleCreateTournament } = props;
    const [startDate, setStartDate] = useState(new Date()); // Nuevo estado para la fecha de inicio del torneo

const handleStartDateChange = (date) => {
    setStartDate(date);
};

    const [tournament, setTournament] = useState({
        nombre: '',
        horario: '',
        equipos: '',
        lugar: '',
        tipo: 'Jornadas'
    });
 
    
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleClose = () => {
        setShowTournamentForm(false);
        setShowSuccessMessage(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTournament((prevTournament) => ({
            ...prevTournament,
            [name]: value,
        }));
    };

 
    const handleCreateTournamentClick = () => {
        // Separar la cadena de 'equipos' por comas para convertirla en un arreglo
        const equiposArray = tournament.equipos.split(',').map(equipo => equipo.trim()); // Esto crea un arreglo y elimina los espacios en blanco alrededor de los nombres
    
        // Crear un nuevo objeto de torneo con la lista de equipos actualizada
        const updatedTournament = {
            ...tournament,
            equipos: equiposArray,
        };
    
        // Llamar a la función handleCreateTournament con el torneo actualizado
        handleCreateTournament(updatedTournament);
    
        // Mostrar el mensaje de éxito
        setShowSuccessMessage(true);
    };

    const handleClearForm = () => {
        setTournament({
            nombre: '',
            horario: '',
            equipos: '',
            lugar: '',
            tipo: 'Jornadas' // Restablecer el valor por defecto al limpiar
        });
    };

    // En tu componente TournamentForm

const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página
    props.handleCreateTournament(tournament); // Aquí pasas el objeto 'tournament' a la función 'handleCreateTournament'
    // Limpiar el formulario u otras acciones de post-envío pueden ir aquí.
};

    return (
        <>
            <Modal show={showTournamentForm || showSuccessMessage} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{showSuccessMessage ? 'Torneo Creado' : 'Crear Torneo'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSuccessMessage ? (
                        <>
                            <Alert variant="success" className="mt-3">
                                Torneo creado exitosamente
                            </Alert>
                        </>
                    ) : (
                        <>
                            <InputGroup className="mb-3">
                            <InputGroup.Text>
                                    <FontAwesomeIcon icon={faTrophy} />
                                </InputGroup.Text>
                             <Form.Control
                                    name="nombre"
                                    value={tournament.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre del torneo"
                                    aria-label="Nombre"
                                />
                            </InputGroup>

                          
                             <Form.Group className="mb-3">
                                <Form.Label>Tipo de Torneo</Form.Label>
                                <Form.Select
                                    name="tipo"
                                    value={tournament.tipo}
                                    onChange={handleInputChange}
                                >
                                    <option value="Jornadas">Jornadas</option>
                                    <option value="Eliminatoria">Eliminatoria</option>
                                </Form.Select>
                            </Form.Group>

                            <InputGroup className="mb-3">
                            <InputGroup.Text>
                                    <FontAwesomeIcon icon={faClock} />
                                </InputGroup.Text>
                             <Form.Control
                                    type="time"
                                    name="horario"
                                    value={tournament.horario}
                                    onChange={handleInputChange}
                                    placeholder="Horario"
                                    aria-label="Horario"
                                />
                            </InputGroup>

                            <InputGroup className="mb-3">
                                <InputGroup.Text>
                                    <FontAwesomeIcon icon={faClock} />
                                </InputGroup.Text>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="dd/MM/yyyy" // Formato de la fecha
                                    placeholderText="Fecha de inicio del torneo" // Texto de marcador de posición
                                    className="form-control" // Clase para dar estilo al componente de fecha
                                />
                            </InputGroup>

                            <Form.Group className="mb-3">
                                <Form.Label>Lista de Equipos</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="equipos"
                                    value={tournament.equipos}
                                    onChange={handleInputChange}
                                    placeholder="Ingresa los equipos separados por comas"
                                />
                            </Form.Group>

                            <InputGroup className="mb-3">
                            <InputGroup.Text>
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </InputGroup.Text>
                                 <Form.Control
                                    name="lugar"
                                    value={tournament.lugar}
                                    onChange={handleInputChange}
                                    placeholder="Lugar del torneo"
                                    aria-label="Lugar"
                                />
                            </InputGroup>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showSuccessMessage ? (
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={handleClearForm}>
                                Limpiar
                            </Button>
                            <Button variant="success" onClick={handleCreateTournamentClick}>
                                Generar Torneo
                            </Button>
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default TournamentForm;
