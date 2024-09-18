import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import './MatchForm.css'; // Asegúrate de que la ruta sea correcta
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Asegúrate de instalar `@fortawesome/react-fontawesome` y los iconos que necesitas
import { faTrophy } from '@fortawesome/free-solid-svg-icons'; // Icono de trofeo para el título del torneo


const MatchForm = ({ showMatchForm, setShowMatchForm, selectedMatch, handleUpdateMatch,handleFinalizeMatch }) => {
    // Suponiendo que `selectedMatch` tiene la estructura con la información del partido incluyendo los goles de cada equipo.
    const [matchDetails, setMatchDetails] = useState({
        Goles1: '',
        Goles2: '',
        Equipo1:'',
        Equipo2:'',
        partidoId:0,
        estado:''
        // Incluye otros estados necesarios como ID del partido si es necesario
    });
    const [isTied, setIsTied] = useState(false);
    const [winner, setWinner] = useState('');
    
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleFinalizeButtonClick = () => {
        console.log("Finalizando:",selectedMatch.ID,matchDetails.Goles1,matchDetails.Goles2,winner)
        handleFinalizeMatch(selectedMatch.ID,matchDetails.Goles1,matchDetails.Goles2,winner); // Implementa esta función para finalizar el partido en el backend
        setShowMatchForm(false);
    };
    // Llenar el estado con los detalles del partido seleccionado cuando se muestra el formulario
    useEffect(() => {
        if (selectedMatch && showMatchForm) {
            setMatchDetails({
                partidoId:selectedMatch.ID,
                Goles1: selectedMatch.Goles1 || '',
                Goles2: selectedMatch.Goles2 || '',
                Equipo1: selectedMatch.Equipo1 || '',
                Equipo2: selectedMatch.Equipo2 || '' ,
                Resultado: selectedMatch.Resultado || '' 
                // Copia otros valores necesarios como el ID del partido
            });

        }
    }, [selectedMatch, showMatchForm]);

    useEffect(() => {
        // Verifica si hay un empate cada vez que los goles cambian
        if (matchDetails.Goles1 !== '' && matchDetails.Goles2 !== '') {
            if (parseInt(matchDetails.Goles1) === parseInt(matchDetails.Goles2)) {
                setIsTied(true);
            } else {
                setIsTied(false);
                setWinner(''); // Resetea el ganador si ya no hay empate
            }
        }
    }, [matchDetails.Goles1, matchDetails.Goles2]);
    

    useEffect(() => {
        if (showSuccessMessage) {
            const timer = setTimeout(() => {
                setShowSuccessMessage(false);
                setShowMatchForm(false); // Asegúrate de cerrar el modal aquí
            }, 1000); // Cierra el modal después de 3 segundos de mostrar el mensaje de éxito
    
            return () => clearTimeout(timer);
        }
    }, [showSuccessMessage]);
    
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
        console.log("matchDetails antes de enviar",matchDetails[selectedMatch.ID])
        handleUpdateMatch(matchDetails); // Esta función debe ser implementada para actualizar el partido en el backend
        setShowSuccessMessage(true);
    };


    const handleIncrement = (goal) => {
        setMatchDetails(prevDetails => ({
            ...prevDetails,
            [goal]: Number(prevDetails[goal]) + 1,
        }));
        console.log("MatchDetails",matchDetails)
        checkForTie(matchDetails.Goles1, matchDetails.Goles2);

    };
    
    const handleDecrement = (goal) => {
        setMatchDetails(prevDetails => ({
            ...prevDetails,
            [goal]: Math.max(Number(prevDetails[goal]) - 1, 0),
        }));
        console.log("MatchDetails",matchDetails)
        checkForTie(matchDetails.Goles1, matchDetails.Goles2);

    };
    useEffect(() => {
        console.log("MatchDetails actualizado", matchDetails);
      }, [matchDetails]);
      
    // Función para verificar y actualizar el estado de empate
const checkForTie = (goles1, goles2) => {
    if (goles1 === goles2) {
        setIsTied(true);
    } else {
        setIsTied(false);
        setWinner(''); // Resetea el ganador si ya no hay empate
    }
};

    return (

        
        <Modal show={showMatchForm || showSuccessMessage} onHide={handleClose}> 
            <Modal.Header closeButton>
                {/* Modificación aquí: Agrega un ícono y un título más dinámico */}
                <Modal.Title>
                    <FontAwesomeIcon icon={faTrophy} className="me-2" />{showSuccessMessage ? 'Partido Finalizado' : 'Actualizar Información del Partido'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
    <div className="d-flex justify-content-around align-items-center mb-3">
        <div className="team">
            {/* Nombre del Equipo 1 con valor predeterminado */}
            <div className="team-info">
                <div className="team-name">{matchDetails.Equipo1 || "Equipo 1"}</div>
                <div className="logo-placeholder">Logo</div>
                
            </div>
            <div className="goal-controls">
            <Button variant="outline-primary" onClick={() => handleDecrement('Goles1')}>-</Button>
            <div className="goles-placeholder">{matchDetails.Goles1.toString()}</div>
            <Button variant="outline-primary" onClick={() => handleIncrement('Goles1')}>+</Button>

            </div>
        </div>

        <div className="vs">VS</div>

        <div className="team">
            {/* Nombre del Equipo 2 con valor predeterminado */}
            <div className="team-info">
                <div className="team-name">{matchDetails.Equipo2 || "Equipo 2"}</div>
                <div className="logo-placeholder">Logo</div>
            </div>
            <div className="goal-controls">
            <Button variant="outline-primary" onClick={() => handleDecrement('Goles2')}>-</Button>
            <div className="goles-placeholder">{matchDetails.Goles2.toString()}</div>
            <Button variant="outline-primary" onClick={() => handleIncrement('Goles2')}>+</Button>
            </div>
        </div>

    </div>
    {isTied && (
    <Form.Group>
    <Form.Label>Seleccionar Ganador (empate)</Form.Label>
    <Form.Select
        value={winner}
        onChange={(e) => setWinner(e.target.value)}
    >
        <option value="">Selecciona un equipo</option>
        {/* Actualiza estos valores para que coincidan con tu backend */}
        <option value={"Gana Equipo1"}>{"Gana " + matchDetails.Equipo1}</option>
        <option value={"Gana Equipo2"}>{"Gana " + matchDetails.Equipo2}</option>
    </Form.Select>
    </Form.Group>

)}

</Modal.Body>




<Modal.Footer>
    {!showSuccessMessage && (
        <>
            <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            <Button variant="primary" onClick={handleSubmit}>Guardar Cambios</Button>
            {/* Asegúrate de que el botón esté deshabilitado si hay un empate y no se ha seleccionado un ganador */}
            <Button variant="danger" onClick={handleFinalizeButtonClick} disabled={isTied && !winner}>Finalizar Partido</Button>
        </>
    )}
</Modal.Footer>

        </Modal>
    );
};

export default MatchForm;
