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
    
        if (field === 'Ubicacion' || field === 'Dimensiones') {
            setEditedValue({ [field]: value || { X: '', Y: '', Z: '', Largo: '', Ancho: '', Alto: '' } });
        } else {
            setEditedValue({ [field]: value });
        }
    };
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [field, subField] = name.split('.');
    
        if (subField) {
            // Actualizar valores anidados como Ubicación o Dimensiones
            setEditedValue((prevState) => ({
                ...prevState,
                [field]: {
                    ...prevState[field],
                    [subField]: value,
                },
            }));
        } else {
            // Manejar los campos simples (Proveedor, Familia, etc.)
            setEditedValue({ ...editedValue, [name]: value });
        }
    };
    
    
    
    const handleKeyPress = async (e, product) => {
        if (e.key === 'Enter') {
            const updatedProduct = { ...product, ...editedValue };
            await actualizarProducto(product.ID, updatedProduct);
            setEditingProduct(null);
            setEditedValue({});
        }
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

    
    const renderEditableCell = (product, field) => {
        const value = product[field];
    
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
            } else if (field === 'Ubicacion') {
                return (
                    <Form.Group>
                        {/* Inputs para cada coordenada de Ubicación */}
                        {['X', 'Y', 'Z'].map((subField) => (
                            <Form.Control
                                key={subField}
                                type="text"
                                name={`Ubicacion.${subField}`}
                                value={editedValue.Ubicacion ? editedValue.Ubicacion[subField] || '' : ''}
                                placeholder={subField}
                                onChange={handleInputChange}
                                onKeyPress={(e) => handleKeyPress(e, product)}
                            />
                        ))}
                    </Form.Group>
                );
            } else if (field === 'Dimensiones') {
                return (
                    <Form.Group>
                        {/* Inputs para cada dimensión */}
                        {['Largo', 'Ancho', 'Alto'].map((subField) => (
                            <Form.Control
                                key={subField}
                                type="text"
                                name={`Dimensiones.${subField}`}
                                value={editedValue.Dimensiones ? editedValue.Dimensiones[subField] || '' : ''}
                                placeholder={subField}
                                onChange={handleInputChange}
                                onKeyPress={(e) => handleKeyPress(e, product)}
                            />
                        ))}
                    </Form.Group>
                );
            } else {
                return (
                    <Form.Control
                        type="text"
                        name={field}
                        value={editedValue[field] || ''}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, product)}
                    />
                );
            }
        }
    
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
        } else if (field === 'Ubicacion') {
            return (
                <span onClick={() => handleEditClick(product.ID, field, value)}>
                    {value ? `${value.X || '0'}, ${value.Y || '0'}, ${value.Z || '0'}` : '---'}
                </span>
            );
        } else if (field === 'Dimensiones') {
            return (
                <span onClick={() => handleEditClick(product.ID, field, value)}>
                    {value ? `${value.Largo || '0'}, ${value.Ancho || '0'}, ${value.Alto || '0'}` : '---'}
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
    const filteredProducts = allProducts.filter((product) => {
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
            <th>Mínimo</th> {/* Nueva columna para el Mínimo */}
            <th>Máximo</th> {/* Nueva columna para el Máximo */}
            <th>Categoría</th>
            <th>Proveedor</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Talla</th>
            <th>Estilo</th>
            <th hidden> Ubicación (X, Y, Z)</th> {/* Nueva columna para la ubicación */}
            <th hidden >Dimensiones (Largo, Ancho, Alto)</th> {/* Nueva columna para las dimensiones */}
            <th >Acciones</th>
        </tr>
    </thead>
    <tbody>
        {filteredProducts.map((product) => (
            <tr key={product.ID}>
                <td>{product.ID}</td>
                <td>{renderEditableCell(product, 'Nombre')}</td>
                <td>{renderEditableCell(product, 'Precio1')}</td>
                <td>{renderEditableCell(product, 'Existencia')}</td>
                <td style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
                    {/* Celda editable para el Mínimo con color tenue rojo */}
                    {renderEditableCell(product, 'Minimo')}
                </td>
                <td style={{ backgroundColor: 'rgba(0, 255, 0, 0.1)' }}>
                    {/* Celda editable para el Máximo con color tenue verde */}
                    {renderEditableCell(product, 'Maximo')}
                </td>
                <td>{renderEditableCell(product, 'Familia')}</td>
                <td>{renderEditableCell(product, 'Proveedor')}</td>
                <td>{renderEditableCell(product, 'Marca')}</td>
                <td>{renderEditableCell(product, 'Modelo')}</td>
                <td>{renderEditableCell(product, 'Talla')}</td>
                <td>{renderEditableCell(product, 'Estilo')}</td>
                <td hidden >{renderEditableCell(product, 'Ubicacion')}</td> {/* Celda editable para la ubicación */}
                <td hidden>{renderEditableCell(product, 'Dimensiones')}</td> {/* Celda editable para las dimensiones */}
                <td>
                   
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
