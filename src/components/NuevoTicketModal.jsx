import React, { useState } from 'react';
import axios from 'axios';
import './NuevoTicketModal.css'; // Archivo CSS para estilos del modal
import apiUrls from '../api'; // Asegúrate de que la ruta sea correcta

const NuevoTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [usuario] = useState('UsuarioTest');  // Aquí puedes obtener el usuario de sesión actual
    const [estado] = useState('Abierto');
    const [fecha] = useState(new Date().toISOString().slice(0, 19).replace('T', ' '));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ticket = {
            Usuario: usuario,
            Titulo: titulo,
            Descripcion: descripcion,
            Fecha: fecha,
            Estado: estado,
        };
        try {
            const response = await axios.post(apiUrls.crearTicketSoporte, { ticket });
            console.log('Ticket creado:', response.data);
            onSubmit(response.data); // Aquí enviamos el ticket completo que se creó
        } catch (error) {
            console.error('Error al enviar el ticket:', error);
        }
        setTitulo('');
        setDescripcion('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Nuevo Ticket de Soporte</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Título:
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Descripción:
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </label>
                    <div className="modal-buttons">
                        <button type="submit" className="submit-button">Enviar</button>
                        <button type="button" onClick={onClose} className="close-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NuevoTicketModal;
