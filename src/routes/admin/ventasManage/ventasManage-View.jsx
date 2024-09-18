import React, { useRef, useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { Table, Container, Row, Col, Button, Pagination, Form, Spinner, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt,faEdit, faTrash, faPaperPlane, faClipboardList, faUtensils, faUser, faPlus } from '@fortawesome/free-solid-svg-icons';
import './ventasManage.css';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../../../api';
import { useUser } from '/src/UserContext';

const urlProductos = import.meta.env.VITE_APP_URL_PRODUCTOS;

import { CustomerSelect } from '../../../components/components';
import { AddProductForm, AddProviderModal, EditProductForm } from '../../../components/components';

export const VentasManageView = (props) => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { mesaId } = useParams();
    const commentInputRefs = useRef({});

    const [mesaNombre, setMesaNombre] = useState('');
    const [vendedorNombre, setVendedorNombre] = useState('');
    const [vendedorId, setVendedorId] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [currentDiner, setCurrentDiner] = useState(1);
    const [dinersOrders, setDinersOrders] = useState({});
    const [enviandoOrden, setEnviandoOrden] = useState(false);
    const [mensajeActual, setMensajeActual] = useState('');
    const [indiceMensaje, setIndiceMensaje] = useState(0);
    const [barcode, setBarcode] = useState('');

    const barcodeInputRef = useRef(null);
    const ordersContainerRef = useRef(null);

    const [newProduct, setNewProduct] = useState(null);
    const priceInputRefs = useRef({});

    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showEditProductModal, setShowEditProductModal] = useState(false);

    const [discounts, setDiscounts] = useState({}); // Estado para almacenar descuentos por producto

    // Agrega estos estados para los filtros de búsqueda
    const [filterTalla, setFilterTalla] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [filterModelo, setFilterModelo] = useState('');
    const [filterEstilo, setFilterEstilo] = useState('');


    useEffect(() => {
        if (ordersContainerRef.current) {
            ordersContainerRef.current.scrollTop = ordersContainerRef.current.scrollHeight;
            console.log("Scroll Top:", ordersContainerRef.current.scrollTop);
            console.log("Scroll Height:", ordersContainerRef.current.scrollHeight);
        }
    }, [dinersOrders]);

    

    const [newProductDetails, setNewProductDetails] = useState({
        Nombre: '',
        Precio1: '',
        Existencia: '',
        Proveedor: 0,
        Descripcion: '',
        CodigoBarras: '',
        Familia: 'VARIOS',
        Marca: '',
        Modelo: '',
        Talla: '',
        Estilo: '',
    });

    const [editProductDetails, setEditProductDetails] = useState({
        ID: '',
        Nombre: '',
        Precio1: '',
        Existencia: '',
        Proveedor: 0,
        Descripcion: '',
        CodigoBarras: '',
        Familia: 'VARIOS',
        Marca: '',
        Modelo: '',
        Talla: '',
        Estilo: '',
    });

    const resetNewProductDetails = () => {
        setNewProductDetails({
            Nombre: '',
            Precio1: '',
            Existencia: '',
            Proveedor: 0,
            Descripcion: '',
            CodigoBarras: '',
            Familia: 'VARIOS',
            Marca: '',
            Modelo: '',
            Talla: '',
            Estilo: '',
        });
    };

    const handleCloseAddProductModal = () => {
        resetNewProductDetails();  // Limpia los detalles del nuevo producto
        setShowAddProductModal(false);  // Cierra el modal
    };

    const [showProviderModal, setShowProviderModal] = useState(false);
    const [newProvider, setNewProvider] = useState({
        Nombre: '',
        Telefono: '',
        Correo: ''
    });

    // Funciones y lógica del componente
    const handleCloseProviderModal = () => {
        setNewProvider({ Nombre: '', Telefono: '', Correo: '' });
        setShowProviderModal(false);
        // Aquí puedes agregar lógica para actualizar la lista de proveedores si es necesario
    };

    useEffect(() => {
        barcodeInputRef.current.focus();
    }, []);

    useEffect(() => {
        if (!user || Object.keys(user).length === 0) {
            navigate('/lockscreen');
        }
    }, [user, navigate]);

    useEffect(() => {
        const obtenerDatosMesa = async () => {
            try {
                const response = await axios.post(apiUrls.getMeseroAndTicketByMesaId, { mesaId });
                setMesaNombre(response.data.NombreMesa);
                setVendedorNombre(response.data.NombreVendedor);
            } catch (error) {
                console.error("Error al obtener los datos de la mesa:", error);
            }
        };

        if (mesaId) {
            obtenerDatosMesa();
        }
    }, [mesaId]);

    const { fetchProducts,
        allProducts, allCategories, customers, agregarProducto,
         allProveedores, agregarProveedor, fetchProveedores, 
         actualizarProducto, editarProducto, eliminarProducto } = props;

    // console.log("allProveedores", allProveedores)
    const ITEMS_PER_PAGE = 12;

    const handleBarcodeInput = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const enteredValue = e.target.value.trim().toLowerCase();

            // Verificar si el input contiene solo números (código de barras)
            const isBarcode = /^\d+$/.test(enteredValue);

            if (isBarcode) {
                // Filtrar los productos que coinciden con el código de barras ingresado
                const productByBarcode = allProducts.find(product =>
                    product.CodigoBarras  === enteredValue
                );

                if (productByBarcode) {
                    // Si se encuentra un producto con ese código de barras, añadirlo a la orden
                    addProductToDinerOrder(productByBarcode, true);
                } else {
                    // Si no se encuentra un producto con ese código de barras, abrir el modal de agregar producto
                    setNewProductDetails(prevDetails => ({
                        ...prevDetails,
                        CodigoBarras: enteredValue // Poner el código de barras en el formulario
                    }));
                    setShowAddProductModal(true); // Mostrar el modal
                }

            } else {
                // Mantener la lógica existente para la búsqueda por nombre o coincidencia parcial
                const filteredProducts = allProducts.filter(product =>
                    product.Nombre.toLowerCase().includes(enteredValue) ||
                    product.CodigoBarras  === enteredValue
                );

                // Si solo hay un producto filtrado, agregarlo a la orden
                if (filteredProducts.length === 1) {
                    addProductToDinerOrder(filteredProducts[0], true);
                } else {
                    // Buscar producto por nombre exacto o código de barras exacto
                    const productToAdd = allProducts.find(product =>
                        product.Nombre.toLowerCase() === enteredValue ||
                        product.CodigoBarras  === enteredValue
                    );
                    if (productToAdd) {
                        addProductToDinerOrder(productToAdd, true);
                    } else {
                        const tempProduct = {
                            Nombre: enteredValue,
                            Precio1: '',
                            Familia: filter || 'VARIOS',
                            CodigoBarras: '',
                            isTemporary: true
                        };
                        addProductToDinerOrder(tempProduct, false);
                    }
                }
            }

            e.target.value = ''; // Limpiar el campo de búsqueda
            setSearch('');
        }
    };

    const mensajes = ["Enviando Comanda", "Procesando Orden", "Imprimiendo..."];

    useEffect(() => {
        let timerId;

        if (enviandoOrden && indiceMensaje < mensajes.length) {
            setMensajeActual(mensajes[indiceMensaje]);
            timerId = setTimeout(() => {
                setIndiceMensaje(indiceMensaje + 1);
            }, 1000);
        }

        return () => clearTimeout(timerId);
    }, [enviandoOrden, indiceMensaje, mensajes]);

    const iniciarEnvio = () => {
        setEnviandoOrden(true);
        setIndiceMensaje(0);
      //  setTimeout(() => {
      //      setEnviandoOrden(false);
      //  }, mensajes.length * 1000);
    };

    const changeDiner = (newDiner) => {
        setCurrentDiner(newDiner);
        if (!dinersOrders[newDiner]) {
            setDinersOrders({ ...dinersOrders, [newDiner]: [] });
        }
    };


    const addNewProduct = () => {
        const isBarcode = /^\d+$/.test(search.trim());

        const tempProduct = {
            Nombre: isBarcode ? '' : search,  // Si es un código de barras, deja el nombre vacío
            Precio1: '',
            Familia: filter || 'VARIOS',
            CodigoBarras: isBarcode ? search.trim() : '',  // Si es un código de barras, úsalo aquí
            isTemporary: true // Marca este producto como temporal
        };

        setNewProduct(tempProduct);
        addProductToDinerOrder(tempProduct);
        setNewProduct(null); // Limpiar el estado después de añadir
        //  setShowAddProductModal(true); // Mostrar el modal para agregar producto
    };


    const handleAddProductConfirm = (addedProduct) => {
        console.log("addedProduct", addedProduct)

        const updatedDinersOrders = { ...dinersOrders };

        // Asegúrate de que la orden para el comensal actual esté inicializada
        if (!updatedDinersOrders[currentDiner]) {
            updatedDinersOrders[currentDiner] = [];
        }

        // Filtrar solo los productos temporales que no tienen datos relevantes (como Nombre y Precio1)
        const filteredDinerOrders = updatedDinersOrders[currentDiner].filter(product => {
            if (product.isTemporary) {
                return product.Nombre.trim() !== '' || product.Precio1 !== ''; // Si el nombre o precio no están vacíos, no lo borres
            }
            return true; // Mantén todos los productos no temporales
        });

        // Agregar el nuevo producto a la orden del comensal actual
        updatedDinersOrders[currentDiner] = [
            ...filteredDinerOrders,
            { ...addedProduct, cantidad: 1, nota: '', isTemporary: false }
        ];

        setDinersOrders(updatedDinersOrders);
        console.log("dinersOrders", dinersOrders)
        setShowAddProductModal(false);
    };

    // Función para manejar cambios en los detalles del nuevo producto
    const handleNewProductChange = (e, field) => {
        setNewProduct({
            ...newProduct,
            [field]: e.target.value
        });
    };

    // Función para agregar el nuevo producto a la orden
    const addTemporaryProductToOrder = () => {
        addProductToDinerOrder(newProduct);
        setNewProduct(null); // Limpiar el estado del nuevo producto después de añadirlo
    };

    const addProductToDinerOrder2 = (selectedProduct, exists, note = '') => {
        const dinerOrders = dinersOrders[currentDiner] || [];
        const productExistsIndex = dinerOrders.findIndex(product => product.ID === selectedProduct.ID && product.nota === note && !product.isTemporary);
        let newDinerOrders;

        if (productExistsIndex !== -1) {
            newDinerOrders = dinerOrders.map((product, index) =>
                index === productExistsIndex ? { ...product, cantidad: product.cantidad + 1 } : product
            );
        } else {
            newDinerOrders = [...dinerOrders, { ...selectedProduct, cantidad: 1, nota: note }];
        }

        setDinersOrders({ ...dinersOrders, [currentDiner]: newDinerOrders });

        setTimeout(() => {
            if (exists) {
                barcodeInputRef.current.focus();
            } else {
                const lastIndex = newDinerOrders.length - 1;
                if (priceInputRefs.current[currentDiner] && priceInputRefs.current[currentDiner][lastIndex]) {
                    priceInputRefs.current[currentDiner][lastIndex].focus();
                }
            }
        }, 100);
    };
    const addProductToDinerOrder = (selectedProduct, exists, note = '') => {
        const dinerOrders = dinersOrders[currentDiner] || [];
        const productExistsIndex = dinerOrders.findIndex(product => product.ID === selectedProduct.ID && product.nota === note && !product.isTemporary);
        let newDinerOrders;
        
        // Concatenar la talla y el estilo en la nota
        const productNote = `${note} Talla: ${selectedProduct.Talla || ''}, (${selectedProduct.Modelo || ''})`.trim();
        
        if (productExistsIndex !== -1) {
            newDinerOrders = dinerOrders.map((product, index) =>
                index === productExistsIndex ? { ...product, cantidad: product.cantidad + 1 } : product
            );
        } else {
            newDinerOrders = [...dinerOrders, { ...selectedProduct, cantidad: 1, nota: productNote, Precio1Original: selectedProduct.Precio1 }];
        }
    
        setDinersOrders({ ...dinersOrders, [currentDiner]: newDinerOrders });
    
        setTimeout(() => {
            if (exists) {
                barcodeInputRef.current.focus();
            } else {
                const lastIndex = newDinerOrders.length - 1;
                if (priceInputRefs.current[currentDiner] && priceInputRefs.current[currentDiner][lastIndex]) {
                    priceInputRefs.current[currentDiner][lastIndex].focus();
                }
            }
        }, 100);
    };
    
    
    const removeProductFromDinerOrder = (productToRemove, idx) => {
        setDinersOrders((prevDinersOrders) => {
            const dinerOrders = prevDinersOrders[currentDiner] || [];
            let newDinerOrders = [...dinerOrders];
    
            // Busca el producto específico en la lista de órdenes del comensal actual
            const productIndex = newDinerOrders.findIndex(
                (product, index) => index === idx && product.ID === productToRemove.ID && product.nota === productToRemove.nota
            );
    
            // Si se encuentra el producto, maneja la cantidad
            if (productIndex !== -1) {
                if (newDinerOrders[productIndex].cantidad > 1) {
                    // Si hay más de una unidad, simplemente reduce la cantidad
                    newDinerOrders[productIndex].cantidad -= 1;
                } else {
                    // Si solo hay una unidad, elimina el producto de la lista
                    newDinerOrders.splice(productIndex, 1);
                }
            }
    
            return { ...prevDinersOrders, [currentDiner]: newDinerOrders };
        });
    };
    

    const orderTotal = (dinersOrders[currentDiner] || []).reduce((total, product) => total + product.Precio1 * product.cantidad, 0);
/*
    const filteredProducts = allProducts.filter((product) => {
        const filterByStatus = filter === '' || product.Familia === filter;
        const filterBySearch = search === '' || (product.Nombre && product.Nombre.toLowerCase().includes(search.toLowerCase())) || (product.Familia && product.Familia.toLowerCase().includes(search.toLowerCase())) || (product.CodigoBarras && product.CodigoBarras.toLowerCase().includes(search.toLowerCase()));
        return filterByStatus && filterBySearch;
    });
*/
const filteredProducts = allProducts.filter((product) => {
    const filterByStatus = filter === '' || (product.Familia && product.Familia.trim().toUpperCase() === filter.trim().toUpperCase());
    
    const filterBySearch = search === '' || 
        (product.Nombre && product.Nombre.toLowerCase().includes(search.toLowerCase())) ||
        (product.Familia && product.Familia.toLowerCase().includes(search.toLowerCase())) ||
        (product.CodigoBarras && product.CodigoBarras.toLowerCase().includes(search.toLowerCase()));

    const filterByTalla = filterTalla === '' || (product.Talla && product.Talla.trim() === filterTalla.trim()); // Normalización
    
    const filterByMarca = filterMarca === '' || (product.Marca && product.Marca.trim().toUpperCase() === filterMarca.trim().toUpperCase());
    const filterByModelo = filterModelo === '' || (product.Modelo && product.Modelo.trim().toUpperCase() === filterModelo.trim().toUpperCase());
    const filterByEstilo = filterEstilo === '' || (product.Estilo && product.Estilo.trim().toUpperCase() === filterEstilo.trim().toUpperCase());

    return filterByStatus && filterBySearch && filterByTalla && filterByMarca && filterByModelo && filterByEstilo;
});




    
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const handleNoteChange = (e, index, dinerNumber) => {
        const newNote = e.target.value;
        const dinerOrders = dinersOrders[dinerNumber] || [];
        let newDinerOrders = [...dinerOrders]; // Hacemos una copia de los pedidos para evitar la mutación directa

        // Verificamos si el índice proporcionado es válido y actualizamos la nota del producto correspondiente
        if (index >= 0 && index < dinerOrders.length) {
            newDinerOrders[index] = { ...newDinerOrders[index], nota: newNote };
        }

        // Actualiza la orden del comensal específico con la nueva nota
        setDinersOrders({ ...dinersOrders, [dinerNumber]: newDinerOrders });
    };

    const handleProductDetailChange = (e, idx, dinerNumber, field) => {
        const value = field === 'Precio1' ? parseFloat(e.target.value) : e.target.value;
        const dinerOrders = dinersOrders[dinerNumber] || [];
        let newDinerOrders = [...dinerOrders];
        if (idx >= 0 && idx < dinerOrders.length) {
            newDinerOrders[idx] = { ...newDinerOrders[idx], [field]: value };
        }
        setDinersOrders({ ...dinersOrders, [dinerNumber]: newDinerOrders });
    };


    const updateProductQuantity = (product, idx, dinerNumber, change) => {
        const newQuantity = product.cantidad + change;
        if (newQuantity > 0) {
            const dinerOrders = dinersOrders[dinerNumber] || [];
            let newDinerOrders = [...dinerOrders];
            newDinerOrders[idx] = { ...newDinerOrders[idx], cantidad: newQuantity };
            setDinersOrders({ ...dinersOrders, [dinerNumber]: newDinerOrders });
        }
    };

    const updateProductDetail = (newDetails) => {
        setEditProductDetails(newDetails);
    };

    const handleDoubleClick = async (product) => {
        if (product.isTemporary) {
            try {
                setNewProductDetails({
                    Nombre: product.Nombre,
                    Precio1: product.Precio1,
                    Existencia: 0,
                    Proveedor: 0,
                    Descripcion: '',
                    CodigoBarras: product.CodigoBarras,
                    Familia: product.Familia || 'VARIOS',
                });
                setShowAddProductModal(true);
            } catch (error) {
                console.error("Error al manejar doble clic en el producto:", error);
            }
        } else {
            try {
                setEditProductDetails({
                    ID: product.ID,
                    Nombre: product.Nombre,
                    Precio1: product.Precio1,
                    Existencia: product.Existencia,
                    Proveedor: product.Proveedor,
                    Descripcion: product.Descripcion,
                    CodigoBarras: product.CodigoBarras,
                    Familia: product.Familia || 'VARIOS',
                });
                setShowEditProductModal(true);
            } catch (error) {
                console.error("Error al manejar doble clic en el producto:", error);
            }
        }
    };

    const enviarOrdenAlBackend = async () => {
        if (enviandoOrden) return; // Previene múltiples envíos

       
        iniciarEnvio();
        setEnviandoOrden(true);

        console.log("Antes de agregar productos", dinersOrders);

        let updatedDinersOrders = { ...dinersOrders };
        console.log("updatedDinersOrders", updatedDinersOrders)

        for (const [comensalId, orders] of Object.entries(updatedDinersOrders)) {
            updatedDinersOrders[comensalId] = orders.map(order => ({
                ...order,
                Precio1: parseFloat(order.Precio1) || 0, // Asegura que Precio1 sea un número, si no, lo pone en 0
                Familia: order.Familia || 'VARIOS'  // Asegura que Familia tenga un valor por defecto
            }));
        }

        for (const [comensalId, orders] of Object.entries(dinersOrders)) {
            for (const order of orders) {
                if (order.isTemporary) {
                    try {
                        // Prepara los datos del producto para el envío
                        const formData = new FormData();
                        formData.append('Nombre', order.Nombre);
                        formData.append('Precio1', order.Precio1);
                        formData.append('Existencia', order.Existencia || 0);
                        formData.append('Proveedor', order.Proveedor || 0);
                        formData.append('Descripcion', order.Descripcion || '');
                        formData.append('CodigoBarras', order.CodigoBarras || '');
                        formData.append('Familia', order.Familia || 'VARIOS');

                        // Llama a la función para agregar el producto a la base de datos
                        const response = await agregarProducto(formData);

                        // Actualiza el producto en dinersOrders para que ya no sea temporal
                        updatedDinersOrders[comensalId] = updatedDinersOrders[comensalId].map(p =>
                            p.ID === order.ID ? { ...p, isTemporary: false } : p
                        );
                        console.log("Nuevo producto agregado:", response.data);

                    } catch (error) {
                        console.error("Error al agregar producto a la base de datos:", error);
                    }
                }
            }
        }

        setDinersOrders(updatedDinersOrders);

        console.log("Después de agregar productos", updatedDinersOrders);

        const detalles = Object.entries(updatedDinersOrders).flatMap(([comensalId, orders]) => {
            return orders.map(order => ({
                codigo: order.ID,
                nombre: order.Nombre,
                precio: order.Precio1,
                cantidad: order.cantidad,
                categoria: order.Familia || 'VARIOS',
                nota: order.nota || "",
                comensalId: parseInt(comensalId),
                descuento:order.Descuento
            }));
        });

        const cliente = selectedCustomer ? selectedCustomer.value : null;

        const datosDeLaOrden = {
            mesaId,
            vendedor: user.ID,
            cliente,
            detalles
        };

        try {
            const response = await axios.post(apiUrls.gestionarNuevaOrden, { datosDeLaOrden });
            navigate(`/ordenes/${response.data}`);
        } catch (error) {
            console.error("Error al gestionar la nueva orden:", error);
            console.error("Detalles del error:", error.response ? error.response.data : error.message);
        }
        setEnviandoOrden(false);
    };

    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
    };

    const handleEditProductConfirm = (updatedProduct) => {
        const updatedDinersOrders = { ...dinersOrders };
        Object.entries(updatedDinersOrders).forEach(([comensalId, orders]) => {
            updatedDinersOrders[comensalId] = orders.map(order =>
                order.ID === updatedProduct.ID ? { ...order, ...updatedProduct } : order
            );
        });
        setDinersOrders(updatedDinersOrders);
        setShowEditProductModal(false);
    };
    console.log("dinersOrders", dinersOrders)

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);  // Resetea a la primera página
    };

    const handleDiscountChange = (e, dinerNumber, idx) => {
        const discountAmount = parseFloat(e.target.value) || 0; // El monto del descuento directo
    
        setDiscounts(prevDiscounts => ({
            ...prevDiscounts,
            [dinerNumber]: {
                ...prevDiscounts[dinerNumber],
                [idx]: discountAmount // Actualiza el monto del descuento directamente
            }
        }));
    
        // Actualiza el precio del producto según el monto del descuento
        const dinerOrders = dinersOrders[dinerNumber] || [];
        let newDinerOrders = [...dinerOrders];
        if (idx >= 0 && idx < dinerOrders.length) {
            const originalPrice = parseFloat(newDinerOrders[idx].Precio1Original) || 0;
            newDinerOrders[idx] = {
                ...newDinerOrders[idx],
                Precio1: originalPrice - discountAmount, // Nuevo precio tras aplicar el descuento como monto directo
                Descuento:discountAmount
            };
        }
        setDinersOrders({ ...dinersOrders, [dinerNumber]: newDinerOrders });
    };
    
    
    
    const handleDoubleClickPrice = (dinerNumber, idx) => {
        setDiscounts(prevDiscounts => {
            // Verifica si el dinerNumber ya existe, si no, inicializa un objeto vacío para él
            const updatedDiscounts = { ...prevDiscounts };
            if (!updatedDiscounts[dinerNumber]) {
                updatedDiscounts[dinerNumber] = {};
            }
            // Verifica si el índice del producto ya existe, si no, inicializa a 0
            if (updatedDiscounts[dinerNumber][idx] === undefined) {
                updatedDiscounts[dinerNumber][idx] = 0;
            }
            return updatedDiscounts;
        });
    };
    
    const hasMembershipProduct = () => {
        return Object.values(dinersOrders).some((orders) =>
            orders.some((product) => product.Familia.toLowerCase() === "membresias")
        );
    };
    
    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          // Limpiar el campo de búsqueda y enfocar
          barcodeInputRef.current.value = '';
          barcodeInputRef.current.focus();
        }
      };
      

    return (
        <Container fluid>
            <Row className="d-flex flex-row">
                <Col md={8} className="product-column">
                    
                    <Row className="mb-3">
                        <Col md={3} className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre o categoría"
                                value={search}
                                onChange={handleSearchChange}
                                onKeyDown={handleBarcodeInput}
                                ref={barcodeInputRef}
                            />
                        </Col>
                        <Col xs={6} md={3}>
                            <Form.Select value={filter} onChange={handleFilterChange}>
                                <option value="">Todas las Categorías</option>
                                {allCategories.map((categoria) => (
                                    <option key={categoria.ID} value={categoria.Familia}>
                                        {categoria.Familia}
                                    </option>
                                ))}
                            </Form.Select>
                        </Col>
                        
                        <Col xs={6} md={3}>
        <Form.Select value={filterTalla} onChange={(e) => setFilterTalla(e.target.value)}>
            <option value="">Todas las Tallas</option>
            {/* Asegúrate de que tienes una lista de tallas únicas, por ejemplo: */}
            {[...new Set(allProducts.map(product => product.Talla))].map((talla, index) => (
                <option key={index} value={talla}>
                    {talla}
                </option>
            ))}
        </Form.Select>
    </Col>
    {/* Nuevo selector para buscar por modelo */}
    <Col xs={6} md={3}>
        <Form.Select value={filterModelo} onChange={(e) => setFilterModelo(e.target.value)}>
            <option value="">Todos los Modelos</option>
            {[...new Set(allProducts.map(product => product.Modelo))].map((modelo, index) => (
                <option key={index} value={modelo}>
                    {modelo}
                </option>
            ))}
        </Form.Select>
    </Col>

    {/* Nuevo selector para buscar por marca */}
    <Col xs={6} md={3}>
        <Form.Select value={filterMarca} onChange={(e) => setFilterMarca(e.target.value)}>
            <option value="">Todas las Marcas</option>
            {[...new Set(allProducts.map(product => product.Marca))].map((marca, index) => (
                <option key={index} value={marca}>
                    {marca}
                </option>
            ))}
        </Form.Select>
    </Col>
    
    {/* Nuevo selector para buscar por estilo */}
    <Col xs={6} md={3}>
        <Form.Select value={filterEstilo} onChange={(e) => setFilterEstilo(e.target.value)}>
            <option value="">Todos los Estilos</option>
            {[...new Set(allProducts.map(product => product.Estilo))].map((estilo, index) => (
                <option key={index} value={estilo}>
                    {estilo}
                </option>
            ))}
        </Form.Select>
    </Col>
    <Col xs={1} md={3} lg={3} className="mb-4">
    <Button
        variant="outline-info"
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-1"
        onClick={fetchProducts} // Llama a la función de actualización
    >
        <FontAwesomeIcon icon={faSyncAlt} size="2x" />
        <div>Actualizar Productos</div>
    </Button>
</Col>
                    </Row>

                    <Row>
                        <Col xs={12} md={6} lg={3} className="mb-4">
                            <Button
                                variant="outline-success"
                                className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-1"
                                onClick={() => addNewProduct(barcodeInputRef.current)} // Pasa la referencia del input aquí
                            >
                                <FontAwesomeIcon icon={faPlus} size="2x" />
                                <div>NUEVO PRODUCTO</div>
                                <div>$ 0.00</div>
                                <div>{filter || ""}</div>
                            </Button>
                        </Col>

                        {currentProducts.map((product) => (
                            <Col xs={12} md={6} lg={3} key={product.ID} className="mb-4">
                                <Button
                                    variant="outline-primary"
                                    className="w-100 h-100 d-flex flex-column align-items-center justify-content-center p-1"
                                    onClick={() => addProductToDinerOrder(product, true)}
                                >
                                     <div>{product.Nombre} ({product.Modelo})  T-{product.Talla} </div>
                                     <div>$ {product.Precio1}</div>
                                    <img  
                                        src={`${urlProductos}sku-${product.ID}.jpg`}
                                        onError={(e) => e.target.src = `${urlProductos}sku-default.jpg`}
                                        alt={product.Nombre}
                                        style={{ width: '100%', height: '100px', maxWidth: '100px', marginBottom: '2px' }}
                                    />
                                   
                                    
                                    <div>{product.Familia}</div>
                                    <div>ID:#{product.ID}</div>
                                    
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
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                                        {page}
                                    </Pagination.Item>
                                ))}
                                {currentPage < totalPages && (
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                                )}
                            </Pagination>
                        </Col>
                    </Row>
                </Col>
                <Col md={4}>
                    {enviandoOrden ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: "100%", minHeight: "200px" }}>
                            <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Enviando...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <>
                            <div className="orden-container">
                                <div className="order-header p-1 mb-1">
                                    <h4>
                                        <FontAwesomeIcon icon={faClipboardList} /> Nueva Orden
                                    </h4>
                                    <h5 hidden className="text-white">
                                        <FontAwesomeIcon icon={faUtensils} /> Mesa: {mesaNombre}
                                    </h5>
                                    <h6>
                                        <FontAwesomeIcon icon={faUser} />  {user?.Nombre || 'Usuario'}
                                    </h6>
                                </div>

                                <div className="customer-search" hidden>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Ingrese el celular"
                                            aria-label="Número de celular del cliente"
                                        />
                                        <Button variant="outline-secondary" id="button-search">
                                            Buscar
                                        </Button>
                                    </InputGroup>
                                </div>

                                <Row className="mb-3">
                                    <Col>
                                        <CustomerSelect customers={customers} onSelectCustomer={handleSelectCustomer} />
                                    </Col>
                                </Row>

                                <div className="orden-column" ref={ordersContainerRef}>
                                    <Table striped bordered>
                                        <thead>
                                            <tr>
                                                <th>Cantidad</th>
                                                <th>Nombre</th>
                                                <th>Precio</th>
                                                <th>Total</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(dinersOrders).map(([dinerNumber, orders]) => (
                                                <React.Fragment key={dinerNumber}>
                                                    {orders.map((product, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <div className="quantity-control">
                                                                    <button type="button" className="quantity-btn decrease" onClick={() => updateProductQuantity(product, idx, Number(dinerNumber), -1)}>-</button>
                                                                    <input type="text" className="quantity-input" value={product.cantidad} readOnly />
                                                                    <button type="button" className="quantity-btn increase" onClick={() => updateProductQuantity(product, idx, Number(dinerNumber), 1)}>+</button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    value={product.Nombre}
                                                                    onChange={(e) => handleProductDetailChange(e, idx, Number(dinerNumber), 'Nombre')}
                                                                    ref={(el) => {
                                                                        if (!commentInputRefs.current[dinerNumber]) {
                                                                            commentInputRefs.current[dinerNumber] = {};
                                                                        }
                                                                        commentInputRefs.current[dinerNumber][idx] = el;
                                                                    }}
                                                                    onDoubleClick={() => handleDoubleClick(product, commentInputRefs.current[dinerNumber][idx])} // Pasa la referencia aquí
                                                                />
                                                                <input
                                                                    type="text"
                                                                    placeholder="Agregar nota aquí"
                                                                    value={product.nota || ''}
                                                                    onChange={(e) => handleNoteChange(e, idx, Number(dinerNumber))}
                                                                />
                                                            </td>
                                                            <td>
    <input
        type="number"
        className="price-input"
        value={product.Precio1}
        onChange={(e) => handleProductDetailChange(e, idx, Number(dinerNumber), 'Precio1')}
        ref={(el) => {
            if (!priceInputRefs.current[dinerNumber]) {
                priceInputRefs.current[dinerNumber] = {};
            }
            priceInputRefs.current[dinerNumber][idx] = el;
        }}
        onDoubleClick={() => handleDoubleClickPrice(Number(dinerNumber), idx)}
        onKeyDown={(e) => handleEnterPress(e)}
    />
    {discounts[dinerNumber] && discounts[dinerNumber][idx] !== undefined && (
        <input
            type="number"
            className="discount-input mt-1" // Clase CSS para el estilo
            placeholder="Ingrese descuento"
            value={discounts[dinerNumber][idx]}
            onChange={(e) => handleDiscountChange(e, Number(dinerNumber), idx)}
        />
    )}
</td>

                                                            <td>
                                                                ${isNaN(product.Precio1 * product.cantidad) ? '0.00' : (product.Precio1 * product.cantidad).toFixed(2)}
                                                            </td>
                                                            <td>
  <Button variant="danger" size="sm" onClick={() => removeProductFromDinerOrder(product, idx)}>Quitar</Button>
</td>

                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                            <div className="order-footer">
                                <h5 className="total-highlight">
                                    Total General: ${Object.values(dinersOrders).flat().reduce((total, product) => {
                                        const productTotal = isNaN(product.Precio1 * product.cantidad) ? 0 : product.Precio1 * product.cantidad;
                                        return total + productTotal;
                                    }, 0).toFixed(2)}
                                </h5>
                                <p>Cantidad de Artículos: {Object.values(dinersOrders).flat().reduce((total, product) => total + product.cantidad, 0)}</p>
                                <Button
                                    variant="primary"
                                    onClick={enviarOrdenAlBackend}
                                    disabled={enviandoOrden || (hasMembershipProduct() && !selectedCustomer)}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                    {enviandoOrden ? " Enviando..." : " Enviar Orden"}
                                </Button>

                            </div>
                        </>
                    )}
                </Col>
            </Row>

            <AddProductForm
                showAddModal={showAddProductModal}
                setShowAddModal={setShowAddProductModal}
                handleCloseAddProductModal={handleCloseAddProductModal}
                agregarProducto={agregarProducto}
                allCategories={allCategories}
                allProveedores={allProveedores}
                setShowProviderModal={setShowProviderModal} // Asegúrate de pasar esta función
                productDetails={newProductDetails} // Asegúrate de pasar esta función
                handleAddProductConfirm={handleAddProductConfirm}
            />
            <AddProviderModal
                show={showProviderModal}
                handleClose={handleCloseProviderModal}
                agregarProveedor={props.agregarProveedor}
                newProvider={newProvider}
                setNewProvider={setNewProvider}
            />
            <EditProductForm
                showEditModal={showEditProductModal}
                setShowEditModal={setShowEditProductModal}
                productDetail={editProductDetails}
                updateProductDetail={updateProductDetail}
                editarProducto={editarProducto}
                allCategories={allCategories}
                allProveedores={allProveedores}
                handleEditProductConfirm={handleEditProductConfirm}
            />
        </Container>

    );
};

VentasManageView.defaultProps = {
    allProveedores: []
};

export default VentasManageView;
