import React, { useState } from 'react';
import axios from 'axios';
import { FaSync, FaUsb, FaServer, FaPlay, FaTerminal, FaPlusCircle, FaRedoAlt } from 'react-icons/fa';
import './EjecutarComando.css'; // Archivo CSS para los estilos personalizados
import NuevoTicketModal from './NuevoTicketModal';
import apiUrls from '../api';

const EjecutarComando = () => {
    const [output, setOutput] = useState('');
    const [customCommand, setCustomCommand] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const executeCommand = async (command) => {
        try {
            const response = await axios.post(apiUrls.ejecutarComando, { command });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(`Error: ${error.response ? error.response.data.error : error.message}`);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitTicket = async (ticket) => {
        // Aquí puedes hacer la lógica para enviar el ticket al backend
        console.log('Ticket enviado:', ticket);
        // Ejemplo: axios.post('/api/tickets', ticket);
    };

    return (
        <div className="ejecutar-comando-container">
 

            <h2 className="titulo">Ejecutar Comando en el Servidor</h2>

            <div className="botones">
                {/* Botón para reiniciar CUPS */}
                <button onClick={() => executeCommand('sudo systemctl restart cups')} className="comando-boton">
                    <FaSync /> Reiniciar CUPS
                </button>

                {/* Botón para reiniciar los puertos USB */}
                <button onClick={() => executeCommand('sudo udevadm trigger --subsystem-match=usb --action=add')} className="comando-boton">
                    <FaUsb /> Reiniciar USB
                </button>

                {/* Botón para reiniciar Nginx */}
                <button onClick={() => executeCommand('sudo systemctl restart nginx')} className="comando-boton">
                    <FaServer /> Reiniciar Nginx
                </button>

                {/* Botón para reiniciar Apache2 */}
                <button onClick={() => executeCommand('sudo systemctl restart apache2')} className="comando-boton">
                    <FaPlay /> Reiniciar Apache2
                </button>

                {/* Botón para reiniciar todo */}
                <button onClick={() => executeCommand('sudo systemctl restart && sudo systemctl restart nginx && sudo systemctl restart apache2')} className="comando-boton">
                    <FaRedoAlt /> Reiniciar Todo
                </button>

              
            </div>

            {/* Entrada y botón para ejecutar comando personalizado */}
            <div className="comando-personalizado">
                <input 
                    type="text" 
                    value={customCommand} 
                    onChange={(e) => setCustomCommand(e.target.value)} 
                    placeholder="Ingresa tu comando personalizado" 
                    className="comando-input"
                />
                <button 
                    onClick={() => executeCommand(customCommand)} 
                    className="comando-boton"
                >
                    <FaTerminal /> Ejecutar Comando
                </button>
            </div>

            <pre className="output">{output}</pre>

            {/* Modal para el nuevo ticket */}
            <NuevoTicketModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSubmit={handleSubmitTicket} 
            />
        </div>
    );
};

export default EjecutarComando;
