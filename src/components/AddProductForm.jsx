import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTag, faDollarSign, faBox, faThList, faTags, faBarcode, faPencilAlt, faImage } from '@fortawesome/free-solid-svg-icons';

const AddProductForm = ({ showAddModal, setShowAddModal, agregarProducto, allCategories, allProveedores, setShowProviderModal, productDetails, handleAddProductConfirm, handleCloseAddProductModal }) => {
    const [newProduct, setNewProduct] = useState({
        Nombre: '',
        Precio1: '',
        Existencia: '',
        Proveedor: 0,
        Descripcion: '',
        CodigoBarras: '',
        Familia: '',
    });
    const [newProductImage, setNewProductImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('http://magico.local/GPIO_WS/capturas_cam/imagenActual.jpg');
    const [error, setError] = useState('');

    useEffect(() => {
        if (productDetails) {
            setNewProduct({
                Nombre: productDetails.Nombre || '',
                Precio1: productDetails.Precio1 || '',
                Existencia: productDetails.Existencia || '',
                Proveedor: productDetails.Proveedor || 0,
                Descripcion: productDetails.Descripcion || '',
                CodigoBarras: productDetails.CodigoBarras || '',
                Familia: productDetails.Familia || '',
                isTemporary: false,
            });
        }
    }, [productDetails]);

    // Manejador de cambios para los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Precio1') {
            const regex = /^\d*\.?\d*$/;
            if (regex.test(value)) {
                setNewProduct({ ...newProduct, [name]: value });
            }
        } else {
            setNewProduct({ ...newProduct, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
        }

        // Validación del precio
        if (name === 'Precio1' && value.trim() === '') {
            setError('El precio no puede estar vacío.');
        } else {
            setError('');
        }
    };

    // Manejador para el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newProduct.Precio1) {
            setError('El precio no puede estar vacío.');
            return;
        }

        const formData = new FormData();
        Object.keys(newProduct).forEach(key => formData.append(key, newProduct[key]));
        if (newProductImage) {
            formData.append('Imagen', newProductImage);
        }

        try {
            const addedProduct = await agregarProducto(formData);
            console.log('addedProduct:', addedProduct); // Verifica la estructura de la respuesta
            console.log('Producto agregado:', addedProduct); // Verifica la estructura de la respuesta
            if (addedProduct && addedProduct.ID) {
                handleAddProductConfirm(addedProduct); // Confirma el producto agregado con los datos devueltos
                //setShowAddModal(false); // Cierra el modal después de confirmar
                handleCloseAddProductModal();  // Limpia y cierra el modal después de agregar el producto
            } else {
                console.error('La respuesta del servidor no contiene el producto agregado:', addedProduct);
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    const validatePhoto = () => {
        setNewProductImage(imageUrl);
    };

    const refreshImage = () => {
        const timestamp = new Date().getTime();
        setImageUrl(`http://magico.local/GPIO_WS/capturas_cam/imagenActual.jpg?timestamp=${timestamp}`);
    };

    return (
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
            <Modal.Header>
                <Modal.Title><FontAwesomeIcon icon={faPlus} /> Nuevo Producto</Modal.Title>
                <div className="ms-auto d-flex">
                    <Button variant="primary" onClick={handleSubmit} className="me-2">
                        Agregar Producto
                    </Button>
                    <Button variant="secondary" onClick={handleCloseAddProductModal}>
                        Cancelar
                    </Button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faTag} /> Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre"
                                    value={newProduct.Nombre}
                                    onChange={handleChange}
                                    placeholder="Introduce el nombre del producto"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faDollarSign} /> Precio</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Precio1"
                                    value={newProduct.Precio1}
                                    onChange={handleChange}
                                    placeholder="Introduce el precio"
                                    isInvalid={!!error}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBox} /> Existencia</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Existencia"
                                    value={newProduct.Existencia}
                                    onChange={handleChange}
                                    placeholder="Introduce la existencia"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    <FontAwesomeIcon icon={faThList} /> Proveedor
                                </Form.Label>
                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                    <Form.Select
                                        name="Proveedor"
                                        value={newProduct.Proveedor}
                                        onChange={handleChange}
                                        style={{ flexGrow: 1 }}
                                    >
                                        <option value="">Seleccione un proveedor</option>
                                        {allProveedores.map(proveedor => (
                                            <option key={proveedor.ID} value={proveedor.ID}>
                                                {proveedor.Nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setShowProviderModal(true)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '6px',
                                            height: '38px',
                                            width: '38px',
                                            marginLeft: '8px'
                                        }}
                                        title="Agregar proveedor"
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faTags} /> Categoría</Form.Label>
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
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBarcode} /> Código Barras</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="CodigoBarras"
                                    value={newProduct.CodigoBarras}
                                    onChange={handleChange}
                                    placeholder="Introduce el código de barras"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faPencilAlt} /> Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Descripcion"
                                    value={newProduct.Descripcion}
                                    onChange={handleChange}
                                    placeholder="Introduce una descripción"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faImage} /> Imagen del Producto</Form.Label>
                                <Row>
                                    <Col md={6}>
                                        {newProductImage ? (
                                            <div>
                                                <img src={newProductImage} alt="Product" style={{ width: '100%' }} />
                                                <Button variant="secondary" onClick={() => setNewProductImage(null)}>
                                                    Reintentar
                                                </Button>
                                            </div>
                                        ) : (
                                            <img src={imageUrl} alt="Product" style={{ width: '100%' }} />
                                        )}
                                    </Col>
                                    <Col md={6} className="d-flex align-items-center">
                                        <Button variant="primary" onClick={validatePhoto} className="me-2">
                                            Validar Imagen
                                        </Button>
                                        <Button variant="secondary" onClick={refreshImage}>
                                            Refrescar Imagen
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductForm;