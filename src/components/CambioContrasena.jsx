import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Form, Alert, Container, Row, Col } from 'react-bootstrap';

const CambioContrasena = (props) => {

    const { handlechangePass, newError, success } = props;

    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');

    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (newError) {
            setError(newError);
        }
    }, [newError]);

    const handleConfirmarContrasenaChange = (e) => {
        setConfirmarContrasena(e.target.value);
        setError('');
    };

    useEffect(() => {
        if (success) {
            setSuccessMessage(success);
        }
    }, [success]);

    const guardarCambios = () => {
        if (nuevaContrasena === confirmarContrasena && nuevaContrasena !== '') {
            handlechangePass(nuevaContrasena);
        }
        else if (nuevaContrasena === '' || confirmarContrasena === '') {
            setError('La nueva contraseña no puede estar vacía');
        }
        else {
            setError('Las contraseñas deben coincidir');
        }
    };

    return (
        <>
            <Container>
                <Row className="text-center">
                    <Col xs={12} md={6} className="mx-auto">
                        <h4>Actualizar Contraseña</h4>
                        <p>Ingrese su nueva contraseña</p>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">🔒</InputGroup.Text>
                            <Form.Control
                                type='password'
                                placeholder="Nueva contraseña"
                                aria-label="NewPass"
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text id="basic-addon1">❕</InputGroup.Text>
                            <Form.Control
                                type='password'
                                placeholder="Confirmar nueva contraseña"
                                aria-label="NewPassConfirm"
                                value={confirmarContrasena}
                                onChange={handleConfirmarContrasenaChange}
                            />
                        </InputGroup>
                        {error &&
                            <Alert variant='danger'>
                                {error}
                            </Alert>
                        }
                        {successMessage &&
                            <Alert variant='success'>
                                {successMessage}
                            </Alert>
                        }
                        <Button
                            variant="success"
                            onClick={guardarCambios}
                            disabled={error !== ''}
                        >
                            Guardar Cambios
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CambioContrasena;