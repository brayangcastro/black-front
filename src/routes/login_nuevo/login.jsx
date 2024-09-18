import React, { useState } from 'react';
import axios from 'axios';
import apiUrls from '../../../api';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Correctamente invocado dentro del componente

    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post(apiUrls.iniciarSesion, { 
            usuario: username,
            password: password
          })
          .then(response => {
            // Manejar la respuesta exitosa
            if (response.data && response.data.success) {
              console.log("ID del usuario:", response.data.data.ID_local);
              localStorage.setItem('ID_cliente', response.data.data.ID);
              localStorage.setItem('ID_local', response.data.data.ID_local);
              if(response.data.data.ID>0)
              navigate('/test'); // Redirige al usuario a '/main'
              else
              navigate('/main');
              // Aquí podrías querer hacer algo con el ID del usuario, como guardar en el estado o en localStorage
            } else {
              // Manejar el caso de que success sea false
              console.error('Inicio de sesión no exitoso:', response.data);
            }
          })
          .catch(error => {
            // Manejar el error
            console.error('Error de autenticación', error);
          });
          
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
