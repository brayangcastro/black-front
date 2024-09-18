import { useState, useEffect } from 'react';
import { ProductsManageView } from './productsManage-View';
import { InventarioView } from './inventario-View';
import { IngresosView } from '../../../components/IngresosView';
import axios from 'axios';
import apiUrls from '../../../api';
import { Modal, Button } from 'react-bootstrap'; 

const IngresoManage = () => {
    const [products, setProducts] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [categories, setCategories] = useState([]);

    // Estados para el modal de confirmación de eliminación
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Función para obtener todos los productos
    const fetchProducts = async () => {
        try {
            const response = await axios.get(apiUrls.getAllProducts);
            setProducts(response.data);
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
            await axios.post(apiUrls.actualizarProducto, {
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

    
    const ingresarOrden = async (ingresoDetails, productos) => {
        try {
            await axios.post(apiUrls.registrarIngreso, {ingresoDetails, productos});
            console.log("registrarIngreso exitosamente.");
            fetchProveedores(); // Actualizar la lista de proveedores
        } catch (error) {
            console.error('Error al agregar el registrarIngreso:', error);
        }
    };

    return (
        <>
        
        <IngresosView
                allProducts={products}
                allProveedores={proveedores}
                allCategories={categories}
                actualizarProducto={actualizarProducto}
                agregarProducto={agregarProducto}
                editarProducto={editarProducto}
                eliminarProducto={confirmDeleteProduct}
                agregarProveedor={agregarProveedor}
                fetchProducts={fetchProducts} // Pasa la función como una prop
                fetchProveedores={fetchProveedores} // Pasa la función como una prop
                ingresarOrden={ingresarOrden}
            />
           
           
        </>

    );
};

export default IngresoManage;
