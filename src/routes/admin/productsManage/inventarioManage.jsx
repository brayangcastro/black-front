import { useState, useEffect } from 'react';
import { ProductsManageView } from './productsManage-View';
import { InventarioView } from './inventario-View';
import { IngresarOrdenProductos } from './IngresarOrdenProductos';
import axios from 'axios';
import apiUrls from '../../../api';
import { Modal, Button } from 'react-bootstrap'; 

const InventarioManage = () => {
    const [products, setProducts] = useState([]);
    const [insumos, setInsumos] = useState([]);

    const [proveedores, setProveedores] = useState([]);
    const [categories, setCategories] = useState([]);

    // Estados para el modal de confirmación de eliminación
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Función para obtener todos los productos
    const fetchInsumos= async () => {
        try {
            const response = await axios.get(apiUrls.getAllInsumos);
            setInsumos(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };
    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => {
        fetchInsumos();
    }, []);

     // Función para obtener todos los productos
     const fetchProducts = async () => {
        try {
            const response = await axios.get(apiUrls.getAllProducts);
            //setProducts(response.data);
            const productsData = response.data;

              // Convertir el campo 'Ubicacion' de cada producto de JSON string a objeto JavaScript
              const productsWithParsedUbicacion = productsData.map((product) => {
                // Convertir el campo 'Ubicacion' de JSON a objeto
                if (product.Ubicacion) {
                    try {
                        product.Ubicacion = JSON.parse(product.Ubicacion);
                    } catch (e) {
                        console.error(`Error al parsear el JSON de Ubicacion para el producto ID ${product.ID}:`, e);
                        product.Ubicacion = { X: '', Y: '', Z: '' }; // Manejar errores de parseo de forma adecuada
                    }
                }
    
                // Convertir el campo 'Dimensiones' de JSON a objeto
                if (product.Dimensiones) {
                    try {
                        product.Dimensiones = JSON.parse(product.Dimensiones);
                    } catch (e) {
                        console.error(`Error al parsear el JSON de Dimensiones para el producto ID ${product.ID}:`, e);
                        product.Dimensiones = { Largo: '', Ancho: '', Alto: '' }; // Manejar errores de parseo de forma adecuada
                    }
                }
    
                return product;
            });
    
        setProducts(productsWithParsedUbicacion);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };
    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => {
        fetchProducts();
    }, []);


    

    // Función para obtener todos los proveedores
    const fetchProveedores = async () => {
        try {
            const response = await axios.post(apiUrls.obtenerProveedores);
            setProveedores(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };
    // Llamar a fetchProveedores al montar y actualizar el componente
    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.post(apiUrls.listCategories);
            setCategories(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => {
        fetchCategories();
    }, []);

    const confirmDeleteProduct = (productId) => {
        setProductToDelete(productId);
        setShowConfirmDeleteModal(true);
    };

    const eliminarProducto = async () => {
        if (productToDelete) {
            try {
                await axios.post(apiUrls.eliminarProducto, { productId: productToDelete });
                console.log("Producto eliminado exitosamente.");
                fetchProducts();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
            setShowConfirmDeleteModal(false);
            setProductToDelete(null);
        }
    };

    // Función para actualizar un producto específico
    const actualizarProducto = async (productId, productDetails) => {
        try {
           const res= await axios.post(apiUrls.actualizarProducto, {
                productId,
                productDetails
            }); 
            console.log("Producto actualizado exitosamente.");
            fetchProducts(); // Volver a obtener la lista de productos para reflejar los cambios
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };
    const editarProducto = async (productId, formData) => {
        try {
            // Agrega el ID del producto al FormData si no está ya incluido


            const response = await axios.post(apiUrls.editarProducto, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("Producto editado exitosamente.", response.data);
            fetchProducts(); // Volver a obtener la lista de productos para reflejar los cambios
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    };

    const agregarProducto = async (formData) => {
        try {
            // Usa axios para enviar una petición POST con formData directamente.
            // Asegúrate de no desestructurar formData ya que es el cuerpo de la petición.
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await axios.post(apiUrls.agregarProducto, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Este encabezado es importante para el manejo de FormData
                },
            });
            console.log("Producto agregado exitosamente.", response.data);
            fetchProducts(); // Volver a obtener la lista de productos para reflejar los cambios
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    };

    const agregarProveedor = async (newProvider) => {
        try {
            await axios.post(apiUrls.agregarProveedor, newProvider);
            console.log("Proveedor agregado exitosamente.");
            fetchProveedores(); // Actualizar la lista de proveedores
        } catch (error) {
            console.error('Error al agregar el proveedor:', error);
        }
    };

    return (
        <>
       
          <InventarioView
                allProducts={products}
                allInsumos={insumos}
                allProveedores={proveedores}
                allCategories={categories}
                actualizarProducto={actualizarProducto}
                agregarProducto={agregarProducto}
                editarProducto={editarProducto}
                eliminarProducto={confirmDeleteProduct}
                agregarProveedor={agregarProveedor}
                fetchProducts={fetchProducts} // Pasa la función como una prop
                fetchProveedores={fetchProveedores} // Pasa la función como una prop
            />
             
            <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Está seguro de que quiere eliminar este producto?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={eliminarProducto}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
};

export default InventarioManage;
