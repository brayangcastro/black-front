import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoEmpresa from '../assets/img/blankas.jpg'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';
import apiUrls from '../api';

import { useUser } from '/src/UserContext'; // Asegúrate de que la ruta sea correcta


// Dentro de tu función LockScreen

function LockScreen() {
    const [pin, setPin] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || "/";

    
const { setUser } = useUser();
    const verifyPin  = async () => {
        try {

           
            const response = await  axios.post(apiUrls.accesoCodigo, 
             
                 {   codigo:pin}

            );
            console.log("Rrespiuesta",response)
            if (response.data[0].ID) {
                setUser(response.data[0]); // Aquí asumiendo que response.data[0] contiene los datos del usuario
                navigate(fromPage);
              }
      
      } catch (error) {
          console.error("Error al obtener los datos de la gestionarNuevaOrden:", error);
      }
        if (pin === "") { // Suponiendo que "1234" es el PIN correcto
           // navigate(fromPage); // Redirige al usuario de vuelta a la página desde la que vino
        } else {
            console.error("PIN incorrecto. Inténtalo de nuevo.");
            setPin(''); // Limpia el PIN
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', textAlign: 'center', background: '#FFFFFF'}}>
            {/* Sección para el logo */}
            <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={logoEmpresa} alt="Logo Empresa" style={{ maxWidth: '100%', maxHeight: '60%', objectFit: 'contain' }} />
            </div>
    
            {/* Sección para el teclado numérico, ahora ajustada como una franja que se extiende verticalmente */}
            <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgb(70,86,108)', boxShadow: '-5px 0 10px rgba(0,0,0,0.2)' }}>
                {/* Input para mostrar y editar el PIN, ahora como password */}
                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} // Asegúrate de que solo se puedan ingresar números
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            verifyPin();
                        }
                    }} // Añadido para manejar la tecla Enter
                    style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 'bold', textAlign: 'center', width: '180px', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                    autoFocus
                />
    
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px', padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 60px)', gap: '10px', justifyContent: 'center' }}>
                        {[7,8,9,4,5,6,1, 2, 3].map((number) => (
                            <button key={number} onClick={() => setPin(pin + number.toString())} style={{ width: '60px', height: '60px', fontSize: '20px', fontWeight: 'bold', borderRadius: '10px', border: 'none', backgroundColor: '#ffffff', color: '#333', cursor: 'pointer', userSelect: 'none' }}>
                                {number}
                            </button>
                        ))}
                        <div style={{ width: '60px' }}></div> {/* Espaciador para alinear el '0' */}
                        <button onClick={() => setPin(pin + '0')} style={{ width: '60px', height: '60px', fontSize: '20px', fontWeight: 'bold', borderRadius: '10px', border: 'none', backgroundColor: '#ffffff', color: '#333', cursor: 'pointer', userSelect: 'none' }}>
                            0
                        </button>
                        <div style={{ width: '60px' }}></div> {/* Espaciador */}
                    </div>
                    <button onClick={verifyPin} style={{ marginTop: '20px', fontSize: '18px', padding: '10px 20px', borderRadius: '10px', width: '100%', border: 'none', backgroundColor: '#ffffff', color: '#333', cursor: 'pointer', userSelect: 'none' }}>
                        Desbloquear
                    </button>
                </div>
            </div>
        </div>
    );
    
    
}

export default LockScreen;
