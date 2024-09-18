import React, { useState, useEffect } from 'react';
import { VentasManageView } from './ventasManage-View';
import axios from 'axios';
import apiUrls from '../../../api';

const VentasManage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [limit] = useState(10); // Número de productos por página
const [offset, setOffset] = useState(0); // Inicio de los productos en la página actual
const [filter, setFilter] = useState(''); // Filtro de categoría o búsqueda

const [search, setSearch] = useState('');

    const fetchProducts2 = async () => {
        try {
            const response = await axios.get(apiUrls.getAllProducts);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    const fetchProducts = async (limit = 10, offset = 0, search = '', category = '') => {
        try {
            const response = await axios.get(apiUrls.getAllProducts, {
                params: { limit, offset, search, category }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };
    
    
    const fetchCostumers = async () => {
        try {
            const response = await axios.get(apiUrls.getAllUsers);
            setCustomers(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => { 
        fetchCostumers();
    }, []);

    useEffect(() => {
        fetchProducts(limit, offset, search, filter);
        console.log("fetchProducts",limit, offset, search, filter)
    }, [limit, offset, search, filter]); // Dependencias incluyen los parámetros de filtrado y paginación

    
    const fetchCategories = async () => {
        try {
            const response = await axios.post(apiUrls.listCategories);
            setCategories(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const eliminarProducto = async (productId) => {
        const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
        if (isConfirmed) {
            try {
                await axios.post(apiUrls.eliminarProducto, { productId });
                fetchProducts();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        }
    };

    const actualizarProducto = async (productId, productDetails) => {
        try {
            await axios.post(apiUrls.actualizarProducto, { productId, productDetails });
            fetchProducts();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        }
    };

    const editarProducto = async (productId, formData) => {
        try {
            const response = await axios.post(apiUrls.editarProducto, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            fetchProducts(); // Asegúrate de que esto actualice tu lista de productos globalmente si es necesario
            return response.data.data; // Devuelve los datos del producto actualizado
        } catch (error) {
            console.error('Error al editar el producto:', error);
            throw error; // Re-lanza el error para manejarlo en el componente
        }
    };    

    const agregarProducto = async (formData) => {
        try {
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const response = await axios.post(apiUrls.agregarProducto, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Respuesta del servidor:', response.data); // Verifica la estructura de la respuesta
            fetchProducts();
            return response.data.data; // Asegúrate de devolver los datos del producto recién agregado
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error; // Re-lanzar el error para manejarlo en el componente
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

  

    return (
        <VentasManageView
            allProducts={products}
            allCategories={categories}
            allProveedores={proveedores}
            agregarProveedor={agregarProveedor}
            fetchProveedores={fetchProveedores} // Pasa la función como una prop
            actualizarProducto={actualizarProducto}
            agregarProducto={agregarProducto}
            editarProducto={editarProducto}
            eliminarProducto={eliminarProducto}
            customers={customers}
            limit={limit}
            offset={offset}
            setOffset={setOffset}
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}

          
             
        />
    );
};

export default VentasManage;
