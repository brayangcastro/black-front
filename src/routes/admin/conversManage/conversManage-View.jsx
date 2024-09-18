import { useEffect, useRef, useState } from 'react';
import { Table, Container, Row, Col, Button, Alert, Pagination, Form, Modal } from 'react-bootstrap';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
 
//import json from './json.json';
import './conversManage.css';  

import IconDetail from '../../../assets/icons/userDetail.svg';
import IconPay from '../../../assets/icons/pay.svg';

export const ConversManageView = (props) => {

    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    
    const handleShowPdf = async () => {
        console.log('http://18.220.7.221/Backend/Kissibot/Neerd-back/app/models/pdf_guias/guia-15082.pdf')
           
        try {
            const response = await fetch('http://localhost/Neerd/Backend/Neerd-back/informe.pdf');
            console.log('http://18.220.7.221/Backend/Kissibot/Neerd-back/app/models/pdf_guias/guia-15082.pdf')
            
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                setPdfUrl(url);
                setShowPdfModal(true);
            } else {
                console.error("Error al obtener el PDF: Respuesta no exitosa del servidor");
            }
        } catch (error) {
            console.error("Error al obtener el PDF:", error);
        }
    };

    const handleDownloadPdf = async () => {
        try {
            console.log('http:/ df')
            const response = await fetch(pdfUrl);
            if (response.ok) {
                
            console.log('response:/ df',response)
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "NombreDelArchivo.pdf"; // El nombre de tu archivo PDF
                document.body.appendChild(a); // Se agrega el enlace al documento
                a.click(); // Se simula un clic para descargar el archivo
                window.URL.revokeObjectURL(url); // Se libera el objeto URL
                a.remove(); // Se elimina el enlace del documento
            } else {
                console.error("No se pudo descargar el PDF");
            }
        } catch (error) {
            console.error("Error durante la descarga del PDF:", error);
        }
    };
    
    
    //const OrderListShopify = json;//json de testeo
 
    const { allConvers, obtenerConversacionesUsuario,
        obtenerEstadisticasConversacion,analizaConversacion } = props;

    const converEstado = allConvers.filter(conver => conver.Estado === 'Activo');
   // const productMemberships = allProducts.filter(conver => conver.Familia === 'MEMBRESIAS');

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState(''); // Nuevo estado para el campo de búsqueda

    // Modifica la función para incluir la lógica de búsqueda
    const filteredConvers = allConvers.filter((conver) => {
        const filterByStatus = filter === '' || conver.Estado === filter;
        const filterBySearch = search === '' ||
        conver.Nombre.toString().includes(search.toLowerCase()) ||
        conver.Celular.toLowerCase().includes(search.toLowerCase()) ||
        conver.Tema.toString().includes(search.toLowerCase());

        return filterByStatus && filterBySearch;
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentConvers = filteredConvers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredConvers.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    //declaro la lógica del modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [converDetail, setConverDetail] = useState({});
    const [processPaymentData, setProcessPaymentData] = useState({});

    const handleDetailViewFunction = async (cell) => {
        try {
            
            const detalles = await obtenerEstadisticasConversacion(cell); // Asegúrate de que esta función espera el identificador correcto (ej., cell)
           
            setConverDetail(detalles); // Asume que los detalles se pueden establecer directamente
            setShowDetailModal(true);
        } catch (error) {
            console.error("Error al obtener detalles de la conversación:", error);
            // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
        }
    };
    

    //declaro la lógica del botón de procesar pago

    
    // Declaro la lógica del botón de procesar pago
    function handleProcessOrder(id) {
        setProcessPaymentData(OrderListShopify.find(orden => orden.IdOrden === id));
    }

    //opciones de paginación

    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
 
    return (
        <>
            <ConverDetailModal
               converDetail={converDetail}
                showDetailModal={showDetailModal}
                setShowDetailModal={setShowDetailModal}
            />
            <Container>
                <Row className='mb-3'>
                    <Col>
                        <h4>Conversaciones del chatbot</h4>
                    </Col>
                </Row>
              
 

                <Row className='mb-3'>
                    <Col md={4} className='mb-3'>
                        <Form.Group controlId="search">
                            <Form.Control
                                type="text"
                                placeholder="Buscar por número de celular, cliente o estado"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col>
        <Button variant="secondary" onClick={() => setShowPdfModal(true)}>Mostrar Informe PDF</Button>
    </Col>
            
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Celular</th>
                                    <th>Fecha</th>
                                    <th>Msj Entrantes</th>
                                    <th>Msj Salientes</th>
                                    <th>Tiempo</th>
                                    <th>Tema</th>
                                    <th>Fecha de Análisis</th>
                                    <th>Límite actual</th>
                                    <th>Estado</th>
                                 
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
    {currentConvers.map((conver, index) => {
         let temaObj = { Tema: 'No disponible', Tiempo: '0' };
        try {
            // Intenta parsear el tema de la conversación
            temaObj = JSON.parse(conver.Tema);
        } catch (e) {
           
            console.error("Error al parsear Tema en conversación ID:", conver.ID, e);
            temaObj = { Tema: 'Error al parsear' };
        }

        const conteoEntrantes = conver.Stats.filter(stat => stat.messageType === 'incoming').reduce((acc, stat) => acc + stat.count, 0);
        const conteoSalientes = conver.Stats.filter(stat => stat.messageType === null).reduce((acc, stat) => acc + stat.count, 0);


        // Debug: Imprimir el objeto tema parseado
        console.log("Tema parseado para ID", conver.ID, ":", temaObj);

        // Renderizado de cada fila con los datos de la conversación
        return (
            <tr key={conver.ID}>
                <td>{conver.Nombre}</td>
                <td>{conver.Celular}</td>
                <td>{conver.Fecha}</td>
                <td>{conteoEntrantes}</td>
                <td>{conteoSalientes}</td>
                <td>{temaObj?.Tiempo || 'No disponible'}</td>
                <td>{temaObj?.Tema || 'Tema no disponible'}</td>
            
                <td>{conver.Fecha_analisis}</td>
                <td>{conver.Limite}</td>
                <td>{conver.Estado}</td>

              
                <td className='acciones'>
                    {/* Aquí se coloca el OverlayTrigger para el botón de detalles */}
                    <OverlayTrigger
                        overlay={<Tooltip id={`tooltip-detalle-${conver.ID}`}>Detalle de la conversación</Tooltip>}>
                        <Button variant="info" size="sm" onClick={() => handleDetailViewFunction(conver.Celular)} title="Ver detalles">
                            Detalles
                        </Button>
                    </OverlayTrigger>
                    {' '}
                    {/* Puedes agregar OverlayTrigger a otros botones de acción de manera similar */}
                    <OverlayTrigger
                        overlay={<Tooltip id={`tooltip-pagar-${conver.ID}`}>Desactivar chatbot para este usuario</Tooltip>}>
                        <Button variant="primary" size="sm" onClick={() => handleProcessOrder(conver.ID)} title="Procesar pago">
                            Desactivar
                        </Button>
                    </OverlayTrigger>
                </td>
                <td>
    <Button variant="success" size="sm" onClick={() => activarChatbot(conver.Celular)}>Activar</Button>
    <Button variant="danger" size="sm" onClick={() => desactivarChatbot(conver.Celular)}>Desactivar</Button>
</td>

            </tr>
        );
    })}
</tbody>

                        </Table>

                        <Pagination>
                            {currentPage > 1 && (
                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                            )}

                            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                                <Pagination.Item
                                    key={startPage + index}
                                    active={startPage + index === currentPage}
                                    onClick={() => handlePageChange(startPage + index)}
                                >
                                    {startPage + index}
                                </Pagination.Item>
                            ))}

                            {currentPage < totalPages && (
                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                            )}
                        </Pagination>
                    </Col>
                </Row>
            </Container>

            <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="lg">
    <Modal.Header closeButton>
        <Modal.Title>Informe PDF</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
    </Modal.Body>
    <Modal.Footer>
    <Button onClick={handleDownloadPdf}>Descargar PDF</Button>

    <Button variant="secondary" onClick={handleShowPdf}>Mostrar Informe PDF</Button>

    </Modal.Footer>
</Modal>

        </>
    );
}

// Suponiendo que tienes un CSS adecuado basado en las clases que mencioné.

const ConverDetailModal = ({ showDetailModal, setShowDetailModal, converDetail }) => {
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [converDetail]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        console.log("Mensaje enviado:", messageText);
        setMessageText('');
        // Aquí se enviaría el mensaje realmente.
    };

    // Asumiendo que 'messageType' es 'incoming' para entrantes y 'outgoing' para salientes.
    const getMessageClass = (messageType) => {
        return messageType === 'incoming' ? 'chat-message-incoming' : 'chat-message-outgoing';
    };

    return (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalle de la conversación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
    <div className="chat-messages">
        {converDetail?.recentMessages && converDetail.recentMessages.length > 0 ? (
            converDetail.recentMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${getMessageClass(msg.messageType)}`}>
                    {msg.answer} <br />
                    <small>{new Date(msg.created_at).toLocaleString()}</small>
                </div>
            ))
        ) : (
            <div>No hay mensajes recientes.</div>
        )}
        <div ref={messagesEndRef} />
    </div>
</Modal.Body>

            <Modal.Footer>
                <Form onSubmit={handleSendMessage} className="w-100 d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="me-2"
                        style={{ flexGrow: 1 }}
                    />
                    <Button variant="primary" type="submit">Enviar</Button>
                </Form>
            </Modal.Footer>
        </Modal>
    );
};
