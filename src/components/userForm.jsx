import React, { useState, useEffect } from 'react';
import { Button, Modal, InputGroup, Form, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Ajusta estos iconos según necesites

const UserForm = (props) => {
    const { showUserForm, setShowUserForm, handleCreate, setUser, user, isEditing, setEditingUser, generateUniqueCode, checkCodeUniqueness, updateUserCode } = props;
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const [showCodeModal, setShowCodeModal] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false); // Estado para mostrar el input de código manual
    const [generatedCode, setGeneratedCode] = useState('');
    const [manualCode, setManualCode] = useState(''); // Estado para el código manual
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (user.Descripcion) {
            try {
                const descriptionData = JSON.parse(user.Descripcion);
                setUser((prevUser) => ({
                    ...prevUser,
                    ...descriptionData
                }));
            } catch (error) {
                console.error('Error parsing JSON from Descripcion', error);
            }
        }
    }, [user.Descripcion, setUser]);


    const handleClose = () => {
        setShowUserForm(false);
        setShowSuccessMessage(false);
        setUser({}); // Limpia el formulario después de cerrarlo
    };

    // Resetea el código manual cuando se abre el modal
    useEffect(() => {
        if (showCodeModal) {
            setManualCode('');
        }
    }, [showCodeModal]);

    const handleOpenCodeModal = () => {
        setShowCodeModal(true);
    };

    const handleCloseCodeModal = () => {
        setShowCodeModal(false);
    };

    const handleGenerateRandomCode = async () => {
        try {
            console.log('Generando código único...');
            const uniqueCode = await generateUniqueCode();
            console.log('Código único generado:', uniqueCode);
            setManualCode(uniqueCode);
        } catch (error) {
            console.error('Failed to generate a unique code:', error);
        }
    };

    const handleSaveNewCode = async () => {
        try {
            console.log("MANUAL CODE", manualCode)
            console.log("user.ID ", user.ID)

            // Verificar si el código manual ya existe
            const isUnique = await checkCodeUniqueness(manualCode);

            if (!isUnique) {
                setErrorMessage('El código ingresado ya está en uso. Por favor, elija un código diferente.');
                setShowErrorModal(true);
            } else {
                // Llamada a la API para actualizar el código del usuario
                await updateUserCode({ ID: user.ID, Codigo: manualCode });

                // Actualiza el estado del usuario con el nuevo código
                setUser((prevUser) => ({
                    ...prevUser,
                    Codigo: manualCode,
                }));

                // Mostrar el modal de confirmación
                setShowCodeModal(false);
                setShowConfirmationModal(true);
            }
        } catch (error) {
            console.error('Error al actualizar el código del usuario:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));

    };

    const handleCreateUser = () => {
        handleCreate(); // Implementa la creación del usuario aquí
        setShowSuccessMessage(true);
        setShowUserForm(false);
        setUser({}); // Limpia el formulario después de la creación exitosa
    };

    // Función para abrir el modal de documentos
    const handleOpenDocuments = () => {
        // Implementa la apertura del modal de documentos aquí
        console.log("Abrir modal de documentos");
    };

    return (
        <>
            <Modal show={showUserForm || showSuccessMessage} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSuccessMessage ? (
                        <Alert variant="success" className="mt-3">
                            {isEditing ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente'}
                        </Alert>
                    ) : (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    <Form.Control
                                        name="Nombre"
                                        value={user.Nombre || ''}
                                        onChange={handleInputChange}
                                        placeholder="Escriba su nombre completo"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Fecha de Nacimiento</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><i className="bi bi-calendar"></i></InputGroup.Text>
                                    <Form.Control
                                        type="date"
                                        name="FechaNacimiento"
                                        value={user.FechaNacimiento || ''}
                                        onChange={handleInputChange}
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Dirección</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><i className="bi bi-house-door-fill"></i></InputGroup.Text>
                                    <Form.Control
                                        name="Direccion"
                                        value={user.Direccion || ''}
                                        onChange={handleInputChange}
                                        placeholder="Escriba su dirección"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Celular</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-telephone-fill"></i></InputGroup.Text>
                                            <Form.Control
                                                name="Celular"
                                                value={user.Celular || ''}
                                                onChange={handleInputChange}
                                                placeholder="Número de celular"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Celular Alternativo</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-telephone-plus-fill"></i></InputGroup.Text>
                                            <Form.Control
                                                name="Celular2"
                                                value={user.Celular2 || ''}
                                                onChange={handleInputChange}
                                                placeholder="Número de celular alternativo"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Código Actual</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text><i className="bi bi-person-badge"></i></InputGroup.Text>
                                            <Form.Control
                                                name="Codigo"
                                                value={user.Codigo || ''}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Button variant="primary" onClick={handleOpenCodeModal}>
                                            Renovar Código
                                        </Button>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Observaciones</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text><i className="bi bi-textarea-resize"></i></InputGroup.Text>
                                    <Form.Control
                                        as="textarea"
                                        name="Observaciones"
                                        value={user.Observaciones || ''}
                                        onChange={handleInputChange}
                                        placeholder="Escriba cualquier observación aquí"
                                    />
                                </InputGroup>
                            </Form.Group>

                            <Button variant="secondary" onClick={handleOpenDocuments}>
                                <i className="bi bi-file-earmark-text"></i> Documentos
                            </Button>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {showSuccessMessage ? (
                        <Button variant="secondary" onClick={handleClose}>
                            <FontAwesomeIcon icon={faTimesCircle} /> Cerrar
                        </Button>
                    ) : (
                        <>
                            <Button variant="secondary" onClick={handleClose}>
                                Cancelar
                            </Button>

                            <Button variant="success" onClick={handleCreateUser}>
                                {isEditing ? 'Actualizar' : 'Crear'}
                            </Button>
                        </>
                    )}
                </Modal.Footer>

            </Modal>

            <Modal show={showCodeModal} onHide={handleCloseCodeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Renovar Código</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Código Actual</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><i className="bi bi-person-badge"></i></InputGroup.Text>
                            <Form.Control
                                name="Codigo"
                                value={user.Codigo || ''}
                                onChange={handleInputChange}
                                disabled
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nuevo Código</Form.Label>
                        <InputGroup>
                            <InputGroup.Text><i className="bi bi-key"></i></InputGroup.Text>
                            <Form.Control
                                name="CodigoManual"
                                placeholder="Ingrese el código"
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value)}
                                maxLength={4}
                            />
                        </InputGroup>
                        <Row className="mt-2">
                            <Col>
                                <Button variant="secondary" onClick={handleGenerateRandomCode}>
                                    Generar Código Random
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCodeModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveNewCode}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: '#BEBEBE', color: 'black' }}>
                    <Modal.Title>Nuevo Código Asignado</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#E1DDDD', color: 'black' }}>
                    El nuevo código de <strong>{user.Nombre}</strong> es <strong>{manualCode}</strong>
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#E1DDDD', color: 'black' }}>
                    <Button variant="primary" onClick={() => setShowConfirmationModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton style={{ backgroundColor: '#C8C1C1', color: 'black' }}>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#C8C1C1', color: 'black'}}>
                    {errorMessage}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#C8C1C1', color: 'black' }}>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default UserForm;
