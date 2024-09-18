import { useRef, useState, useEffect } from 'react';
import './chatbotView.css'; // Asegúrate de tener un archivo CSS con los estilos necesarios.
import { FaRegCommentDots, FaUsers, FaClock, FaToggleOn, FaToggleOff } from 'react-icons/fa'; // Ejemplo usando react-icons

import { Container, Row, Col, Button, Form, ListGroup, Dropdown, DropdownButton } from 'react-bootstrap';

const ChatbotView = ({ activeUser, resumen, isChatbotConnected, handleSendMessage,
    toggleChatbotConnection,
    handleActiveMessageChange,
    activeMessage,
    context, onUserSelect, onContextChange, chatbotStatus, lastConversation, userCount,
    users, conversation, onSendMessage // Asumiendo que estos datos se pasarán como props.
}) => {
    const endOfMessagesRef = useRef(null);

    // Efecto para desplazar la vista a la última conversación
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    return (
        <>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <h4>Chatbot</h4>
                    </Col>
                </Row>
                <Row className="mb-3 d-flex justify-content-center">
                    <Col xs={6} md={2} className="resumen-item">
                        {isChatbotConnected ? <FaToggleOn /> : <FaToggleOff />}
                        <span>{isChatbotConnected ? 'Conectado' : 'Desconectado'}</span>
                    </Col>
                    <Col xs={6} md={2} className="resumen-item">
                        <Button variant='success' onClick={toggleChatbotConnection} className="toggle-connection-btn">
                            {isChatbotConnected ? 'Desactivar' : 'Activar'} Chatbot
                        </Button>
                    </Col>
                    <Col xs={6} md={2} className="resumen-item">
                        <FaRegCommentDots /><span>Mensajes: {resumen.totalMensajes}</span>
                    </Col>
                    <Col xs={6} md={2} className="resumen-item">
                        <FaUsers /><span>Usuarios: {resumen.totalUsuarios}</span>
                    </Col>
                    <Col xs={6} md={2} className="resumen-item">
                        <FaClock /><span>Recientes: {resumen.mensajesRecientes}</span>
                    </Col>
                </Row>
                <Row className="mb-3 chatbot-container">
                    <Col md={3} xs={12} className='mb-3'>
                        <h5>Usuarios</h5>
                        <DropdownButton title={'Usuarios'} id="dropdown-basic-button" variant="success" className="d-lg-none">
                            {users.map((user) => (
                                <Dropdown.ItemText
                                    key={user.id}
                                    onClick={() => onUserSelect(user.id)}
                                    className={activeUser === user.id ? 'active-user' : ''}
                                >
                                    {user.name}
                                </Dropdown.ItemText>
                            ))}
                        </DropdownButton >

                        <ListGroup
                            className="d-none d-lg-block"
                        >
                            {users.map((user) => (
                                <ListGroup.Item
                                    key={user.id}
                                    onClick={() => onUserSelect(user.id)}
                                    className={activeUser === user.id ? 'active-user' : ''}
                                >
                                    {user.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col className="conversation" md={8}>
                        <Row className="messages">
                            {[...conversation].reverse().map((msg, index) => (
                                <div
                                    key={index}
                                    className={`message ${msg.Origen === activeUser ? 'user-msg' : 'chatbot-msg'}`}
                                >
                                    <span>{msg.Info}</span>
                                    <span className="timestamp">{msg.Fecha}</span>
                                </div>
                            ))}
                            {/* Componente para enviar mensaje */}
                            <div className="messages">
                                {/* ...mensajes... */}
                                <div ref={endOfMessagesRef} /> {/* Referencia al final de los mensajes */}
                            </div>

                            {/* Control de texto y botón para enviar mensaje */}
                            <div className="new-message">
                                <Form.Control
                                    className="message-input"
                                    placeholder="Escribe un mensaje..."
                                    aria-label="msessage"
                                    value={activeMessage}
                                    onChange={(e) => handleActiveMessageChange(e.target.value)}
                                />
                                <Button variant='success' onClick={handleSendMessage} className="send-button">Enviar</Button>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ChatbotView;
