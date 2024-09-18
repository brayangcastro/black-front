import { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Button, Alert, Pagination, Form, Modal, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons';

import IconAdd from '../../../assets/icons/add.svg';
import IconDetail from '../../../assets/icons/userDetail.svg';
import IconPay from '../../../assets/icons/pay.svg';


import axios from 'axios';
import apiUrls from '../../../api';

import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFPreview = ({ pdfUrl, show, handleClose }) => {
    useEffect(() => {

        const loadWorker = async () => {
            const pdfjsLib = await import('pdfjs-dist/build/pdf');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        };

        loadWorker();
    }, []);

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Vista Previa del PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div style={{ height: '750px' }}>
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js">
                        <Viewer fileUrl={pdfUrl} />
                    </Worker>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PDFPreview;

const urlProductos = import.meta.env.VITE_APP_URL_PRODUCTOS;

export const ProductsManageView = (props) => {

    //const OrderListShopify = json;//json de testeo

    const { allProducts, allProveedores, allCategories, processPaymentFunction,
        actualizarProducto, agregarProducto, editarProducto,
        eliminarProducto, agregarProveedor, fetchProducts, fetchProveedores
    } = props;

    console.log("AQUI", allProducts)
    console.log("allProveedores", allProveedores)

    const productService = allProducts.filter(product => product.Familia === 'SERVICIOS');
    const productMemberships = allProducts.filter(product => product.Familia === 'MEMBRESIAS');

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState(''); // Nuevo estado para el campo de búsqueda
    const [showEditModal, setShowEditModal] = useState(false);

    const [newProvider, setNewProvider] = useState({
        Nombre: '',
        Telefono: '',
        Correo: ''
    });

    const handleCloseProviderModal = () => {
        setNewProvider({
            Nombre: '',
            Telefono: '',
            Correo: ''
        });
        setShowProviderModal(false);
        fetchProveedores(); // Actualizar la lista de proveedores al cerrar el modal
    };

    const handlePreviewEtiquetaPDF = async (producto) => {
        setLoadingEtiquetaId(producto.ID); // Inicia el estado de carga para el corte específico
        try {
            const response = await axios.get(`${apiUrls.etiquetaPDF}`, {
                params: {
                    productoId: producto.ID,
                    nombre: producto.Nombre,
                    precio: producto.Precio1
                },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            setPdfUrl(url);
            setShowPDFPreview(true);
        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        } finally {
            setLoadingEtiquetaId(null); // Finaliza el estado de carga
        }
    };

    const descargarEtiqueta = async (producto) => {
        try {
            // Solicitar el archivo PDF como un Blob
            const response = await axios.get(`${apiUrls.etiquetaPDF}`, {
                params: {
                    productoId: producto.ID,
                    nombre: producto.Nombre,
                    precio: producto.Precio1
                },
                responseType: 'blob', // Indica que esperamos una respuesta en forma de Blob
            });

            // Crear una URL para el Blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            //  setPdfUrl(url); // Establecer la URL del PDF en el estado
            //  setShowPDFModal(true); // Abrir el modal
            // Crear un enlace temporal para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ETIQUETA_` + producto.ID + `.pdf`); // Asignar un nombre al archivo descargado
            document.body.appendChild(link);

            // Iniciar la descarga
            link.click();

            // Limpiar al finalizar
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            console.log("Descarga iniciada");

        } catch (error) {
            // Manejar errores de la API o de red
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    // Modifica la función para incluir la lógica de búsqueda
    const filteredProducts = allProducts.filter((product) => {
        const filterByStatus = filter === '' || product.Familia === filter;
        const filterBySearch = search === '' ||
            (product.Nombre && product.Nombre.toLowerCase().includes(search.toLowerCase())) || (
                product.Familia && product.Familia.toLowerCase().includes(search.toLowerCase()));

        return filterByStatus && filterBySearch;
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

    const [showProviderModal, setShowProviderModal] = useState(false);

    //declaro la lógica del modal
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [orderDetail, setOrderDetail] = useState({});
    const [processPaymentData, setProcessPaymentData] = useState({});

    const [showProductModal, setShowProductModal] = useState(false);
    const [productDetail, setProductDetail] = useState({});

    const [showAddModal, setShowAddModal] = useState(false);
    const [showPDFPreview, setShowPDFPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [loadingEtiquetaId, setLoadingEtiquetaId] = useState(null); // Estado para manejar la carga por ID de corte

    const handleClosePDFPreview = async () => {
        try {
            // Aquí puedes agregar cualquier lógica para obtener los datos actualizados del producto si es necesario.
            const updatedProducts = await fetchProducts(); // Supón que esta función obtiene la lista actualizada de productos
            setProducts(updatedProducts);
        } catch (error) {
            console.error('Error al actualizar los productos:', error.message);
        } finally {
            setShowPDFPreview(false); // Cierra el modal
        }
    };

    function handleShowUserForm() {
        setShowAddModal(true);
    }

    function handleProductViewFunction(id) {
        setShowProductModal(true);
        setProductDetail(allProducts.find(product => product.ID === id));
    }

    function handleEditProductFunction(productId) {
        const productToEdit = allProducts.find(product => product.ID === productId);
        if (productToEdit) {
            setProductDetail(productToEdit); // Asegúrate de que este estado esté vinculado al formulario de edición.
            setShowEditModal(true); // Abre el modal de edición.
        }
    }

    function handleDetailViewFunction(id) {
        setShowDetailModal(true);
        setOrderDetail(OrderListShopify.find(orden => orden.IdOrden === id));
    }

    //declaro la lógica del botón de procesar pago
    useEffect(() => {
        // Verifica que processPaymentData tenga datos antes de realizar operaciones
        if (Object.keys(processPaymentData).length > 0) {
            processPaymentFunction(processPaymentData);
        }
    }, [processPaymentData]);

    // Declaro la lógica del botón de procesar pago
    function handleProcessOrder(id) {
        setProcessPaymentData(OrderListShopify.find(orden => orden.IdOrden === id));
    }

    const updateProductDetail = (newDetails) => {
        setProductDetail(newDetails);
    };

    //opciones de paginación

    const maxVisiblePages = 5; // Número máximo de páginas visibles
    const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfMaxVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const handleMouseOver = (e) => {
        e.currentTarget.style.backgroundColor = '#4a7a4f';
    };

    const handleMouseOut = (e) => {
        e.currentTarget.style.backgroundColor = '#5F9365';
    };

    return (
        <>
            <ProductDetailModal
                productDetail={productDetail}
                showProductModal={showProductModal}
                setShowProductModal={setShowProductModal}
            />
            <EditProductForm
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                productDetail={productDetail}
                updateProductDetail={updateProductDetail}
                actualizarProducto={actualizarProducto}
                allCategories={allCategories}
                editarProducto={editarProducto}
                allProveedores={allProveedores}
            />
            <AddProductForm
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                agregarProducto={agregarProducto}
                allCategories={allCategories}
                allProveedores={allProveedores}
                setShowProviderModal={setShowProviderModal} // Asegúrate de pasar esta función
            />
            <AddProviderModal
                show={showProviderModal}
                handleClose={handleCloseProviderModal}
                agregarProveedor={agregarProveedor}
                newProvider={newProvider}
                setNewProvider={setNewProvider}
            />
            <Container>
                <Row className='mb-3'>
                    <Col>
                        <h4>Inventario Punto de Venta</h4>
                    </Col>

                </Row>


                <Row className='mb-3'>

                    <Col md={3} xs={4} className="d-flex align-items-stretch">
                        <Button className='btn-accion' variant="" onClick={handleShowUserForm} style={{ backgroundColor: '#5F9365', color: '#ffffff' }}
                            onMouseOver={handleMouseOver}
                            onMouseOut={handleMouseOut}
                        >
                            <img src={IconAdd} alt="Agregar Producto" /> Agregar Producto

                        </Button>

                    </Col>


                    <Col md={4} className='mb-3'>
                        <Form.Group controlId="search">
                            <Form.Control
                                type="text"
                                placeholder="Buscar por número de orden, cliente o total"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={4} md={1}>
                        <Form>
                            <Form.Check
                                type="radio"
                                label="Todos"
                                name="orderStatus"
                                value=""
                                checked={filter === ''}
                                onChange={handleFilterChange}
                            />
                        </Form>
                    </Col>

                </Row>
                <style>
                    {`
            .custom-table-header th {
                background-color: #505050 !important;
                color: white !important;
            }
        `}
                </style>
                <Row className='mb-3'>
                    <Col>
                        <Table striped bordered hover responsive>
                            <thead className="custom-table-header">
                                <tr>
                                    <th>Imagen</th>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Categoría</th>
                                    <th>Codigo</th>
                                    <th>Proveedor</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product.ID}>
                                        <td>
                                            <img
                                                src={`${urlProductos}sku-${product.ID}.jpg`}
                                                onError={(e) => e.target.src = `${urlProductos}sku-default.jpg`}
                                                alt={product.Nombre}
                                                style={{ width: '50px', height: '50px' }} // Ajusta estas dimensiones según necesites
                                            />
                                        </td>
                                        <td>{product.ID}</td>
                                        <td>{product.Nombre}</td>
                                        <td>$ {product.Precio1}</td>
                                        <td>{product.Existencia}</td>
                                        <td>{product.Familia}</td>
                                        <td>{product.CodigoBarras}</td>
                                        <td>{product.Proveedor}</td>

                                        <td className='acciones'>
                                            <Button className='btn-accion' variant="success" onClick={() => handleProductViewFunction(product.ID)} title='Ver detalles'>
                                                <img src={IconDetail} alt="Detalle del Producto" />
                                            </Button>
                                            <Button className='btn-accion' variant="warning" onClick={() => handleEditProductFunction(product.ID)} title='Editar producto'>
                                                <FontAwesomeIcon icon={faEdit} /> {/* Usando FontAwesomeIcon */}
                                            </Button>

                                            <Button className='btn-accion' variant="danger" onClick={() => eliminarProducto(product.ID)} title='Eliminar producto'>
                                                <FontAwesomeIcon icon={faTrash} /> {/* Icono de eliminación */}
                                            </Button>

                                            <Button className='btn-accion' variant="secondary" onClick={() => handlePreviewEtiquetaPDF(product)} title='Vista Previa Etiqueta' disabled={loadingEtiquetaId === product.ID}>
                                                {loadingEtiquetaId === product.ID ? 'Abriendo...' : <FontAwesomeIcon icon={faFilePdf} />}
                                            </Button>

                                            <Button className='btn-accion' variant="secondary" onClick={() => descargarEtiqueta(product)} title='Descargar Etiqueta'>
                                                <FontAwesomeIcon icon={faDownload} />
                                            </Button>
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
            <PDFPreview pdfUrl={pdfUrl} show={showPDFPreview} handleClose={handleClosePDFPreview} />
        </>
    );
}

const ProductDetailModal = (props) => {
    const { showProductModal, setShowProductModal, productDetail } = props;

    // Ajusta según tu entorno de backend y estructura de archivos
    const defaultImagePath = `${urlProductos}sku-default.jpg`;
    const imagePath = productDetail && productDetail.ID
        ? `${urlProductos}sku-${productDetail.ID}.jpg`
        : defaultImagePath;

    return (
        <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
            <Modal.Header closeButton className="bg-dark text-white">
                <Modal.Title>Detalle del producto</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light">
                {productDetail ? (
                    <>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>ID:</strong> {productDetail.ID}</ListGroup.Item>
                            <ListGroup.Item><strong>Nombre:</strong> {productDetail.Nombre}</ListGroup.Item>
                            <ListGroup.Item><strong>Precio:</strong> ${productDetail.Precio1}</ListGroup.Item>
                            <ListGroup.Item><strong>Descripción:</strong> {productDetail.Descripcion}</ListGroup.Item>
                            <ListGroup.Item><strong>Existencia:</strong> {productDetail.Existencia}</ListGroup.Item>
                            <ListGroup.Item><strong>Proveedor:</strong> {productDetail.Proveedor}</ListGroup.Item>
                            <ListGroup.Item><strong>Categoría:</strong> {productDetail.Familia}</ListGroup.Item>
                        </ListGroup>
                        <div className="text-center mt-4">
                            <img
                                src={imagePath}
                                onError={(e) => { e.target.src = defaultImagePath; }}
                                style={{ width: '250px', height: '250px', borderRadius: '15px' }}
                                alt="Producto"
                                className="img-fluid img-thumbnail"
                            />
                        </div>
                    </>
                ) : (
                    <p>No hay información disponible para este producto.</p>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-dark">
                <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const EditProductForm = ({ showEditModal, allCategories, setShowEditModal, productDetail, updateProductDetail, actualizarProducto, editarProducto, allProveedores }) => {

    const [newProduct, setNewProduct] = useState({
        ID: productDetail.ID,
        Nombre: productDetail.Nombre,
        Precio1: productDetail.Precio1,
        Existencia: productDetail.Existencia,
        Proveedor: productDetail.Proveedor,
        Descripcion: productDetail.Descripcion,
        CodigoBarras: productDetail.CodigoBarras,
        Familia: productDetail.Familia,
    });
    const [newProductImage, setNewProductImage] = useState(null);
    console.log("productDetail", productDetail.ID)
    console.log("newProduct", newProduct.ID)
    useEffect(() => {
        setNewProduct({
            ID: productDetail.ID || '',
            Nombre: productDetail.Nombre || '',
            Precio1: productDetail.Precio1 || '',
            Existencia: productDetail.Existencia || '',
            Proveedor: productDetail.Proveedor || '',
            Descripcion: productDetail.Descripcion || '',
            CodigoBarras: productDetail.CodigoBarras || '',
            Familia: productDetail.Familia || '',
        });
    }, [productDetail]); // Dependencias: se ejecutará de nuevo si productDetail cambia.

    // Manejador de cambios para los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
        updateProductDetail({ ...productDetail, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
    };


    // Manejador de cambios para el campo de la imagen
    const handleFileChange = (e) => {
        setNewProductImage(e.target.files[0]);
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Aquí incluirías la lógica para enviar los datos del nuevo producto al servidor
        // Si usas FormData para incluir la imagen, se vería algo así:
        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            // Convertir cadenas vacías a 0 para los campos numéricos
            const value = newProduct[key] === '' && ['Existencia', 'Precio1', 'Proveedor'].includes(key) ? 0 : newProduct[key];
            formData.append(key, value);
        });
        if (newProductImage) {
            formData.append('Imagen', newProductImage);
        }

        try {
            formData.append('ID', newProduct.ID); // Asegúrate de incluir el ID del producto

            console.log("FORM", newProduct.ID)
            await editarProducto(newProduct.ID, formData); // Implementa esta función según tu lógica de backend
            setShowEditModal(false); // Cierra el modal después de enviar el formulario
        } catch (error) {
            console.error('Error al editar el producto:', error);
            // Maneja errores (por ejemplo, mostrando un mensaje)
        }
    };

    return (

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Editar producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={2}> {/* Un tercio del ancho para ID */}
                            <Form.Group className="mb-3">
                                <Form.Label>ID</Form.Label>
                                <Form.Control type="text" name="ID" value={productDetail.ID} disabled />
                            </Form.Group>
                        </Col>
                        <Col md={10}> {/* Dos tercios del ancho para Nombre */}
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre"
                                    value={productDetail.Nombre || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>


                    <Row>
                        <Col md={6}> {/* Ajusta md={6} para cambiar el ancho de las columnas según necesites */}
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Precio1"
                                    value={productDetail.Precio1 || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}> {/* Ajusta md={6} para cambiar el ancho de las columnas según necesites */}
                            <Form.Group className="mb-3">
                                <Form.Label>Existencia</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Existencia"
                                    value={productDetail.Existencia || 0}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Proveedor</Form.Label>
                                <Form.Select
                                    name="Proveedor"
                                    value={newProduct.Proveedor}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {allProveedores.map(proveedor => (
                                        <option key={proveedor.ID} value={proveedor.ID}>
                                            {proveedor.Nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="Descripcion"
                            value={productDetail.Descripcion || ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            value={newProduct.Familia}
                            onChange={e => setNewProduct({ ...newProduct, Familia: e.target.value })}
                            name="Familia"
                        >
                            <option>Seleccione una categoría</option>
                            {allCategories.map((categoria) => (
                                <option key={categoria.ID} value={categoria.Familia}>
                                    {categoria.Familia}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>



                    <Form.Group className="mb-3">
                        <Form.Label>Código Barras</Form.Label>
                        <Form.Control
                            type="text"
                            name="CodigoBarras"
                            value={productDetail.CodigoBarras}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen Actual del Producto</Form.Label>
                        <div>
                            <img
                                src={`${urlProductos}sku-${productDetail.ID}.jpg`}
                                onError={(e) => e.target.src = `${urlProductos}sku-default.jpg`}

                                style={{ width: '200px', height: '150px' }}
                                alt="Producto"
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nueva Imagen del Producto</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    {/* Agrega más campos según sea necesario */}

                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            Guardar cambios
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};


const AddProductForm = ({ showAddModal, setShowAddModal, agregarProducto, allCategories, allProveedores, setShowProviderModal, fetchProveedores }) => {

    const [newProduct, setNewProduct] = useState({
        Nombre: '',
        Precio1: '',
        Existencia: 0,
        Proveedor: 0,
        Descripcion: '',
        CodigoBarras: '',
        Familia: '',
    });
    const [newProductImage, setNewProductImage] = useState(null);

    // Manejador de cambios para los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({ ...newProduct, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
    };

    // Manejador de cambios para el campo de la imagen
    const handleFileChange = (e) => {
        setNewProductImage(e.target.files[0]);
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            // Convertir cadenas vacías a 0 para los campos numéricos
            const value = newProduct[key] === '' && ['Existencia', 'Precio1', 'Proveedor'].includes(key) ? 0 : newProduct[key];
            formData.append(key, value);
        });
        if (newProductImage) {
            formData.append('Imagen', newProductImage);
        }

        try {
            console.log("FORM", formData)
            await agregarProducto(formData); // Implementa esta función según tu lógica de backend
            setShowAddModal(false); // Cierra el modal después de enviar el formulario
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            // Maneja errores (por ejemplo, mostrando un mensaje)
        }
    };

    return (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {/* Campos del formulario. Omite el campo ID ya que se supone que es nuevo y el ID será generado por el backend */}
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre"
                                    value={newProduct.Nombre}
                                    onChange={handleChange}
                                    placeholder="Introduce el nombre del producto"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Precio1"
                                    value={newProduct.Precio1}
                                    onChange={handleChange}
                                    placeholder="Introduce el precio"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Existencia</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Existencia"
                                    value={newProduct.Existencia}
                                    onChange={handleChange}
                                    placeholder="Introduce la existencia"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label>Proveedor</Form.Label>
                                <Form.Select
                                    name="Proveedor"
                                    value={newProduct.Proveedor}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccione un proveedor</option>
                                    {allProveedores.map(proveedor => (
                                        <option key={proveedor.ID} value={proveedor.ID}>
                                            {proveedor.Nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={12} className="mb-3">
                            <Button variant="primary" onClick={() => setShowProviderModal(true)}>Agregar proveedor</Button>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select
                            value={newProduct.Familia}
                            onChange={e => setNewProduct({ ...newProduct, Familia: e.target.value })}
                            name="Familia"
                        >
                            <option>Seleccione una categoría</option>
                            {allCategories.map((categoria) => (
                                <option key={categoria.ID} value={categoria.Familia}>
                                    {categoria.Familia}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="Descripcion"
                            value={newProduct.Descripcion}
                            onChange={handleChange}
                            placeholder="Introduce una descripción"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Código Barras</Form.Label>
                        <Form.Control
                            type="text"
                            name="CodigoBarras"
                            value={newProduct.CodigoBarras}
                            onChange={handleChange}
                            placeholder="Introduce el código de barras"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen del Producto</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>

                    <div className="d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                            Agregar Producto
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

const AddProviderModal = ({ show, handleClose, agregarProveedor, newProvider, setNewProvider }) => {

    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProvider({ ...newProvider, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            if (!newProvider.Nombre) {
                setErrors({ Nombre: 'El campo Nombre es obligatorio' });
                return;
            }

            try {
                console.log("Enviando detalles del proveedor:", newProvider); // Verifica los datos enviados
                await agregarProveedor(newProvider);
                handleClose();
            } catch (error) {
                console.error('Error al agregar el proveedor:', error);
            }
        }

        setValidated(true);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="Nombre"
                            value={newProvider.Nombre}
                            onChange={handleChange}
                            placeholder="Introduce el nombre del proveedor"
                            required
                            isInvalid={!!errors.Nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.Nombre}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="Telefono"
                            value={newProvider.Telefono}
                            onChange={handleChange}
                            placeholder="Introduce el teléfono del proveedor"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            type="email"
                            name="Correo"
                            value={newProvider.Correo}
                            onChange={handleChange}
                            placeholder="Introduce el correo del proveedor"
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            Agregar Proveedor
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};



