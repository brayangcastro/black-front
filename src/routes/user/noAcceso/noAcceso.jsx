import { useState } from "react";
import axios from "axios";
import NoAccesoView from "./noAcceso-view";
import apiUrls from '../../../api';

import { useUser } from "@clerk/clerk-react";

import { useNavigate } from 'react-router-dom';
const NoAcceso = () => {

    const navigate = useNavigate(); // Hook para la navegación
  

    const [showError, setShowError] = useState(false);

    const { user } = useUser();
    const id_usuario = user.id;

    const handleValidarCodigo = async (codigo) => {
        try {
            const response = await axios.post(apiUrls.validateCode, { codigo, id_usuario });

            // Actualizar la página después de que la solicitud sea exitosa
            if (response.data) {
               //  navigate('/test');
               window.location.reload();
            } else {
                setShowError(true);
            }
        } catch (error) {
            console.error("Error al llamar a la API:", error.message);
        }
    };

    return (
        <>
            <NoAccesoView
                handleValidarCodigo={handleValidarCodigo}
                showError={showError}
                setShowError={setShowError}
            />
        </>
    );
};

export default NoAcceso;