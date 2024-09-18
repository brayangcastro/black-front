
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faHashtag, faTag, faDollarSign, faBox, faThList, faTags, faBarcode, faPencilAlt, faImage } from '@fortawesome/free-solid-svg-icons';

const urlProductos = import.meta.env.VITE_APP_URL_PRODUCTOS;

const EditProductForm = ({ showEditModal, allCategories, setShowEditModal, productDetail, updateProductDetail, actualizarProducto, editarProducto, allProveedores, handleEditProductConfirm }) => {

    const [newProduct, setNewProduct] = useState({
        ID: '',
        Nombre: '',
        Precio1: '',
        Existencia: '',
        Proveedor: 0,
        Descripcion: '',
        CodigoBarras: '',
        Familia: '',
        Marca: '',
        Modelo: '',
        Talla: '',
        Estilo : ''

    });
    const [newProductImage, setNewProductImage] = useState(null);

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
            Marca: productDetail.Marca || '',
            Modelo: productDetail.Modelo || '',
            Talla: productDetail.Talla || '',
            Estilo : productDetail.Estilo || ''
        });
    }, [productDetail]);

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'Precio1') {
            const regex = /^\d*\.?\d*$/;
            if (regex.test(value)) {
                setNewProduct({ ...newProduct, [name]: value });
            }
        } else {
            setNewProduct({ ...newProduct, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
            updateProductDetail({ ...newProduct, [name]: name === 'Proveedor' ? parseInt(value, 10) : value });
        }

        // Validación del precio
        if (name === 'Precio1' && value.trim() === '') {
            setError('El precio no puede estar vacío.');
        } else {
            setError('');
        }
    };

    const handleFileChange = (e) => {
        setNewProductImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newProduct.Precio1) {
            setError('El precio no puede estar vacío.');
            return;
        }

        const formData = new FormData();
        Object.keys(newProduct).forEach(key => {
            const value = newProduct[key] === '' && ['Existencia', 'Precio1', 'Proveedor'].includes(key) ? 0 : newProduct[key];
            formData.append(key, value);
        });
        if (newProductImage) {
            formData.append('Imagen', newProductImage);
        }

        try {
            formData.append('ID', newProduct.ID);
            const updatedProduct = await editarProducto(newProduct.ID, formData);
            console.log('Producto actualizado:', updatedProduct); // Verifica la estructura de la respuesta
            if (updatedProduct && updatedProduct.ID) {
                handleEditProductConfirm(updatedProduct); // Confirma el producto actualizado con los datos devueltos
                setShowEditModal(false);
            } else {
                console.error('La respuesta del servidor no contiene el producto actualizado:', updatedProduct);
            }
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    };

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Modal.Header>
                <Modal.Title><FontAwesomeIcon icon={faEdit} /> Editar producto</Modal.Title>
                <div className="ms-auto d-flex">
                    <Button variant="primary" onClick={handleSubmit} className="me-2">
                        Guardar cambios
                    </Button>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faHashtag} /> ID</Form.Label>
                                <Form.Control type="text" name="ID" value={newProduct.ID} disabled />
                            </Form.Group>
                        </Col>
                        <Col md={10}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faTag} /> Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre"
                                    value={newProduct.Nombre}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faDollarSign} /> Precio</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Precio1"
                                    value={newProduct.Precio1}
                                    onChange={handleChange}
                                    isInvalid={!!error}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBox} /> Existencia</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Existencia"
                                    value={newProduct.Existencia}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faDollarSign} /> Marca</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Marca"
                                    value={newProduct.Marca}
                                    onChange={handleChange}
                                    isInvalid={!!error}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBox} /> Modelo</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Modelo"
                                    value={newProduct.Modelo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faDollarSign} /> Talla</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Talla"
                                    value={newProduct.Talla}
                                    onChange={handleChange}
                                    isInvalid={!!error}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {error}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBox} /> Estilo</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Estilo"
                                    value={newProduct.Estilo}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faThList} /> Proveedor</Form.Label>
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
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faBarcode} /> Código Barras</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="CodigoBarras"
                                    value={newProduct.CodigoBarras}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faPencilAlt} /> Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="Descripcion"
                                    value={newProduct.Descripcion}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faImage} /> Imagen Actual del Producto</Form.Label>
                                <div>
                                    <img
                                        src={`${urlProductos}sku-${newProduct.ID}.jpg`}
                                        onError={(e) => e.target.src = `${urlProductos}sku-default.jpg`}
                                        style={{ width: '200px', height: '150px' }}
                                        alt="Producto"
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label><FontAwesomeIcon icon={faImage} /> Nueva Imagen del Producto</Form.Label>
                                <Form.Control type="file" onChange={handleFileChange} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditProductForm;