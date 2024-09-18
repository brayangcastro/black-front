import React, { useRef, useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, Alert, Pagination, Form, Modal, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes, faTrashAlt, faUserFriends, faEye, faPrint,faPlus } from '@fortawesome/free-solid-svg-icons';

import IconAdd from '../../../assets/icons/add.svg';
import IconDetail from '../../../assets/icons/userDetail.svg';
import IconPay from '../../../assets/icons/pay.svg';
import './mesasManage.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

import { useNavigate,useParams } from 'react-router-dom';
// ... dentro de tu componente MesasManageView ...mdmdmmd
import { PaymentComponent,CambioModal,TransactionForm } from '../../../components/components';
 

export const MesasManageView = (props) => {
    const navigate = useNavigate();

    const { mesaId } = useParams();
    console.log("mesaId ID",mesaId);

    const { mesas,limpiarMesa,imprimirCuenta,ordenes,fetchMesas
    } = props;
    const handleVerCuentaClick = (ordenId) => {
        // Encuentra la ID de la orden asociada con la mesa (necesitarás la lógica para esto)
       
       navigate(`/ordenes/${ordenId}`);
      };

      const handleNuevaCuentaClick = (mesaId) => {
        // Encuentra la ID de la orden asociada con la mesa (necesitarás la lógica para esto)
       
       navigate(`/ventas/${mesaId}`);
      };

      const [selectedMesa, setSelectedMesa] = useState(null);
      const [selectedOrderId, setSelectedOrderId] = useState(null);
      
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showCambioModal, setShowCambioModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false); // Estado para mostrar el modal de cancelación
    const [cancelReason, setCancelReason] = useState(''); // Estado para almacenar el motivo de la cancelación
    const [itemToCancel, setItemToCancel] = useState(null); // Estado para almacenar el ítem a cancelar
 
      const handleShowPaymentForm = () => {
        setShowPaymentForm(true);
      
        // Asegúrate de cerrar otros formularios o modales que no deberían estar abiertos
    };
   
 
    const handleMesaSelect = (mesa) => {
        // Aquí estableces la mesa seleccionada en el estado
        setSelectedMesa(mesa);
        const order = ordenes.find(o => o.id == mesa.Comanda);

        setSelectedOrderId(mesa.Comanda);
        setSelectedOrder(order)
        console.log("mesa.selectedOrder",selectedOrder)

    };

   
      

    const renderMesaOptions = () => {
        // Estilo para botones con bordes redondeados
        const roundedButtonStyle = {
          borderRadius: '8px', // Bordes redondeados
          width: '100px',      // Ancho fijo para forma cuadrada
          height: '100px',     // Alto fijo para forma cuadrada
          margin: '5px'        // Margen para separar los botones
        };
      
        // Verifica si hay una mesa seleccionada y muestra su contenido
        return selectedMesa ? (
          <div>
            <h4>Detalle de Mesa {selectedMesa.Nombre}</h4>
            <h4>Ticket: {selectedMesa.Comanda}</h4>
            <h4>Total: ${selectedMesa.TotalOrden}</h4>
            <Button variant="info" onClick={() => handleVerCuentaClick(selectedMesa.Comanda)}>Ver Cuenta  {selectedMesa.Comanda}</Button>
        
            <p>{selectedMesa.Estado}</p>
            {/* Agrega aquí más detalles o acciones para la mesa */}
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
            <Button variant="success" style={roundedButtonStyle}
            onClick={() => handleNuevaCuentaClick(selectedMesa.ID)}
            >
          <FontAwesomeIcon icon={faPlus} /> {/* Este es el ícono de "plus" */}
          <div>Nueva Orden</div>
        </Button>

        <Button variant="success" style={roundedButtonStyle}
            onClick={() => limpiarMesa(selectedMesa.ID)}
            >
          <FontAwesomeIcon icon={faPlus} /> {/* Este es el ícono de "plus" */}
          <div>Limpiar Mesan</div>
        </Button>

        <Button variant="success" style={roundedButtonStyle}
            onClick={() => imprimirCuenta(selectedMesa.Comanda)}
            >
          <FontAwesomeIcon icon={faPlus} /> {/* Este es el ícono de "plus" */}
          <div>Imprimir Cuenta</div>
        </Button>
              {selectedMesa.Estado === 'PROCESANDO' && (
                <Button variant="warning" style={roundedButtonStyle}>Pagar Cuenta</Button>
              )}
            </div>
            </div>
        ) : (
          <p>Seleccione una mesa para ver los detalles.</p>
        );
      };

      const renderOrder2 = () => {
        if (selectedOrder) {
            return (
                <>
                    {/* Contenido cuando hay una orden seleccionada */}
                    <p>Detalle de Orden {selectedOrder.id}</p>
                    {/* Más detalles de la orden */}
                </>
            );
        } else {
            return <p>Seleccione una orden para ver los detalles.</p>;
        }
    };
    
      const renderOrder = () => {
        if (selectedOrder) {
            return (
                <>

                
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
        navigate('/mesas/');
        setShowPaymentForm(false);
        setSelectedOrder(null);
        fetchMesas();
    }} 
    cantidadPagada={cantidadPagada} 
    cambio={cambio}  
   
    />



            {selectedOrder ? (
                <>
                 
                    <div className="order-header">  
                    <h4>Mesa {selectedMesa.Nombre}</h4>
                        <h3>Detalle de Orden {selectedOrder.id}</h3>
                        <Button variant="danger">
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    </div>
                    <div className="order-footer">
                    <h5 className="total-highlight">
                            Estado {selectedOrder ? selectedOrder.status : "0.00"}
                            </h5> 
  
                        <div className="total-venta">
                        <h5 className="total-highlight">
                            Total venta: $ {selectedOrder ? selectedOrder.total.toFixed(2) : "0.00"}
                            </h5> </div>
                            {/* ... dentro de tu componente ... */}

                            <div className="botones-accion">
{selectedOrder && selectedOrder.status === 'PROCESANDO' && (
<>
<Button variant="info"   onClick={() => handleNuevaCuentaClick(selectedMesa.ID)}
          >ABRIR</Button>
<Button variant="primary">IMPRIMIR CUENTA</Button>
<Button variant="success" onClick={handleShowPaymentForm}>PAGAR</Button>
<Button variant="secondary">DESECHABLE</Button>
</>
)}
{selectedOrder && selectedOrder.status === 'PAGADO' && (
<>
<Button variant="info"   onClick={() => handleNuevaCuentaClick(selectedMesa.ID)}
          >NUEVA ORDEN</Button>
<Button variant="warning">IMPRIMIR TICKET</Button>
<Button variant="danger">CANCELAR TICKET</Button>
</>
)}
</div>

{/* ... resto de tu componente 

                        <div className="botones-accion">
                            <Button variant="info">ABRIR</Button>
                            <Button variant="primary">IMPRIMIR</Button>
                            <Button variant="success" onClick={handleShowPaymentForm}>PAGAR</Button>

                            <Button variant="secondary">DESECHABLE</Button>
                        </div>
                        ... */}
                    </div>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Tiempo</th>
                                <th>Chk</th> {/* Asumiendo que quieres un checkbox aquí */}
                                <th>Cant.</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Subt.</th>
                                <th colspan='2'>Opc.</th> {/* Para los iconos de cancelar y separar cuenta */}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(selectedOrder.comensales).map(([comensalId, items]) => (
                                <React.Fragment key={comensalId}>
                                    <tr>
                                        <td  colSpan="8">Comensal {comensalId}</td>
                                    </tr>
                                    {items.map((item, idx) => (
                                        <tr key={idx}>
                                           
                                            <td>00:00</td>
                                            <td>
                                                 <Form.Check type="checkbox"  />
                                           
                                            </td>
                                             <td>{item.cantidad}</td>
                                            <td>{item.nombre}</td>
                                            <td>${item.precio.toFixed(2)}</td>
                                            <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                                            <td>
                                            <Button variant="outline-danger" onClick={() => handleCancelItem(comensalId, idx)}>
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                           
                                            </td>
                                            <td>
                                            <Button variant="outline-info" onClick={() => handleSeparateItem(comensalId, idx)}>
                                                <FontAwesomeIcon icon={faUserFriends} />
                                            </Button>
                                           
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
        
        </>
            );
        } else {
            return <p>Seleccione una orden para ver los detalles.</p>;
        }
            };
      


    //const OrderListShopify = json;//json de testeo
    let allOrders = [
        {
            id: 'ORD001',
            status: 'Pendiente',
            total: 150.00,
            comensales: {
                1: [
                    { id_producto: 10, nombre: 'Café Americano', cantidad: 1, precio: 20.00, comensalId: 1 },
                    { id_producto: 11, nombre: 'Croissant de Chocolate', cantidad: 1, precio: 30.00, comensalId: 1 }
                ],
                2: [
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 }
                ],
                3: [
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 }
                ]

            },
            fecha: '2024-03-27T09:00:00.000Z'
        }
        ,
        {
            id: 'ORD002',
            status: 'Pendiente',
            total: 150.00,
            comensales: {
                1: [
                    { id_producto: 10, nombre: 'Café Americano', cantidad: 1, precio: 20.00, comensalId: 1 },
                    { id_producto: 11, nombre: 'Croissant de Chocolate', cantidad: 1, precio: 30.00, comensalId: 1 }
                ],
                2: [
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 }
                ],
                3: [
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 },
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 },
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 },
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 },
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 },
                    { id_producto: 12, nombre: 'Jugo de Naranja Natural', cantidad: 1, precio: 25.00, comensalId: 2 }
                ]

            },
            fecha: '2024-03-27T09:00:00.000Z'
        }

    ];

    //  allOrders =ordenes;


    const [cantidadPagada, setCantidadPagada] = useState(0);
    const [cambio, setCambio] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    // Al inicio de tu componente, después de las definiciones de estado existentes
    const [cancellationOrder, setCancellationOrder] = useState({ items: [] }); // Inicia con un arreglo vacío de ítems
    const [separatedOrder, setSeparatedOrder] = useState({ items: [] }); // Inicia con un arreglo vacío de ítems

    const [showCancellation, setShowCancellation] = useState(false);
    const [showSeparation, setShowSeparation] = useState(false);
    const [selectedSection, setSelectedSection] = useState(''); // Estado para la sección seleccionada

    // Obtener secciones únicas de las mesas
    const uniqueSections = Array.from(new Set(props.mesas.map(mesa => mesa.Seccion)));
    const [seccionSeleccionada, setSeccionSeleccionada] = useState('1');

    // Filtra y ordena las mesas solo si la sección seleccionada es 'General'

    const orderMesasByName = (mesas) => {
        // Define el orden deseado de las mesas en una matriz
       const order = ['12', '22', '32', '42', '52', '62', '72', '11', '21', '31', '41', '51', '61', '71', '10', '20', '30', '40', '50', '60', '70'];
     //    const order = ['10', '20', '30', '40', '50', '60', '70', '11', '21', '31', '41', '51', '61', '71', '12', '22', '32', '42', '52', '62', '72'];

        // Filtra y ordena las mesas que pertenecen a la sección 'General'
        return mesas
            .filter(mesa => mesa.Seccion === '1') // Asume que '1' es el código de la sección 'General'
            .sort((a, b) => order.indexOf(a.Nombre) - order.indexOf(b.Nombre));
    };


    const secciones = {
        1: 'General',
        2: 'Privado',
        3: 'Para Llevar',
        4: 'John Deere',

    };



    const handleCancelItem = (idx) => {
        let itemToCancel = { ...selectedOrder.items[idx] };
        let updatedOrderItems = selectedOrder.items.filter((_, index) => index !== idx);

        let updatedCancellationItems = [...cancellationOrder.items, itemToCancel];

        setSelectedOrder({ ...selectedOrder, items: updatedOrderItems });
        setCancellationOrder({ ...cancellationOrder, items: updatedCancellationItems });

        if (!showCancellation) {
            setShowCancellation(true);
        }
    };

    const handleSeparateItem = (idx) => {
        let itemToSeparate = { ...selectedOrder.items[idx] };
        let updatedOrderItems = selectedOrder.items.filter((_, index) => index !== idx);

        let updatedSeparationItems = [...separatedOrder.items, itemToSeparate];

        setSelectedOrder({ ...selectedOrder, items: updatedOrderItems });
        setSeparatedOrder({ ...separatedOrder, items: updatedSeparationItems });

        if (!showSeparation) {
            setShowSeparation(true);
        }
    };

    const handleRestoreItem = (idx) => {
        // Tomar el ítem cancelado basado en el índice
        let itemToRestore = { ...cancellationOrder.items[idx] };

        // Eliminar el ítem de la lista de ítems cancelados
        let updatedCancellationItems = cancellationOrder.items.filter((_, index) => index !== idx);

        // Asumiendo que quieres devolver el ítem a la orden seleccionada actualmente
        // y asumiendo que 'selectedOrder' puede no ser nula
        if (selectedOrder) {
            let updatedOrderItems = [...selectedOrder.items, itemToRestore];
            setSelectedOrder({ ...selectedOrder, items: updatedOrderItems });
        }

        // Actualizar la lista de ítems cancelados
        setCancellationOrder({ ...cancellationOrder, items: updatedCancellationItems });

        // Si la lista de ítems cancelados está vacía, podrías querer cambiar el estado de visualización
        if (updatedCancellationItems.length === 0) {
            setShowCancellation(false);
        }
    };


    const ITEMS_PER_PAGE = 24;
    const ordersContainerRef = useRef(null);

    const filteredOrders = allOrders.filter((order) => {
        const filterByStatus = !filter || order.status === filter;
        const filterBySearch = !search || order.id.toString().includes(search);
        return filterByStatus && filterBySearch;
    });


    const filteredMesas = mesas.filter((mesa) => {
        const filterByStatus = !filter || mesa.Estado === filter;
        const filterBySearch = !search || mesa.ID.toString().includes(search);
        const filterBySection = !seccionSeleccionada || mesa.Seccion === seccionSeleccionada;

        return filterByStatus && filterBySearch && filterBySection;
    });


    // Dentro de tu componente:
    // Filtro las mesas basado en la sección seleccionada y luego las ordeno si es necesario
    const mesasFiltradas = mesas.filter(mesa => !seccionSeleccionada || mesa.Seccion === seccionSeleccionada);
    const mesasToDisplay = seccionSeleccionada === '1' ? orderMesasByName(mesasFiltradas) : mesasFiltradas;


    const handlePageChange = (page) => setCurrentPage(page);
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };
    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
        setOrderDetails(order.items); // Suponiendo que cada orden tiene una propiedad 'items'
    };

    const indexOfLastOrder = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstOrder = indexOfLastOrder - ITEMS_PER_PAGE;
    const currentOrders = filteredMesas.slice(indexOfFirstOrder, indexOfLastOrder);
    const currentMesas = filteredMesas.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredMesas.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (ordersContainerRef.current) {
            ordersContainerRef.current.scrollTop = ordersContainerRef.current.scrollHeight;
        }
    }, [selectedOrder]);

    const renderOrderDetails = () => {
        if (!selectedOrder) {
            return <p>Seleccione una orden para ver los detalles.</p>;
        }
    }

    const handleCheckChange = (index) => {
        let newItems = [...selectedOrder.items];
        newItems[index].checked = !newItems[index].checked;
        setSelectedOrder({ ...selectedOrder, items: newItems });
    };



    const handleStartCancellation = () => {
        setShowCancellation(true);
        // Aquí podrías incluir cualquier otra lógica necesaria para iniciar el proceso de cancelación
    };
    const handleOpenDetails = () => {
        setShowCancellation(false);
        // Aquí puedes restablecer cualquier estado relacionado con la cancelación si es necesario
    };

    function getMesaClass(estado) {
        switch (estado) {
            case "LIBRE":
                return "mesa-libre";
            case "ESPERANDO":
                return "mesa-esperando";
            case "ABIERTO":
                return "mesa-pedido";
            case "PREPARADO":
                return "mesa-preparado";
            case "PAGANDO":
                return "mesa-pagando";
            case "RESERVADO":
                return "mesa-reservado";
            case "PAGADO":
                return "mesa-pagado";
            case "PROCESANDO":
                return "mesa-procesando";
            case "CANCELACION":
                return "mesa-cancelacion";
            case "CANCELACION_P":
                return "mesa-cancelacion-p";
            default:
                return "";
        }
    }


    return (
        <>
            <Container fluid>
                <Row className="mb-3">
                    <Col>
                        <h4>Gestión de Mesas</h4>
                    </Col>
                </Row>
              
                <Row>
                {showPaymentForm && selectedOrder && (
                    <Col md={8}>
                        <div className="order-details">
                            <PaymentComponent
                            total={selectedOrder.total} 
                            orderId={selectedOrder.id} 
                            setShowCambioModal={setShowCambioModal}
                           
                            />
                        </div>
                    </Col>
                )}
                  {!showPaymentForm   && (
                     <Col md={8} className="product-column">
                     <Row className="mb-3">
                         <Col md={6} className="mb-3">
                             <Form.Control
                                 type="text"
                                 placeholder="Buscar por ID de orden"
                                 value={search}
                                 onChange={(e) => setSearch(e.target.value)}
                             />
                         </Col>
                         <Col xs={12} md={6}>
                             <Form.Select value={filter} onChange={handleFilterChange}>
                                 <option value="">Todos los estados</option>
                                 <option value="Pendiente">Pendiente</option>
                                 <option value="Completado">Completado</option>
                                 {/* Agregar más estados según sea necesario */}
                             </Form.Select>
                         </Col>
                         <Col>
                             <div className="botones-seccion">
                                 {Object.entries(secciones).map(([codigo, nombre]) => (
                                     <Button
                                         key={codigo}
                                         variant={seccionSeleccionada === codigo ? "primary" : "secondary"}
                                         onClick={() => setSeccionSeleccionada(codigo)}
                                     >
                                         {nombre}
                                     </Button>
                                 ))}
                             </div>


                         </Col>
                     </Row>

                     <Row>

                     {mesasToDisplay.map((mesa, index) => (
<div key={mesa.ID} className="col-7-custom">
 <Button
   variant="outline-primary"
   className={`w-100 h-100 d-flex flex-column align-items-center justify-content-center p-2 ${getMesaClass(mesa.Estado)}`}
   onClick={() => handleMesaSelect(mesa)}
 >
   <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{mesa.Nombre}</div>
   {mesa.Estado !== 'LIBRE' ? (
     <>
       <div style={{
         color: 'green', backgroundColor: '#f0f0f0', fontWeight: 'bold',
         padding: '5px', borderRadius: '5px'
       }}>
       <span style={{ fontSize: '16px' }}>Total:</span> 
         <span style={{ fontSize: '22px', marginLeft: '5px' }}>$ {mesa.TotalOrden}</span>
       </div>
       <div className="mesa-actions">
         <button
           className="mesa-action-btn"
           onClick={() => viewOrder(mesa.ID)}
         >
           <FontAwesomeIcon icon={faEye} />Ver cuenta {/* Icono de ver */}
         </button>
         <button
           className="mesa-action-btn"
           onClick={() => printOrder(mesa.ID)}
         >
           <FontAwesomeIcon icon={faPrint} />Imprimir {/* Icono de imprimir */}
         </button>
       </div>
     </>
   ) : (
     <div style={{ 
       display: 'flex', 
       flexDirection: 'column', 
       justifyContent: 'center', 
       alignItems: 'center',
       opacity: 0, // Hace que el contenido sea invisible pero aún ocupe espacio
       height: '100%' // Asegúrate de que ocupe todo el espacio disponible
     }}>
       <div style={{ height: '50px' }} /> {/* Placeholder para el total */}
       <div style={{ height: '50px' }} /> {/* Placeholder para las acciones */}
     </div>
   )}
 </Button>
</div>
))}


                     </Row>
                     <Row>
                         <Col className="d-flex justify-content-center">
                             <Pagination>
                                 {/* Paginación */}
                             </Pagination>
                         </Col>
                     </Row>
                 </Col>

                )}
                   


                    <Col md={4} className="order-column">
                        <div className="order-details">
                            {selectedMesa  && (
<>
<div className="order-header">  
<h4>Mesa {selectedMesa.Nombre}</h4>
<Button variant="info"   onClick={() => handleNuevaCuentaClick(selectedMesa.ID)}
          >NUEVA ORDEN</Button> 
                 </div>

</>
)}

                            {/* Llamada a la función que renderiza los detalles de la mesa seleccionada */}
                            {renderOrder()}
                            {renderMesaOptions()}
                         
                            
                        </div>
                    </Col>

                </Row>
            </Container>
        </>
    );

}