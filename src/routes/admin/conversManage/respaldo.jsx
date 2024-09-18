import { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrls from '../../../api';
import HeaderComponent from './HeaderComponent';
import { ConversManageView } from './conversManage-View';

const ConversManage = () => {
    // Estado para almacenar los datos de la API y totales
    const [convers, setConvers] = useState([]);
    const [totalConversaciones, setTotalConversaciones] = useState(0);
    const [totalEntrantes, setTotalEntrantes] = useState(0);
    const [totalSalientes, setTotalSalientes] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [ws, setWs] = useState(null);

    // Función para hacer la solicitud a la API y calcular totales
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resultados = await axios.post(apiUrls.obtenerConversacionesEstado);
                setConvers(resultados.data);

                // Aquí calculas los totales basándote en `resultados.data`
                const totalConvers = resultados.data.length;
                let entrantes = 0;
                let salientes = 0;

                resultados.data.forEach(conversacion => {
                    conversacion.Stats.forEach(stat => {
                        if (stat.messageType === 'incoming') {
                            entrantes += stat.count;
                        } else if (stat.messageType === null) {
                            salientes += stat.count;
                        }
                    });
                });

                setTotalConversaciones(totalConvers);
                setTotalEntrantes(entrantes);
                setTotalSalientes(salientes);
            } catch (error) {
                console.error("Error al obtener el estado de las conversaciones:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Aquí manejarías la conexión WebSocket
        // Similar al ejemplo anterior, asegurándote de actualizar `isConnected` según el estado del WebSocket
    }, []);

    return (
        <>
            <HeaderComponent
                totalConversaciones={totalConversaciones}
                totalEntrantes={totalEntrantes}
                totalSalientes={totalSalientes}
                isConnected={isConnected}
            />
            <ConversManageView
                allConvers={convers}
                // Pasar las funciones como props si es necesario
            />
        </>
    );
};

export default ConversManage;
