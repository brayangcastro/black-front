import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { format, parseISO, differenceInDays } from 'date-fns';
import { FaExclamationCircle, FaRegClock, FaCheckCircle, FaTimesCircle , FaWifi, FaExclamationTriangle} from 'react-icons/fa';
import axios from 'axios';
import apiUrls from '../api';
import { useUser } from '/src/UserContext';

import RefreshingImage from './refreshingImage'; // Componente para la imagen central

import logoEmpresa from '../assets/img/logo_ahumada.png';
import anuncio1 from '../assets/anuncios/sku-1.jpg';
import anuncio2 from '../assets/anuncios/sku-2.jpg';
import anuncio3 from '../assets/anuncios/sku-3.jpg';
import anuncio4 from '../assets/anuncios/sku-4.jpg';
import anuncio5 from '../assets/anuncios/sku-5.jpg';
import anuncio6 from '../assets/anuncios/sku-6.jpg';
import anuncio7 from '../assets/anuncios/sku-7.jpg';
import anuncio8 from '../assets/anuncios/sku-8.jpg';
import anuncio9 from '../assets/anuncios/sku-9.jpg';
import anuncio10 from '../assets/anuncios/sku-10.jpg';

const images = [
    anuncio1,
    anuncio2,
    anuncio3,
    anuncio4,
    anuncio5,
    anuncio6,
    anuncio7,
    anuncio8,
    anuncio9,
    anuncio10
];
// Componente para la barra deslizante
const SlidingBar = () => {
    return (
        <div style={{ 
            position: 'fixed', 
            top: 0, 
            width: '100%', 
            backgroundColor: '#000', 
            color: '#0f0', 
            overflow: 'hidden',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            zIndex: 9999 ,
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: 'bold',
            textAlign: 'center',
        }}>
            <div style={{ 
                whiteSpace: 'nowrap', 
                animation: 'scrollText 10s linear infinite'
            }}>
                Instrucciones: Por favor, ingrese su PIN para acceder.
            </div>
        </div>
    );
};

// Añadir estilos para la animación
const styles = `
@keyframes scrollText {
    0% { transform: translateX(300%); }
    100% { transform: translateX(-100%); }
}
`;



function AccessScreen() {
    const [pin, setPin] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [countdown, setCountdown] = useState(7);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || "/";

    const { setUser } = useUser();
    const wsRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
    
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
    
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    

    const abrir_barrera = async () => {
        try {
          const myobj = { 'mensaje': `{"Nombre":"Abrir_Barrera","Relay":"12"}` };
          const { data } = await axios.post(apiUrls.enviarWS, myobj);
          console.log("Respuesta de sensores", data);
        } catch (error) {
          console.error('Error al apagar el relay:', error);
        }
      };
    
      const cerrar_barrera = async () => {
        try {
          const myobj = { 'mensaje': `{"Nombre":"Cerrar_Barrera","Relay":"12"}` };
          const { data } = await axios.post(apiUrls.enviarWS, myobj);
          console.log("Respuesta de sensores", data);
        } catch (error) {
          console.error('Error al apagar el relay:', error);
        }
      };

      const comandoAbrir = async () => {
        try {
            
          const { data } = await axios.post(apiUrls.controlarGPIO, { comando: 'abrir' });
          console.log("Respuesta de comandoAbrir", data);
        } catch (error) {
          console.error('Error al comandoAbrir:', error);
        }
      };


      
    useEffect(() => {
        const connectWebSocket = () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }

            if (wsRef.current) {
                wsRef.current.onopen = null;
                wsRef.current.onclose = null;
                wsRef.current.onerror = null;
                wsRef.current.onmessage = null;
                wsRef.current.close();
            }

            const socket = new WebSocket('ws://localhost:3001');
            wsRef.current = socket;

            socket.onopen = () => {
                console.log('Conectado al servidor WebSocket');
                reconnectAttemptsRef.current = 0;
            };

            socket.onclose = () => {
                console.log('Conexión WebSocket cerrada. Intentando reconectar...');
                if (reconnectAttemptsRef.current < 3) {
                    reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
                    reconnectAttemptsRef.current += 1;
                } else {
                    console.error('Número máximo de intentos de reconexión alcanzado.');
                }
            };

            socket.onerror = (error) => {
                console.error('Error en la conexión WebSocket:', error);
            };

            socket.onmessage = (event) => {
                console.log('Mensaje del servidor:', event.data);
            
                let messageData;
                if (typeof event.data !== 'string') {
                    console.log('El mensaje no es una cadena, decodificando el buffer...');
                    messageData = new TextDecoder().decode(event.data);
                } else {
                    console.log('El mensaje es una cadena.');
                    messageData = event.data;
                }
            
                console.log('Datos del mensaje después de la verificación del tipo:', messageData);
            
                try {
                    // Elimina comillas adicionales si existen
                    if (messageData.startsWith('"') && messageData.endsWith('"')) {
                        messageData = messageData.slice(1, -1);
                    }
            
                    // Analiza el mensaje como JSON
                    const data = JSON.parse(messageData.replace(/\\"/g, '"'));
                    console.log('Objeto JSON parseado:', data);
            
                    if (data && typeof data === 'object') {
                        console.log('El objeto JSON es válido.');
                        console.log('Contenido del objeto JSON:', data);
            
                        if (data.ID) console.log('ID del json:', data.ID);
                        else console.log('La propiedad ID no existe en el objeto JSON');
            
                        if (data.Nombre) console.log('Nombre del json:', data.Nombre);
                        else console.log('La propiedad Nombre no existe en el objeto JSON');
            
                        if (data.Celular) console.log('Celular del json:', data.Celular);
                        else console.log('La propiedad Celular no existe en el objeto JSON');
            
                        if (data.Email) console.log('Email del json:', data.Email);
                        else console.log('La propiedad Email no existe en el objeto JSON');
            
                        if (data.Direccion) console.log('Direccion del json:', data.Direccion);
                        else console.log('La propiedad Direccion no existe en el objeto JSON');
            if(data.ID)
                {
                        setUserData(data);
                        setShowModal(true);
                        setCountdown(7);
                    }
                    } else {
                        console.error('El objeto JSON no es válido:', data);
                    }
                } catch (error) {
                    console.error('Error al analizar el JSON:', error);
                }
            };
                                    
        };            
        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (showModal) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev === 1) {
                        clearInterval(timer);
                        handleClose();
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [showModal]);

    useEffect(() => {
        const imageChangeInterval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 10000); // Cambiar imagen cada 10 segundos

        return () => clearInterval(imageChangeInterval);
    }, []);


    const getMembershipStatus = (expiryDate) => {
        const today = new Date();
        const expiry = parseISO(expiryDate);
        const daysDifference = differenceInDays(expiry, today);
        if (daysDifference < -7) {
            return { status: 'Vencido', color: 'red', icon: <FaTimesCircle />, days: daysDifference };
        } else if (daysDifference < 0) {
            return { status: 'Vencido reciente', color: 'orange', icon: <FaExclamationCircle />, days: daysDifference };
        } else if (daysDifference === 0) {
            return { status: 'Vence hoy', color: 'purple', icon: <FaRegClock />, days: daysDifference };
        } else if (daysDifference <= 7) {
            return { status: 'Próximo a vencer', color: 'yellow', icon: <FaExclamationCircle />, days: daysDifference };
        } else {
            return { status: 'Activo', color: 'green', icon: <FaCheckCircle />, days: daysDifference };
        }
    };


    const verifyPin = async () => {
        try {
            const response = await axios.post(apiUrls.accesoGeneral, { codigo: pin });
            console.log("Response",response)
            console.log("al pin",pin)
            if (pin == "accesoadmin!") {
                setShowModal(false);
                setUser(userData);
                navigate(fromPage);
            }

            
            if (response.data[0] && response.data[0].ID) {
                
                    setUserData(response.data[0]);
                    setShowModal(true);
                    setCountdown(7);
                    const membershipStatus = response.data[0] ? getMembershipStatus(response.data[0].Fecha) : {};
                    console.log("DIAS response.data[0].Fecha",response.data[0].Fecha )
                    console.log("membershipStatus",membershipStatus )
                    console.log("DIAS RESTANTEssssS",membershipStatus.days )
                    if(membershipStatus.days >=0)
                        {
                           // abrir_barrera();
                            comandoAbrir();
                        }
             
            } else {
                console.error("PIN incorrecto. Inténtalo de nuevo.");
                setPin('');
            }
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            setPin('');
        }
    };

    const handleClose = () => {
      setShowModal(false);
      setPin('');
        //setUser(userData);
        //navigate(fromPage);
    };

  
    const membershipStatus = userData ? getMembershipStatus(userData.Fecha) : {};

    return (
        <div style={{   backgroundColor: '#000',display: 'flex', height: '100vh', textAlign: 'center' }}>
            <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 10000 }}>
    {isOnline ? <FaWifi style={{  backgroundColor: '#000',color: 'green', fontSize: '44px' }} /> : <FaExclamationTriangle style={{ color: 'red', fontSize: '24px' }} />}
</div>   

            {/* Agregar barra deslizante */}
            <SlidingBar />
            <style>{styles}</style>
            <div style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={images[currentImageIndex]} alt="Logo Empresa" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0', boxShadow: '-5px 0 10px rgba(0,0,0,0.2)' }}>
           
            <div style={{ width: '100%', height: '500px',   display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RefreshingImage
                    imageUrl={import.meta.env.VITE_APP_IMAGEN_ACTUAL}
                    refreshInterval={1000} // Actualiza cada segundo
                    width="70%"
                />
            </div>

                <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value )}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            verifyPin();
                        }
                    }}
                    style={{
                        fontSize: '24px',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        width: '200px',
                        padding: '15px',
                        borderRadius: '15px',
                        border: '1px solid #ccc',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }}
                    autoFocus
                />
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '15px',
                    padding: '20px'
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 70px)',
                        gap: '15px',
                        justifyContent: 'center'
                    }}>
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((number) => (
                            <button
                                key={number}
                                onClick={() => setPin(pin + number.toString())}
                                style={{
                                    width: '70px',
                                    height: '50px',
                                    fontSize: '22px',
                                    fontWeight: 'bold',
                                    borderRadius: '15px',
                                    border: 'none',
                                    backgroundColor: '#ffffff',
                                    color: '#333',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                {number}
                            </button>
                        ))}
                        <div style={{ width: '70px' }}></div>
                        <button
                            onClick={() => setPin(pin + '0')}
                            style={{
                                width: '70px',
                                height: '50px',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                borderRadius: '15px',
                                border: 'none',
                                backgroundColor: '#ffffff',
                                color: '#333',
                                cursor: 'pointer',
                                userSelect: 'none',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            0
                        </button>

                        <button
                             onClick={verifyPin}
                            style={{
                                width: '70px',
                                height: '50px',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                borderRadius: '15px',
                                border: 'none',
                                backgroundColor: '#ffffff',
                                color: '#333',
                                cursor: 'pointer',
                                userSelect: 'none',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            #
                        </button>
                        <div style={{ width: '70px' }}></div>
                    </div>
                    
                </div>
            </div>
            {userData && (
                <Modal show={showModal} onHide={handleClose} centered dialogClassName="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>Control de Acceso</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={userData.foto}
                                alt="Foto del Cliente"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    marginRight: '20px',
                                    border: '3px solid #ddd'
                                }}
                            />
                            <div style={{ textAlign: 'left' }}>
                                <h2 style={{ fontSize: '36px', padding: '10px 20px', fontWeight: 'bold' }}>{userData.Nombre}</h2>
                                <p style={{ fontSize: '19px', color: '#000', padding: '10px 20px', fontWeight: 'bold' }}>
                                    Fecha de renovación de membresía: {userData.Fecha}
                                </p>
                                <p style={{ fontSize: '26px', padding: '10px 20px', fontWeight: 'bold' }}>
                                    Días restantes: {membershipStatus.days}
                                </p>
                                <p style={{
                                    fontSize: '36px',
                                    padding: '10px 20px',
                                    backgroundColor: membershipStatus.color,
                                    fontWeight: 'bold',
                                    borderRadius: '10px',
                                    color: '#fff'
                                }}>
                                    {membershipStatus.icon} {membershipStatus.status}
                                </p>
                                <p style={{ fontSize: '16px', color: '#777' }}>El modal se cerrará en {countdown} segundos</p>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default AccessScreen;
