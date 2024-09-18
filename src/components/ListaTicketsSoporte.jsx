import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiUrls from '../api';
import './ListaTicketsSoporte.css';
import NuevoTicketModal from './NuevoTicketModal';

const ListaTicketsSoporte = () => {
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.post(apiUrls.obtenerTicketsSoporte, {});
                const sortedTickets = response.data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
                setTickets(sortedTickets);
            } catch (error) {
                console.error('Error al obtener los tickets de soporte:', error);
            }
        };

        fetchTickets();
    }, []); // Solo se ejecuta cuando el componente se monta

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitTicket = async (newTicket) => {
        try {
            // Crear el nuevo ticket en el backend
            await axios.post(apiUrls.crearTicketSoporte, newTicket);
            
            // Volver a cargar la lista de tickets desde el backend
            const response = await axios.post(apiUrls.obtenerTicketsSoporte, {});
            const sortedTickets = response.data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
            setTickets(sortedTickets);
            
            handleCloseModal();
        } catch (error) {
            console.error('Error al crear el ticket de soporte:', error);
        }
    };

    return (
        <div className="lista-tickets-container">
            <h2>Lista de Tickets de Soporte</h2>
            <button onClick={handleOpenModal} className="nuevo-ticket-boton">Nuevo Ticket de Soporte</button>
            <table className="tabla-tickets">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Respuesta</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.ID}>
                            <td>{ticket.ID}</td>
                            <td>{ticket.Usuario}</td>
                            <td>{ticket.Titulo}</td>
                            <td>{ticket.Descripcion}</td>
                            <td>{new Date(ticket.Fecha).toLocaleString()}</td>
                            <td>{ticket.Estado}</td>
                            <td>{ticket.Respuesta}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <NuevoTicketModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSubmit={handleSubmitTicket} 
            />
        </div>
    );
};

export default ListaTicketsSoporte;
