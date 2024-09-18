import React, { useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import IconDetail from '../../../assets/icons/userDetail.svg';
import { Link } from 'react-router-dom'; // Importa el componente Link de react-router-dom

export const InventarioView = (props) => {
    const { allProducts, allProveedores, allCategories, actualizarProducto, eliminarProducto ,
            allInsumos
    } = props;
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedValue, setEditedValue] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterProveedor, setFilterProveedor] = useState('');

    const handleEditClick = (productId, field, value) => {
        setEditingProduct({ productId, field });
        setEditedValue({ [field]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedValue({ ...editedValue, [name]: value });
    };

    const handleSelectChange = async (e, product) => {
        const { name, value } = e.target;
        setEditedValue({ ...editedValue, [name]: value });

        // Actualizar el producto inmediatamente después de cambiar la selección
        const updatedProduct = { ...product, [name]: value };
      
        await actualizarProducto(product.ID, updatedProduct);

        // Limpiar el estado de edición después de actualizar
        setEditingProduct(null);
        setEditedValue({});
    };

    const handleKeyPress = async (e, product) => {
        if (e.key === 'Enter') {
            const updatedProduct = { ...product, ...editedValue };
            await actualizarProducto(product.ID, updatedProduct);
            setEditingProduct(null);
            setEditedValue({});
        }
    };

    const renderEditableCell = (product, field) => {
        const value = product[field];

        // Check if we are editing this specific cell
        if (editingProduct && editingProduct.productId === product.ID && editingProduct.field === field) {
            if (field === 'Proveedor') {
                return (
                    <Form.Select
                        name={field}
                        value={editedValue[field] || ''}
                        onChange={(e) => handleSelectChange(e, product)}
                    >
                        <option value="">Selecciona un proveedor</option>
                        {allProveedores.map((proveedor) => (
                            <option key={proveedor.ID} value={proveedor.ID}>
                                {proveedor.Nombre}
                            </option>
                        ))}
                    </Form.Select>
                );
            } else if (field === 'Familia') {
                return (
                    <Form.Select
                        name={field}
                        value={editedValue[field] || ''}
                        onChange={(e) => handleSelectChange(e, product)}
                    >
                        <option value="">Selecciona una familia</option>
                        {allCategories.map((category) => (
                            <option key={category.Familia} value={category.Familia}>
                                {category.Familia}
                            </option>
                        ))}
                    </Form.Select>
                );
            } else {
                return (
                    <Form.Control
                        type="text"
                        name={field}
                        value={editedValue[field]}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                    />
                );
            }
        }

        // Render static cell or make it editable when clicked
        if (field === 'Proveedor') {
            const proveedor = allProveedores.find(p => p.ID === value);
            return (
                <span onClick={() => handleEditClick(product.ID, field, value)}>
                    {proveedor ? proveedor.Nombre : 'Selecciona un proveedor'}
                </span>
            );
        } else if (field === 'Familia') {
            return (
                <span onClick={() => handleEditClick(product.ID, field, value)}>
                    {value || 'Selecciona una familia'}
                </span>
            );
        }

        return (
            <span onClick={() => handleEditClick(product.ID, field, value)}>
                {value || '---'}
            </span>
        );
    };

    // Filtrar productos según los términos de búsqueda y filtros seleccionados
    const filteredProducts = allInsumos.filter((product) => {
        const matchesSearchTerm = product.Nombre.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? product.Familia === filterCategory : true;
        const matchesProveedor = filterProveedor ? product.Proveedor === parseInt(filterProveedor) : true;
        return matchesSearchTerm && matchesCategory && matchesProveedor;
    });

    // Convertir los campos de texto a números para las sumatorias
    const totalProductos = filteredProducts.length;
    const totalPrecio = filteredProducts.reduce((acc, product) => acc + (parseFloat(product.Precio1) || 0), 0);
    const totalStock = filteredProducts.reduce((acc, product) => acc + (parseFloat(product.Existencia) || 0), 0);

    return (
        <>
            {/* Encabezado de inventario y filtros */}
            <div className="inventory-header">
                <Row>
                    <Col>
                        <h4>Inventario de Productos</h4>
                        <p>Total de productos: {totalProductos}</p>
                        <p>Sumatoria de Precios: ${totalPrecio.toFixed(2)}</p>
                        <p>Sumatoria de Stock: {totalStock}</p>
                   

                    <Link to="/ingreso">
                            <Button variant="primary" className="mt-3">
                                Crear Nueva Orden de Ingreso
                            </Button>
                        </Link>
                        </Col>
                    <Col>
                        {/* Filtros de búsqueda */}
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Form.Select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">Filtrar por categoría</option>
                            {allCategories.map((category) => (
                                <option key={category.Familia} value={category.Familia}>
                                    {category.Familia}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={filterProveedor}
                            onChange={(e) => setFilterProveedor(e.target.value)}
                        >
                            <option value="">Filtrar por proveedor</option>
                            {allProveedores.map((proveedor) => (
                                <option key={proveedor.ID} value={proveedor.ID}>
                                    {proveedor.Nombre}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Row>
            </div>

            {/* Tabla de inventario */}
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.ID}>
                            <td>{product.ID}</td>
                            <td>{renderEditableCell(product, 'Nombre')}</td>
                            <td>{renderEditableCell(product, 'Precio1')}</td>
                            <td>{renderEditableCell(product, 'Existencia')}</td>
                            <td>{renderEditableCell(product, 'Familia')}</td>
                            <td>{renderEditableCell(product, 'Proveedor')}</td>
                            <td>
                                <Button className='btn-accion' variant="success" onClick={() => handleProductViewFunction(product.ID)} title='Ver detalles'>
                                    <img src={IconDetail} alt="Detalle del Producto" />
                                </Button>
                                <Button className='btn-accion' variant="warning" onClick={() => handleEditClick(product.ID, 'Nombre', product.Nombre)} title='Editar producto'>
                                    <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button className='btn-accion' variant="danger" onClick={() => eliminarProducto(product.ID)} title='Eliminar producto'>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};
