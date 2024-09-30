import axios from 'axios';
import apiUrls from '../../../api';  // Asegúrate de que la ruta sea correcta

// Servicio para obtener boletos por evento
export const obtenerBoletosPorEvento = async (eventoID) => {
    try {
        const response = await axios.get(apiUrls.getBoletosPorEvento(eventoID)); // Usamos apiUrls
        return response.data; // Retorna los boletos obtenidos
    } catch (error) {
        console.error("Error al obtener los boletos:", error);
        return [];
    }
};

// Servicio para obtener la información del evento
export const obtenerEventoPorID = async (eventoID) => {
    try {
        const response = await axios.get(apiUrls.getEventoPorID(eventoID)); // Usamos apiUrls
        return response.data;
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        return null;
    }
};

// Servicio para cambiar el estado de un boleto
export const cambiarEstadoBoleto = async (boletoID, nuevoEstado) => {
    try {
        const response = await axios.put(apiUrls.cambiarEstadoBoleto, {  // Usamos apiUrls
            boletoID,
            nuevoEstado
        });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el estado del boleto:", error);
        return null;
    }
};
