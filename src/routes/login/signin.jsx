import { useState } from 'react'
import SiginView from './signin-view'
import axios from 'axios'
import apiUrls from '../../api'

const Signin = () => {

    const [user, setUser] = useState({
        Nombre_usuario: '',
        Apellido_usuario: '',
        Correo_usuario: '',
        Telefono_usuario: '',
        Codigo_acceso: '',
        Estado_usuario: '',
        Ciudad_usuario: '',
    });

    const [clave, setClave] = useState('');

    const [registrado, setRegistrado] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    

    const handleCreate = async () => {
        try {
            // Hacer la solicitud POST a la API utilizando Axios
            const response = await axios.post(apiUrls.addUser, user);
            if (response.data && response.data.error) {
                if (response.data.error === 'Invalid Code.') {
                    alert("Código inválido");
                    setErrorMessage('Error al registrarse. Código de acceso inválido.');
                } else  if (response.data.error === 'That email address is taken. Please try another.') {
                        alert("Email ya registrado");
                        setErrorMessage('Error al registrarse. Este correo ya ha sido utilizado.');
                    } else {
                    
                        setErrorMessage('Error al registrarse. Asegúrese de ingresar sus datos con el formato correcto.');
                    alert(response.data.error); // Manejar otros mensajes de error
                }
                setRegistrado(false);
                setError(true);
               
   
            } else {
                setClave(response.data); // Asumiendo que la contraseña está en response.data
                setRegistrado(true);
                setError(false);
            }
    
  

            // Hacer algo con la respuesta de la API
            console.log('Respuesta de la API:', response.data);
        } catch (error) {
            // Manejar errores de la API o de red
            console.error('Error al hacer la solicitud:', error.message);
            setRegistrado(false);
            setError(true);
        }
    };

    return (
        <>
            <SiginView
                user={user}
                setUser={setUser}
                clave={clave}
                handleCreateUser={handleCreate}
                registrado={registrado}
                error={error}
                errorMessage={errorMessage} 
            />
        </>
    )
}

export default Signin
