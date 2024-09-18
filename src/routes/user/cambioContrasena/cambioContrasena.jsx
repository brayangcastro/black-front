import { useState } from "react";
import { CambioContrasenaView } from "./cambioContrasena-view"
import apiUrls from '../../../api';

import axios from 'axios';

import { useUser } from "@clerk/clerk-react";

const CambioContrasena = () => {
    //llamo al contexto de clerk para obtener el id del usuario
    const { user } = useUser();
    const idUsuario = user.id;

    const [newError, setNewError] = useState('');
    const [success, setSuccess] = useState('');

    const handleUpdatePassword = async (nuevaContrasena) => {
        try {
            const response = await axios.post(apiUrls.actualizarContrasena, {
                id_usuario: idUsuario,
                password: nuevaContrasena,
            });
            setSuccess('Contraseña actualizada correctamente');
            console.log(response.data); // Manejar la respuesta según tus necesidades
        } catch (error) {
            console.error(error);
            setNewError('Elija una contraseña más segura.')
        }
    };

    return (
        <CambioContrasenaView
            handlechangePass={handleUpdatePassword}
            newError={newError}
            success={success}
        />
    )
}
export default CambioContrasena