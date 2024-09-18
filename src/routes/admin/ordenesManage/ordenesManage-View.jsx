import React, { useRef, useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, Alert, Pagination, Form, Modal, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faCoffee, faCashRegister, faGlassMartini, faUtensils, faEdit, faTrash, faTimes, faTrashAlt, faUserFriends, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

import IconAdd from '../../../assets/icons/add.svg';
import IconDetail from '../../../assets/icons/userDetail.svg';
import IconPay from '../../../assets/icons/pay.svg';
import './ordenesManage.css';

import { PaymentComponent, CambioModal, TransactionForm } from '../../../components/components';

import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import apiUrls from '../../../api';

const imprimirTicketUrl = import.meta.env.VITE_APP_IMPRIMIR_TICKET;
const imprimirTicketFacturaUrl = import.meta.env.VITE_APP_IMPRIMIR_TICKET_FACTURA;
const imprimirCuentaUrl = import.meta.env.VITE_APP_IMPRIMIR_CUENTA;
const imprimirComandaUrl = import.meta.env.VITE_APP_IMPRIMIR_COMANDA;
const imprimirComandaCocinaUrl = import.meta.env.VITE_APP_IMPRIMIR_COMANDA_COCINA;

const ReImprimirComandaUrl = import.meta.env.VITE_APP_REIMPRIMIR_COMANDA;
const ReImprimirComandaCajaUrl = import.meta.env.VITE_APP_REIMPRIMIR_COMANDA_CAJA;

export const OrdenesManageView = (props) => {
    const { ordenId, mesaId, tipoComanda } = useParams();

    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const { ordenes, fetchOrdenes, agregarDesechable, cancelarItem, restaurarItem, cancelarTicket, restaurarTicket, desagruparItem } = props;

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [cancellationOrder, setCancellationOrder] = useState({ items: [] });
    const [separatedOrder, setSeparatedOrder] = useState({ items: [] });
    const [showCancellation, setShowCancellation] = useState(false);
    const [showSeparation, setShowSeparation] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [typeFilter, setTypeFilter] = useState('VENTA');
    const [tableWaiterSearch, setTableWaiterSearch] = useState('');
    const [showCambioModal, setShowCambioModal] = useState(false);
    const [cantidadPagada, setCantidadPagada] = useState(0);
    const [cambio, setCambio] = useState(0);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [itemToCancel, setItemToCancel] = useState(null);
    const [efectivoPagado, setEfectivoPagado] = useState(0);
const [valePagado, setValePagado] = useState(0);


    const navigate = useNavigate();

    useEffect(() => {
        if (mesaId) {
            console.log("Órdenes para la mesa ID:", mesaId);
            setTableWaiterSearch(mesaId);
            setTypeFilter(tipoComanda);
        }

        if (ordenId) {
            const order = ordenes.find(o => o.id === parseInt(ordenId));
            if (order) {
                setSelectedOrder(order);
                setOrderDetails(order.comensales);
                handleShowPaymentForm();
            } else {
                setSelectedOrder(null);
                setOrderDetails([]);
            }
        } else {
            setSelectedOrder(null);
            setOrderDetails([]);
        }
    }, [mesaId, ordenId, ordenes]);

    useEffect(() => {
        if (selectedOrder && ordenes) {
            const updatedOrder = ordenes.find(o => o.id === selectedOrder.id);
            if (updatedOrder) {
                setSelectedOrder(updatedOrder);
            }
        }
    }, [ordenes, selectedOrder]);

    const handleShowPaymentForm = () => {
        setShowPaymentForm(true);
        setShowCancellation(false);
    };

    const handleCancelItem = (comensalId, idx) => {
        if (selectedOrder && selectedOrder.comensales && selectedOrder.comensales[comensalId]) {
            let comensalItems = selectedOrder.comensales[comensalId];
            let itemToCancel = comensalItems[idx];
            setItemToCancel({ comensalId, idx, item: itemToCancel });
            setShowCancelModal(true);
        }
    };

    const confirmCancelItem = () => {
        const { comensalId, idx, item } = itemToCancel;
        let comensalItems = selectedOrder.comensales[comensalId];

        comensalItems[idx].estado_meta = 'CANCELADO';
        comensalItems[idx].cancelReason = cancelReason;

        let updatedComensales = {
            ...selectedOrder.comensales,
            [comensalId]: comensalItems
        };

        let newTotal = selectedOrder.total - item.precio * item.cantidad;

        setSelectedOrder({
            ...selectedOrder,
            total: newTotal,
            comensales: updatedComensales
        });

        cancelarItem(item.id_metadato, cancelReason);

        setShowCancelModal(false);
        setCancelReason('');
    };

    const handleRestoreItem = (comensalId, idx) => {
        let comensalItems = selectedOrder.comensales[comensalId];
        comensalItems[idx].estado_meta = 'PROCESANDO';

        let updatedComensales = {
            ...selectedOrder.comensales,
            [comensalId]: comensalItems
        };

        let newTotal = selectedOrder.total + comensalItems[idx].precio * comensalItems[idx].cantidad;

        setSelectedOrder({
            ...selectedOrder,
            total: newTotal,
            comensales: updatedComensales
        });

        restaurarItem(comensalItems[idx].id_metadato);
    };

    const handleSeparateItem = (comensalId, idx) => {
        let itemToSeparate = selectedOrder.comensales[comensalId][idx];
        let updatedComensalItems = selectedOrder.comensales[comensalId].filter((_, index) => index !== idx);
        let updatedSeparationItems = [...separatedOrder.items, itemToSeparate];

        setSelectedOrder({
            ...selectedOrder,
            comensales: {
                ...selectedOrder.comensales,
                [comensalId]: updatedComensalItems
            }
        });
        setSeparatedOrder({ ...separatedOrder, items: updatedSeparationItems });

        if (!showSeparation) {
            setShowSeparation(true);
        }
    };

    const handleCancelTicket = async () => {
        if (selectedOrder) {
            setShowCancelModal(true);
        }
    };

    const confirmCancelTicket = async () => {
        if (selectedOrder) {
            await cancelarTicket(selectedOrder.id, cancelReason);
            setSelectedOrder({
                ...selectedOrder,
                status: 'CANCELADO'
            });
            fetchOrdenes();
            setShowCancelModal(false);
            setCancelReason('');
        }
    };

    const handleRestoreTicket = async () => {
        if (selectedOrder) {
            await restaurarTicket(selectedOrder.id);
            setSelectedOrder({
                ...selectedOrder,
                status: 'PROCESANDO'
            });
            fetchOrdenes();
        }
    };

    const ImprimirCuenta = () => {
        const url = `${imprimirCuentaUrl}?Saldo=${selectedOrder.id}`;
        axios.get(url)
            .then(response => {
                console.log('ImprimirCuenta con éxito');
            })
            .catch(error => {
                console.error('Error al ImprimirCuenta:', error);
            });
    };

    const ImprimirTicket = () => {
        const url = `${imprimirTicketUrl}?Saldo=${selectedOrder.id}`;
        axios.get(url)
            .then(response => {
                console.log('ImprimirTicket con éxito');
            })
            .catch(error => {
                console.error('Error al ImprimirTicket:', error);
            });
    };

    const ImprimirTicketFactura = () => {
        const url = `${imprimirTicketFacturaUrl}?Saldo=${selectedOrder.id}`;
        axios.get(url)
            .then(response => {
                console.log('ImprimirTicketFactura con éxito');
            })
            .catch(error => {
                console.error('Error al ImprimirTicketFactura:', error);
            });
    };

    const ReImprimirComanda = () => {
        const url = `${ReImprimirComandaUrl}?Saldo=${selectedOrder.id}`;
        axios.get(url)
            .then(response => {
                console.log('ReImprimirComanda con éxito');
            })
            .catch(error => {
                console.error('Error al ReImprimirComanda:', error);
            });
    };

    const ReImprimirComandaCaja = () => {
        const url = `${ReImprimirComandaCajaUrl}?Saldo=${selectedOrder.id}`;
        axios.get(url)
            .then(response => {
                console.log('ReImprimirComanda con éxito');
            })
            .catch(error => {
                console.error('Error al ReImprimirComanda:', error);
            });
    };

    const ITEMS_PER_PAGE = 12;
    const [currentPage, setCurrentPage] = useState(1);
    const ordersContainerRef = useRef(null);

    const filteredOrders = ordenes.filter((order) => {
        const filterByStatus = !filter || order.status === filter;
        const filterBySearch = !search || order.id.toString().includes(search);
        const filterByType = !typeFilter || order.tipo === typeFilter;
        const filterByTableWaiter = !tableWaiterSearch ||
            (order.nombreMesa && order.nombreMesa.includes(tableWaiterSearch)) ||
            (order.nombreVendedor && order.nombreVendedor.includes(tableWaiterSearch));

        return filterByStatus && filterBySearch && filterByType && filterByTableWaiter;
    });

    const indexOfLastOrder = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

    const maxVisiblePages = 5;
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const handlePageChange = (page) => setCurrentPage(page);
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setOrderDetails(order.items);
    };

    useEffect(() => {
        if (ordersContainerRef.current) {
            ordersContainerRef.current.scrollTop = ordersContainerRef.current.scrollHeight;
        }
    }, [selectedOrder]);

    const handleStartCancellation = () => {
        setShowCancellation(true);
    };

    const handleOpenDetails = () => {
        setShowCancellation(false);
    };

    const handleDoubleClickItem = (comensalId, idx) => {
        const itemToSeparate = selectedOrder.comensales[comensalId][idx];

        if (!itemToSeparate || !itemToSeparate.id_metadato) {
            console.error('Error: id_metadato no encontrado en el item', itemToSeparate);
            return;
        }

        desagruparItem(itemToSeparate.id_metadato)
            .then(response => {
                console.log('Item separado con éxito:', response);
                fetchOrdenes();
            })
            .catch(error => {
                console.error('Error al desagrupar el item:', error);
                if (error.response) {
                    console.error('Datos del error:', error.response.data);
                    console.error('Estado del error:', error.response.status);
                    console.error('Encabezados del error:', error.response.headers);
                } else if (error.request) {
                    console.error('Solicitud realizada pero no hubo respuesta:', error.request);
                } else {
                    console.error('Error al configurar la solicitud:', error.message);
                }
            });
    };

    const getOrderStatusStyle = (order) => {
        let style = {};

        switch (order.status) {
            case 'PROCESANDO':
                style.backgroundColor = '#FFBB73';
                style.color = '#000000';
                break;
            case 'PAGADO':
                style.backgroundColor = '#9CEF99';
                style.color = '#000000';
                break;
            case 'CANCELADO':
                style.backgroundColor = '#FF6347';
                style.color = '#FFFFFF';
                break;
            case 'PAGANDO':
                style.backgroundColor = '#FFFF00';
                style.color = '#000000';
                break;
            default:
                style.backgroundColor = '#FFFFFF';
                style.color = '#000000';
        }

        switch (order.tipo) {
            case 'COMANDA-BEBIDA':
                style.borderLeft = '15px solid #3498db';
                break;
            case 'COMANDA-SUSHI':
                style.borderLeft = '15px solid #e74c3c';
                break;
            case 'VENTA':
                style.borderLeft = '15px solid #00FF00';
                break;
            default:
                style.borderLeft = '5px solid #95a5a6';
        }

        style.fontWeight = 'bold';

        return style;
    };

    const getOrderTypeIcon = (type) => {
        switch (type) {
            case 'COMANDA-BEBIDA':
                return faCoffee;
            case 'COMANDA-SUSHI':
                return faCircleNotch;
            case 'COMANDA':
                return faUtensils;
            case 'VENTA':
                return faCashRegister;
            default:
                return faUtensils;
        }
    };

    const handleNuevaCuentaClick = (mesaId) => {
        navigate(`/ventas/${mesaId}`);
    };

    const handleCheckChange = async (comensalId, idx) => {
        let updatedItems = [...selectedOrder.comensales[comensalId]];
        updatedItems[idx].checar = !updatedItems[idx].checar;

        setSelectedOrder({
            ...selectedOrder,
            comensales: {
                ...selectedOrder.comensales,
                [comensalId]: updatedItems
            }
        });

        try {
            await axios.post(apiUrls.updateChecarById, {
                saldometaId: updatedItems[idx].id_metadato,
                newChecarValue: updatedItems[idx].checar
            });
            console.log("Checar actualizado exitosamente.");
        } catch (error) {
            console.error('Error al actualizar Checar:', error);
        }
    };

    const esComanda = (tipo) => {
        return ['COMANDA', 'COMANDA-COCINA', 'COMANDA-SUSHI', 'COMANDA-BEBIDA'].includes(tipo);
    };

    return (
        <>
            <Container fluid>
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
                        <Button variant="primary" onClick={itemToCancel ? confirmCancelItem : confirmCancelTicket}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>

                <CambioModal

                    show={showCambioModal}
                    handleClose={() => {
                        setShowCambioModal(false);
                        navigate('/ventas/1');
                        fetchOrdenes();
                    }}
                    cantidadPagada={cantidadPagada}
                    cambio={cambio}
                    efectivoPagado={efectivoPagado}
                    valePagado={valePagado}
                    
                />

                <Row>
                    {showPaymentForm && selectedOrder && selectedOrder.status !== 'PAGADO' && (
                        <Col md={8}>
                            <div className="order-details">
                                <PaymentComponent
                                    total={selectedOrder.total}
                                    orderId={selectedOrder.id}
                                    setShowCambioModal={setShowCambioModal}
                                    setCantidadPagada={setCantidadPagada}
                                    setCambio={setCambio}
                                    setEfectivoPagado={setEfectivoPagado}
                                    setValePagado={setValePagado}
                                    
                                />
                            </div>
                        </Col>
                    )}

                    {!showPaymentForm && (
                        <>
                            {!showCancellation && cancellationOrder.items.length === 0 && (
                                <Col md={8} className="product-column">
                                    <Row className="mb-3">
                                        <Col xs={12} md={4}>
                                            <Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                                                <option value="">Todos los tipos</option>
                                                <option value="COMANDA">Cocina</option>
                                                <option value="COMANDA-BEBIDA">Bebida</option>
                                                <option value="COMANDA-SUSHI">Sushi</option>
                                                <option value="VENTA">Ventas</option>
                                                <option value="SALIDA">Salidas</option>
                                                <option value="ENTRADA">Entradas</option>
                                            </Form.Select>
                                        </Col>
                                        <Col xs={12} md={4}>
                                            <InputGroup>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Buscar por mesa o mesero"
                                                    value={tableWaiterSearch}
                                                    onChange={(e) => setTableWaiterSearch(e.target.value)}
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>

                                    <Row>
                                        {currentOrders.map((order) => (
                                            <Col xs={12} md={6} lg={3} key={order.id} className="mb-4">
                                                <Button
                                                    variant="outline-primary"
                                                    style={getOrderStatusStyle(order)}
                                                    onClick={() => handleOrderSelect(order)}
                                                >
                                                    <FontAwesomeIcon icon={getOrderTypeIcon(order.tipo)} size="2x" />
                                                    <div>#{order.id}</div>
                                                    <div>Total: ${order.total.toFixed(2)}</div>
                                                    <div>{order.nombreVendedor}</div>
                                                    <div>{order.nombreMesa}</div>
                                                </Button>
                                            </Col>
                                        ))}
                                    </Row>

                                    <Row>
                                        <Col className="d-flex justify-content-center">
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
                                </Col>
                            )}
                        </>
                    )}

                    <Col md={4} className="order-column">
                        <div className="order-details">
                            {selectedOrder ? (
                                <>
                                    <div className="order-header">
                                        <h4>Detalle de Orden {selectedOrder.id}</h4>
                                        <Button variant="danger">
                                            <FontAwesomeIcon icon={faTimes} />
                                        </Button>
                                    </div>
                                    <div className="order-footer">
                                        <h5 className="total-highlight">
                                            Estado {selectedOrder ? selectedOrder.status : "0.00"}
                                        </h5>
                                        <h5 className="total-highlight">
                                            Mesa {selectedOrder ? selectedOrder.nombreMesa : ""}
                                        </h5>

                                        <div className="total-venta">
                                            <h5 className="total-highlight">
                                                Total venta: $ {selectedOrder ? selectedOrder.total.toFixed(2) : "0.00"}
                                            </h5>
                                        </div>

                                        <div className="botones-accion">
                                            {selectedOrder && esComanda(selectedOrder.tipo) && (
                                                <div className="botones-comanda">
                                                    <Button variant="info" onClick={ReImprimirComanda}>REIMPRIMIR COMANDA EN COCINA</Button>
                                                    <Button variant="info" onClick={ReImprimirComandaCaja}>REIMPRIMIR COMANDA EN CAJA</Button>
                                                    <Button variant="danger" onClick={handleCancelTicket}>CANCELAR COMANDA</Button>
                                                </div>
                                            )}

                                            {selectedOrder && selectedOrder.tipo === 'VENTA' && selectedOrder.status === 'PROCESANDO' && (
                                                <>
                                                    <Button variant="info" onClick={() => handleNuevaCuentaClick(selectedOrder.mesaId)}>ABRIR</Button>
                                                    <Button variant="primary" onClick={ImprimirCuenta}>IMPRIMIR CUENTA</Button>
                                                    <Button variant="success" onClick={handleShowPaymentForm}>PAGAR</Button>
                                                   
                                                </>
                                            )}
                                            {selectedOrder && selectedOrder.tipo === 'VENTA' && selectedOrder.status === 'PAGANDO' && (
                                                <>
                                                    <Button variant="info" onClick={() => handleNuevaCuentaClick(selectedOrder.mesaId)}>ABRIR</Button>
                                                    <Button variant="primary" onClick={ImprimirCuenta}>IMPRIMIR CUENTA</Button>
                                                    <Button variant="success" onClick={handleShowPaymentForm}>PAGAR</Button>
                                                   
                                                </>
                                            )}
                                            {selectedOrder && selectedOrder.tipo === 'VENTA' && selectedOrder.status === 'PAGADO' && (
                                                <>
                                                    <Button variant="warning" onClick={ImprimirTicket}>IMPRIMIR TICKET</Button>
                                                    <Button variant="danger" onClick={handleCancelTicket}>CANCELAR TICKET</Button>
                                                </>
                                            )}
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
                                                <th colSpan="2">Opc.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(selectedOrder.comensales).map(([comensalId, items]) => (
                                                <React.Fragment key={comensalId}>
                                                    <tr hidden>
                                                        <td colSpan="8">Comensal {comensalId}</td>
                                                    </tr>
                                                    {items.map((item, idx) => (
                                                        <tr key={idx} style={item.estado_meta === 'CANCELADO' ? { textDecoration: 'line-through', color: 'red' } : {}}
                                                            onDoubleClick={() => handleDoubleClickItem(comensalId, idx)}
                                                        >
                                                            <td>{new Date(item.fecha_saldo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                                            <td>
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    checked={item.checar || false}
                                                                    onChange={() => handleCheckChange(comensalId, idx)}
                                                                />
                                                            </td>
                                                            <td>{item.cantidad}</td>
                                                            <td>{item.nombre}</td>
                                                            <td>${item.precio.toFixed(2)}</td>
                                                            <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                                                            <td>
                                                                {selectedOrder && (selectedOrder.status === 'PROCESANDO' || selectedOrder.status === 'PAGANDO') && (
                                                                    item.estado_meta === 'CANCELADO' ? (
                                                                        <Button variant="outline-success" onClick={() => handleRestoreItem(comensalId, idx)}>
                                                                            <FontAwesomeIcon icon={faEdit} />
                                                                        </Button>
                                                                    ) : (
                                                                        <Button variant="outline-danger" onClick={() => handleCancelItem(comensalId, idx)}>
                                                                            <FontAwesomeIcon icon={faTimes} />
                                                                        </Button>
                                                                    )
                                                                )}
                                                            </td>
                                                            <td hidden>
                                                                {selectedOrder && selectedOrder.status === 'PROCESANDO' && (
                                                                    <Button variant="outline-info" onClick={() => handleSeparateItem(comensalId, idx)}>
                                                                        <FontAwesomeIcon icon={faUserFriends} />
                                                                    </Button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </Table>
                                </>
                            ) : (
                                <p>Seleccione una orden para ver los detalles.</p>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};