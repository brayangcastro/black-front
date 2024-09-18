import { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, Alert, Pagination, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload,faSearch } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import IconDetail from '../../../assets/icons/userDetail.svg';
import IconPay from '../../../assets/icons/pay.svg';
import { CorteModal, TransactionForm, CambioModal } from '../../../components/components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../../../api';

const imprimirCorteUrl = import.meta.env.VITE_APP_IMPRIMIR_CORTE;

export const TicketsManageView = (props) => {
    const navigate = useNavigate();

    const [viewMode, setViewMode] = useState('tickets'); // 'tickets' o 'cortes'
    const { allTickets, totalesCalculados, realizarCorte, processTransaction, ticketStats, fetchTicketStats, cortes, cancelTicket, restoreTicket } = props;

    const paidOrders = allTickets.filter(order => order.Estado === 'PAGADO');
    const pendingOrders = allTickets.filter(order => order.Estado === 'PROCESANDO');

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState([{ value: 'VENTA', label: 'Venta' }]);
    const [estadoFiltro, setEstadoFiltro] = useState(''); // Nuevo estado para el filtro por estado
    const [mesaBusqueda, setMesaBusqueda] = useState(''); // Nuevo estado para la búsqueda por mesa
    const [showCancelModal, setShowCancelModal] = useState(false); // Estado para mostrar el modal de cancelación
    const [cancelReason, setCancelReason] = useState(''); // Estado para almacenar el motivo de la cancelación
    const [itemToCancel, setItemToCancel] = useState(null); // Estado para almacenar el ítem a cancelar
    const [isLoading, setIsLoading] = useState(false); // Nuevo estado para manejar la carga
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});
    const [processPaymentData, setProcessPaymentData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showModalTransaction, setShowModalTransaction] = useState(false);
    const [showCambioModal, setShowCambioModal] = useState(false);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    const handlePreviewPDF = async (corteId) => {
        try {
            const response = await axios.get(`${apiUrls.reporteCorte}`, {
                params: { corteId },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfUrl(url);
            setShowPDFPreview(true);
        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    async function handleDetailViewFunction2(ticketId) {
        setShowDetailModal(true);
        setIsLoading(true); // Inicia el estado de carga
        try {
            const response = await axios.post(`${apiUrls.getTicketDetailsById}`,
                {
                    ticketId
                });
            console.log("Response getTicketDetailsById", response.data)
            setOrderDetail(response.data);
        } catch (error) {
            console.error('Error al obtener los detalles del ticket:', error);
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
        }
    }

    const handleFechaInicioChange = (e) => {
        setFechaInicio(e.target.value);
    };

    const handleFechaFinChange = (e) => {
        setFechaFin(e.target.value);
    };

    const ordersToFilter = viewMode === 'tickets' ? allTickets : cortes;

    const filteredOrders = ordersToFilter.filter((order) => {
        const filterByStatus = estadoFiltro === '' || order.Estado === estadoFiltro;
        const filterByTipo = tipoFiltro.length === 0 || tipoFiltro.some(tipo => tipo.value === order.Tipo);
        const filterByMesa = mesaBusqueda === '' || order.NombreMesa === mesaBusqueda;
    
        // Verifica que las propiedades existan antes de usarlas
        const filterBySearch = search === '' || 
            (order.ID && order.ID.toString().toLowerCase().includes(search.toLowerCase())) ||
            (order.Cliente && order.Cliente.toLowerCase().includes(search.toLowerCase())) ||
            (order.nombreMesa && order.nombreMesa.toLowerCase().includes(search.toLowerCase())) ||
            (order.Total && order.Total.toString().toLowerCase().includes(search.toLowerCase()));
    
        const filterByFechaInicio = fechaInicio === '' || new Date(order.Fecha) >= new Date(fechaInicio);
        const filterByFechaFin = fechaFin === '' || new Date(order.Fecha) <= new Date(fechaFin);
    
        return filterByStatus && filterByTipo && filterByMesa && filterBySearch && filterByFechaInicio && filterByFechaFin;
    });
    

    const handleTipoFiltroChange = (selectedOptions) => {
        setTipoFiltro(selectedOptions);
        setCurrentPage(1); // Reinicia la paginación
    };

    const handleEstadoFiltroChange = (e) => {
        setEstadoFiltro(e.target.value);
        setCurrentPage(1); // Reinicia la paginación
    };

    const handleMesaBusquedaChange = (selectedOption) => {
        setMesaBusqueda(selectedOption);
        setCurrentPage(1); // Reinicia la paginación
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleShowCortesAnteriores = () => {
        setViewMode('cortes');
        setTipoFiltro([{ value: 'CORTE', label: 'Corte' }]);
    };

    const handleShowVentas = () => {
        setViewMode('tickets');
        setTipoFiltro([{ value: 'VENTA', label: 'Venta' }]);
    };

    const handleShowMovimientos = () => {
        setTipoFiltro([
            { value: 'ENTRADA', label: 'Entrada' },
            { value: 'SALIDA', label: 'Salida' }
        ]);
    };

    async function handleDetailViewFunction(ticketId) {
        navigate(`/ordenes/${ticketId}`);
    }

    useEffect(() => {
        // Verifica que processPaymentData tenga datos antes de realizar operaciones
        if (Object.keys(processPaymentData).length > 0) {
            processPaymentFunction(processPaymentData);
        }
    }, [processPaymentData]);

    function handleProcessOrder(id) {
        setProcessPaymentData(allTickets.find(orden => orden.ID === id));
    }

    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const tipoOptions = [
        { value: '', label: 'Todos los tipos' },
        { value: 'COMANDA', label: 'Comanda' },
        { value: 'VENTA', label: 'Venta' },
        { value: 'ENTRADA', label: 'Entrada' },
        { value: 'SALIDA', label: 'Salida' },
        { value: 'CORTE', label: 'Corte' }
    ];

    const mesaOptions = [
        { value: '', label: 'Todos las mesas' },
        { value: '1', label: '10' },
        { value: '2', label: '11' },
        { value: '3', label: '12' },
        { value: '4', label: '20' },
        { value: '5', label: '21' },
        { value: '6', label: '22' },
        { value: '7', label: '30' }
    ];
    const cantidadPagada = 500;
    const cambio = 25;

    const descargarReporte = async (corteId) => {
        try {
            const response = await axios.get(`${apiUrls.reporteCorte}`, {
                params: {
                    corteId: corteId
                },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ReporteCorte.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("Descarga iniciada");

        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const verCorteDetalle = (corteId) => {
        navigate(`/reportes/${corteId}`);
    };

    const handlePrintCorte = (corteId) => {
        const url = imprimirCorteUrl + "?Saldo=" + corteId;

        axios.get(url)
            .then(response => {
                console.log(`Imprimir corte con ID: ${corteId}`);
            })
            .catch(error => {
                console.error('Error al imprimir Corte:', error);
            });
    };

    const handleCancelTicket = (order) => {
        setItemToCancel(order);
        setShowCancelModal(true);
    };

    const confirmCancelTicket = async () => {
        if (itemToCancel) {
            await cancelTicket(itemToCancel.ID, cancelReason);
            itemToCancel.Estado = 'CANCELADO';
            setShowCancelModal(false);
            setCancelReason('');
            setItemToCancel(null);
            fetchTicketStats();
        }
    };

    const handleRestoreTicket = async (order) => {
        await restoreTicket(order.ID);
        order.Estado = 'PROCESANDO';
        fetchTicketStats();
    };

    const handleConsultarReporte = () => {
        // Lógica para consultar el reporte de ventas entre las fechas seleccionadas
        // Puedes hacer una llamada a la API aquí y pasar las fechas seleccionadas
        console.log("Consultando reporte de ventas entre", fechaInicio, "y", fechaFin);

        
        navigate(`/reporteRango/${fechaInicio}/${fechaFin}`);
        
    };

    return (
        <>
            <OrderDetailModal
                orderDetail={orderDetail}
                showDetailModal={showDetailModal}
                setShowDetailModal={setShowDetailModal}
            />

            <Container>
                <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Motivo de Cancelación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group controlId="cancelReason">
                            <Form.Label>Por favor, ingrese el motivo de la cancelación:</Form.Label>
                            <Form.Control
                                type="text"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={confirmCancelTicket}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Row className='mb-3'>
                    <Col>
                        <h4>Lista de tickets</h4>
                    </Col>
                </Row>
                <Row className='mb-3'>
                <Col md={2}>
                        <Alert variant={'success'}>
                            Total de Venta: ${props.ticketStats.totalVenta}
                        </Alert>
                    </Col>
                   
                    <Col xs={6} md={2}>
                        <Alert variant={'success'}>
                            Tickets totales: {props.ticketStats.conteoTotal}
                        </Alert>
                    </Col>
                    <Col xs={6} md={2}>
                        <Alert variant={'warning'}>
                            Promedio por ticket: ${props.ticketStats.promedioTicket}
                        </Alert>
                    </Col>

                    <Col xs={6} md={2}>
                        <Alert variant={'warning'}>
                            Movimientos: ${props.ticketStats.balanceMovimientos}
                        </Alert>
                    </Col>
                    <Col md={2}>
                        <Alert variant={'primary'}>
                            Total al corte: ${props.ticketStats.totalCorte}
                        </Alert>
                    </Col>
                </Row>
                <Row className='mb-3'>
                    <Col xs={6} md={3}>
                        <Button variant="primary" onClick={()=>setShowModalTransaction(true)}>Nuevo Movimiento</Button>
                    </Col>

                    <Col xs={6} md={3}>
                        <Button variant="primary" onClick={()=>setShowModal(true)}>Realizar Corte</Button>
                    </Col>

                    <Col xs={6} md={2}>
                        <Button variant="primary" onClick={handleShowCortesAnteriores}>Ver Cortes Anteriores</Button>
                    </Col>
                    <Col xs={6} md={2}>
                        <Button variant="primary" onClick={handleShowVentas}>Ver Ventas</Button>
                    </Col>
                    <Col xs={4} md={2}>
                        <Button variant="primary" onClick={handleShowMovimientos}>Ver Movimientos</Button>
                    </Col>

                    <Col xs={6} md={3}>

                    </Col>
                </Row>

                <CorteModal
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    realizarCorte={realizarCorte}
                    totalesCalculados={totalesCalculados}
                    ticketStats={ticketStats}
                    fetchTicketStats={fetchTicketStats}
                />

                <TransactionForm
                    show={showModalTransaction}
                    handleClose={() => setShowModalTransaction(false)}
                    processTransaction={processTransaction}
                    totalesCalculados={totalesCalculados}
                />

                <CambioModal
                    show={showCambioModal}
                    handleClose={() => setShowCambioModal(false)}
                    cantidadPagada={cantidadPagada}
                    cambio={cambio}
                />

                <Row className='mb-3'>
                    <Col hidden>
                        <h5>Resumen de Tickets</h5>
                        <p>Total al corte: ${props.ticketStats.totalCorte}</p>
                        <p>Tickets totales: {props.ticketStats.conteoTotal}</p>
                        <p>Promedio por ticket: ${props.ticketStats.promedioTicket}</p>
                    </Col>
                </Row>
                <Row>
                </Row>
                <Row className='mb-3'>
                    <Row>
                        <Col md={3}>
                            <Select
                                options={tipoOptions}
                                value={tipoFiltro}
                                onChange={handleTipoFiltroChange}
                                placeholder="Selecciona tipos"
                                isClearable
                                isSearchable
                                isMulti
                            />
                        </Col>

                        <Col hidden md={3}>
                            <Select
                                options={mesaOptions}
                                value={mesaBusqueda}
                                onChange={handleMesaBusquedaChange}
                                placeholder="Seleccione una mesa"
                                isClearable
                                isSearchable
                            />
                        </Col>

                        <Col md={3}>
                            <Form.Control as="select" value={estadoFiltro} onChange={handleEstadoFiltroChange}>
                                <option value="">Todos los estados</option>
                                <option value="PAGADO">Pagado</option>
                                <option value="PAGANDO">Pagando</option>
                                <option value="PROCESANDO">Procesando</option>
                                <option value="CANCELADO">Cancelado</option>
                            </Form.Control>
                        </Col>

                        <Col md={3} className='mb-3'>
                            <Form.Group controlId="search">
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por número de orden, cliente o total"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={5}>
                            <Form.Group controlId="fechaInicio">
                                <Form.Label>Fecha Inicio</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaInicio}
                                    onChange={handleFechaInicioChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={5}>
                            <Form.Group controlId="fechaFin">
                                <Form.Label>Fecha Fin</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaFin}
                                    onChange={handleFechaFinChange}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={2} className="d-flex align-items-end">
                            <Button 
                                variant="primary" 
                                onClick={handleConsultarReporte}
                            >
                                <FontAwesomeIcon icon={faSearch} /> Consultar
                            </Button>
                        </Col>

                    </Row>
                </Row>
                <Row className='mb-3'>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>ID</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                    <th>Nota</th>
                                    <th>Mesero</th>
                                    <th>Mesa</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map((order) => (
                                    <tr key={order.ID}>
                                        <td>{order.Tipo}</td>
                                        <td>{order.ID}</td>
                                        <td>${order.Total}</td>
                                        <td>{order.Fecha}</td>
                                        <td className={order.Estado}>
                                            {order.Estado === 'PAGADO' ? 'Pagado'
                                                : order.Estado === 'PROCESANDO' ? 'Pendiente'
                                                : order.Estado === 'PAGANDO' ? 'Pagando'
                                                : order.Estado === 'CANCELADO' ? 'Cancelado' : ''}
                                        </td>
                                        <td>{order.Nota}</td>
                                        <td>{order.NombreVendedor}</td>
                                        <td>{order.NombreMesa}</td>
                                        <td className='acciones'>
                                            {order.Estado === 'CANCELADO' ? (
                                                <Button variant="success" onClick={() => handleRestoreTicket(order)}>
                                                    Restaurar
                                                </Button>
                                            ) : (
                                                <Button variant="danger" onClick={() => handleCancelTicket(order)}>
                                                    Cancelar
                                                </Button>
                                            )}
                                            {order.Tipo !== 'CORTE' && (
                                                <Button className='btn-accion' variant="success" size="sm" onClick={() => handleDetailViewFunction(order.ID)} title='Ver detalles'>
                                                    <img src={IconDetail} alt="User Detail" />
                                                </Button>
                                            )}
                                            {order.Tipo === 'CORTE' && (
                                                <>
                                                    <Button className='btn-accion' variant="info" size="sm" onClick={() => handlePrintCorte(order.ID)} title='Imprimir Corte'>
                                                        Imprimir
                                                    </Button>
                                                    <Button className='btn-accion' variant="success" size="sm" onClick={() => verCorteDetalle(order.ID)} title='Ver detalles'>
                                                        <img src={IconDetail} alt="User Detail" />
                                                    </Button>
                                                    <Button className='btn-accion' variant="success" size="sm" onClick={() => handlePreviewPDF(order.ID)} title='Vista Previa'>
                                                        Vista Previa
                                                    </Button>
                                                    <Button className='btn-accion' variant="success" size="sm" onClick={() => descargarReporte(order.ID)} title='Descargar Reporte'>
                                                        <FontAwesomeIcon icon={faDownload} />
                                                    </Button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
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
        </>
    );
}

const OrderDetailModal = ({ showDetailModal, setShowDetailModal, orderDetail, isLoading }) => {
    return (
        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalle de la Orden</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <p>Cargando detalles...</p>
                ) : orderDetail ? (
                    <>
                        <div className="order-header">
                            <h4>Detalle de Orden {orderDetail.ID}</h4>
                        </div>
                        <div className="order-footer">
                            <h5 className="total-highlight">Estado: {orderDetail.Estado}</h5>
                            <div className="total-venta">
                                <h5 className="total-highlight">Total venta: ${parseFloat(orderDetail.Total).toFixed(2)}</h5>
                            </div>
                        </div>
                        <Table striped bordered hover size="sm">
                            <thead>
                                <tr>
                                    <th>Tiempo</th>
                                    <th>Chk</th>
                                    <th>Cant.</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Subt.</th>
                                    <th>Opc.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetail.saldos_meta && orderDetail.saldos_meta.map((item, idx) => (
                                    <tr key={idx} style={item.Estado === 'CANCELADO' ? { textDecoration: 'line-through', color: 'red' } : {}}>
                                        <td>00:00</td>
                                        <td>
                                            <Form.Check type="checkbox" />
                                        </td>
                                        <td>{item.Cantidad}</td>
                                        <td>{item.Nombre} {item.Nota}</td>
                                        <td>${parseFloat(item.Precio).toFixed(2)}</td>
                                        <td>${(parseFloat(item.Precio) * parseInt(item.Cantidad)).toFixed(2)}</td>
                                        <td>
                                            {orderDetail.Estado === 'PROCESANDO' && (
                                                item.Estado === 'CANCELADO' ? (
                                                    <Button variant="outline-success">
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline-danger">
                                                        <FontAwesomeIcon icon={faTimes} />
                                                    </Button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                ) : (
                    <p>Seleccione una orden para ver los detalles.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
