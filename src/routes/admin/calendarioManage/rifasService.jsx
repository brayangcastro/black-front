import axios from 'axios';

// Define la URL base de tu backend
const API_BASE_URL = 'http://localhost:3001/rifas'; // Asegúrate de que coincide con la configuración del backend

// Servicio para obtener boletos por evento
export const obtenerBoletosPorEvento = async (eventoID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/eventos/${eventoID}/boletos`);
        return response.data; // Retorna los boletos obtenidos
    } catch (error) {
        console.error("Error al obtener los boletos:", error);
        return [];
    }
};

// Servicio para obtener la información del evento
export const obtenerEventoPorID = async (eventoID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/eventos/${eventoID}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el evento:", error);
        return null;
    }
};

// Servicio para cambiar el estado de un boleto
export const cambiarEstadoBoleto = async (boletoID, nuevoEstado) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/boletos/cambiar-estado`, {
            boletoID,
            nuevoEstado
        });
        return response.data;
    } catch (error) {
        console.error("Error al cambiar el estado del boleto:", error);
        return null;
    }
};
