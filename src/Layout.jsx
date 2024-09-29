import { Container, Nav, Navbar, NavLink, NavItem, Button, Offcanvas, ListGroup } from 'react-bootstrap';
import logoNeerd from './assets/img/Logo_BZ.svg';
import { NumericKeypad, LockScreen } from './components/components';

import Iconlogout from './assets/icons/logout.svg'

import { useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {faGavel,faTachometerAlt,
    faUser,  faMoneyBill, faUserGraduate, faTrophy, faBook, faTicketAlt, faReceipt, faUserCircle, faTable,
    faClipboardList, faCashRegister, faHome, faSignOutAlt,faTools
} from '@fortawesome/free-solid-svg-icons';


import { Link, useNavigate, useLocation } from 'react-router-dom';


import { useUser } from '/src/UserContext'; // Asegúrate de que la ruta sea correcta

import axios from 'axios'; // Importa axios para hacer la solicitud HTTP


import apiUrls from './api';


const cajonUrl = import.meta.env.VITE_APP_ABRIR_CAJON;

function Layout({ children }) {

    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [inputValue, setInputValue] = useState(""); // Estado para manejar la entrada del teclado
    const [isActive, setIsActive] = useState(true);
    const handleOffcanvasToggle = () => setShowOffcanvas(!showOffcanvas);
    const navigate = useNavigate();

    let location = useLocation();


    const { user } = useUser();

    const nombreUsuario = user?.Nombre || '';



    useEffect(() => {
        let timer;
        const handleActivity = () => {
            setIsActive(true);
            clearTimeout(timer);
            timer = setTimeout(() => setIsActive(false), 60000); // 30 segundos
        };

        // Eventos que consideras como actividad del usuario
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        // Iniciar el temporizador por primera vez
        timer = setTimeout(() => setIsActive(false), 30000); // 30 segundos
        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, []);

    useEffect(() => {
        // Si el usuario está inactivo, redirigir a la pantalla de bloqueo
        if (!isActive  && location.pathname !== '/' && location.pathname !== '/ventas/1') {
           // navigate('/lockscreen', { state: { from: location } });
        }
    }, [isActive, navigate]);

    const handleInput = (value) => {
        setInputValue(prev => prev + value); // Concatena el nuevo valor al estado actual
    };

    const handleEnter = () => {
        // Aquí manejas lo que sucede cuando se presiona entrar
        console.log(inputValue);
        // Puedes resetear el inputValue o hacer otra acción
    };


    //llamo al contexto de clerk para obtener la public metadata del usuario
    // const { user } =1;

    const tipoUsuario = 1;


    const handleLogout = () => {
        // Aquí borramos el token del almacenamiento local y cualquier otro estado de sesión
        localStorage.removeItem('userToken');

        // Navega al usuario hacia la página de login
        navigate('/');
        window.location.reload(); // Recargar la página después de que handleSubmit termine
        // Si estás utilizando algún estado global o contexto, asegúrate de actualizarlo aquí
    };

    const handleBlock = (event) => {
        event.preventDefault(); // Esto previene el comportamiento por defecto del enlace
        console.log("handleBlock");
        // Aquí ya no es necesario borrar el token o manejar el estado de sesión, solo redirigir
        navigate('/lockscreen', { state: { from: location } });
    };

    const handleAbrirCajon = () => {
        // URL de tu archivo PHP que maneja la apertura del cajón
        const url = cajonUrl;

        axios.get(url)
            .then(response => {
                // Aquí manejas la respuesta. Por ejemplo, mostrando un mensaje al usuario.
                console.log('Cajón abierto con éxito');
            })
            .catch(error => {
                // Aquí manejas cualquier error que ocurra durante la solicitud.
                console.error('Error al abrir el cajón:', error);
            });
    };

    const apagarSistema = async () => {
        try {
            const response = await axios.post(apiUrls.ejecutarComando, { command:"sudo poweroff" });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(`Error: ${error.response ? error.response.data.error : error.message}`);
        }
    };
    


    return (
        <>
         <Navbar style={{ backgroundColor: '#505050' }} expand="lg">
    <Container fluid>
        {/* Contenedor para el logo en el extremo izquierdo */}
        <Navbar.Brand onClick={handleOffcanvasToggle}>
           
                <img
                    alt="Logo"
                    src={logoNeerd}
                    width="auto"
                    height="40px"
                    className="d-inline-block align-top"
                />
           
        </Navbar.Brand>

        
        <div className="mx-3 border-end"></div>
                        <div className="mx-3 border-end"></div>


     
                        <Nav className="d-none d-md-flex w-100 justify-content-between align-items-center">
 
 

            <div className="d-flex align-items-center">
            <Link to="/calendispo" className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faReceipt} size="2x" />
                    <span className="ms-2">RESERVA</span>
                </Link>
                <div className="mx-3 border-end"></div>
                <Link to="/ventas" className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faReceipt} size="2x" />
                    <span className="ms-2">VENTA</span>
                </Link>
                <div className="mx-3 border-end"></div>
 
                <div className="mx-3 border-end"></div>

                <Link to="/calendario" className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faTable} size="2x" />
                    <span className="ms-2">AGENDA</span>
                </Link>
                <div className="mx-3 border-end"></div>

                <Link to="/clientes" className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faUser} size="2x" />
                    <span className="ms-2">CLIENTES</span>
                </Link>
            </div>
 


            <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUserCircle} size="3x" style={{ color: '#FFFFFF' }} />
                <span style={{ color: '#FFFFFF' }} className="ms-2">{nombreUsuario}</span>
            </div>

            <div className="d-flex align-items-center">
                <Link to="/soporte" className="nav-link d-flex align-items-center">
                    <FontAwesomeIcon icon={faTools} size="2x" />
                    <span className="ms-2">SOPORTE</span>
                </Link>
                <div className="mx-3 border-end"></div>

                <NavLink href="/" onClick={handleBlock}>
                    Salir <FontAwesomeIcon icon={faSignOutAlt} />
                </NavLink>
            </div>

            <Button variant="outline-light" onClick={handleOffcanvasToggle}>
  ☰ {/* Icono de menú */}
</Button>

        </Nav>
    </Container>
</Navbar>


            <div className="linea"></div>

            
            <Offcanvas show={showOffcanvas} onHide={handleOffcanvasToggle} placement="start" backdrop={false} className='offcanvas-chico'>
                <Offcanvas.Header>
                    <Offcanvas.Title>
                   
                <img onClick={handleOffcanvasToggle}
                    alt="Logo"
                    src={logoNeerd}
                    width="auto"
                    height="40px"
                    className="d-inline-block align-top" 
                />  
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <ListGroup>
                        <Link to="/" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Inicio</ListGroup.Item></Link>{/* visible para ambos */}
                        {tipoUsuario === 1 && (
                            <>
                                {/* visible solo para administrador */}

                                {/* 
                                <Link to="/torneos" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Torneos</ListGroup.Item></Link>
                                <Link to="/mesas" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Mesas</ListGroup.Item></Link> 
                          
                     */}
                                <Link to="/chatbot" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Chatbot</ListGroup.Item></Link>
                                <Link to="/dashboard" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Dashboard</ListGroup.Item></Link>
                                <Link to="/clientes" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Clientes</ListGroup.Item></Link>
                                <Link to="/usuarios" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Usuarios</ListGroup.Item></Link>

                                <Link to="/boletos" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Boletos</ListGroup.Item></Link>

                                <Link to="/rifas" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Conferencias</ListGroup.Item></Link>

                                <Link to="/ordenes" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Órdenes</ListGroup.Item></Link>
                                <Link to="/ventas" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Ventas</ListGroup.Item></Link>
                                <Link to="/tickets" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Tickets</ListGroup.Item></Link>

                                <Link to="/inventario" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Inventario</ListGroup.Item></Link>
                                <Link to="/ingreso" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Ingreso</ListGroup.Item></Link>

                                <Link to="/products" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Productos</ListGroup.Item></Link>
                                <Link to="/calendario" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Calendario</ListGroup.Item></Link>
                                <Link to="/soporte" className="linkBtn-black" onClick={handleOffcanvasToggle}><ListGroup.Item className='Item'>Soporte</ListGroup.Item></Link>
    

                            </>
                        )}
                        {tipoUsuario === 0 && (
                            <>
                                <Link to="/contrasena" onClick={handleOffcanvasToggle} className="linkBtn-black"><ListGroup.Item className='Item'>Cambiar contraseña</ListGroup.Item></Link>
                                {/* visible solo para estudiante 
                                <Link to="/info" onClick={handleOffcanvasToggle} className="linkBtn-black"><ListGroup.Item className='Item'>Información personal</ListGroup.Item></Link>
                                <Link to="/context" onClick={handleOffcanvasToggle} className="linkBtn-black"><ListGroup.Item className='Item'>Contexto personal</ListGroup.Item></Link>
                                <Link to="/config" onClick={handleOffcanvasToggle} className="linkBtn-black"><ListGroup.Item className='Item'>Configuración</ListGroup.Item></Link>*/}
                            </>
                        )}
                        <ListGroup.Item action onClick={handleLogout} className="linkBtn-black">
                            Cerrar sesión
                            <img src={Iconlogout} alt="logout" height="25" className="ms-2" />
                        </ListGroup.Item>
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>

            {children}

        </>
    );
}

export default Layout;