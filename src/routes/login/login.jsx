import { useState, useRef } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { Container, Card, Form, Button, InputGroup } from 'react-bootstrap';
import axios from 'axios'; // Importar Axios

import logoNeerd from '../../assets/img/blankas.jpg';
import hideIcon from '../../assets/icons/ojo_1.svg';
import showIcon from '../../assets/icons/ojo_0.svg';

import apiUrls from '../../api';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar si se muestra la contraseña o no
    const passwordRef = useRef('');
    const navigate = useNavigate();

    
    let location = useLocation();

    const handleSubmit = async () => {
        try {
            const response = await axios.post(apiUrls.login, {
                email,
                password: passwordRef.current.value // Obtener el valor de la contraseña desde el ref
            });

            if (response.status === 200) {
                if(response.data.token)
                {
                localStorage.setItem('userToken', response.data.token);
                navigate('/');
                //navigate('/lockscreen', { state: { from: location } });
                }
                window.location.reload(); // Recargar la página después de que handleSubmit termine
            } else {
                // Manejar otros códigos de estado si es necesario
            }
        } catch (error) {
            // Manejar errores de la solicitud
            console.error('Error:', error);
        }
      
    };

    return (
        <div className='login-bgnd'>
            <Container className='login d-flex align-items-center justify-content-center vh-100'>
                <Card className="card-login">
                    <Card.Body>
                        <Form>
                            <img src={logoNeerd} alt="logo neerd" className='logo mb-4' />
                            <h5 className='tituloiniciarsesion'>Inicie sesión para continuar</h5>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Control type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <InputGroup>
                                    <Form.Control type={showPassword ? "text" : "password"} placeholder="Contraseña" ref={passwordRef} />
                                    <Button className='btn-accion-gray' variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                        <img src={showPassword ? hideIcon : showIcon} alt={showPassword ? "Ocultar" : "Mostrar"} />
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                            <Button variant="success" onClick={handleSubmit} className='btn-signup'>
                                Iniciar sesión
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default LoginPage;