import { useState, useEffect } from 'react';
import { MesasManageView } from './mesasManage-View';
import axios from 'axios';
import apiUrls from '../../../api';

const MesasManage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    const [mesas, setMesas] = useState([]);
    // Función para obtener todos los productos

    const fetchMesas = async () => {
        try {
            const response = await axios.post(apiUrls.listaMesas);
            setMesas(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => {
        fetchMesas();
    }, []);

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

    const eliminarProducto = async (productId) => {
        // Muestra un cuadro de diálogo de confirmación
        const isConfirmed = window.confirm("¿Estás seguro de que quieres eliminar este producto?");
    
        // Procede solo si el usuario confirma
        if (isConfirmed) {
            try {
                await axios.post(apiUrls.eliminarProducto, {  productId   }); // Asegúrate de que el método y la URL sean correctos para tu API
                console.log("Producto eliminado exitosamente.");
                fetchProducts(); // Volver a obtener la lista de productos para reflejar los cambios
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        } else {
            console.log("Eliminación cancelada.");
        }
    };
    
    const limpiarMesa = async (mesaId) => {
        // Muestra un cuadro de diálogo de confirmación
        const isConfirmed = window.confirm("¿Estás seguro de que quieres limpiar la mesa?");
    
        // Procede solo si el usuario confirma
        if (isConfirmed) {
            try {
                await axios.post(apiUrls.limpiarMesa, {  mesaId   }); // Asegúrate de que el método y la URL sean correctos para tu API
                console.log("Mesa limpiada exitosamente.");
                fetchMesas(); // Volver a obtener la lista de productos para reflejar los cambios
            } catch (error) {
                console.error('Error al limpiar la mesa:', error);
            }
        } else {
            console.log("Limpieza cancelada.");
        }
    };

    const imprimirCuenta = async (ticketId) => {
        try {
          // Construye la URL con el parámetro de consulta
          const url = `${apiUrls.imprimirCuenta}?Saldo=${encodeURIComponent(ticketId)}`;
          const response = await axios.get(url);
          // Procesa la respuesta aquí
          console.log(response.data); // Mostrar la respuesta del servidor
        } catch (error) {
          console.error('Error al imprimir la cuenta:', error);
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
    
    const agregarProducto  = async (formData) => {
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
    
     

    const fetchOrdenes = async () => {
        try {
            const response = await axios.post(apiUrls.getOrdersForFrontend);
            setOrdenes(response.data);
        } catch (error) {
            console.error('Error al obtener datos de la API:', error);
        }
    };

    // Llamar a fetchProducts al montar y actualizar el componente
    useEffect(() => {
        fetchOrdenes();
    }, []);

    return (
        <MesasManageView
        allProducts={products}
        allCategories={categories}
        mesas={mesas}
        ordenes={ordenes}
            actualizarProducto={actualizarProducto}
            agregarProducto={agregarProducto}
            editarProducto={editarProducto}
            eliminarProducto={eliminarProducto}
            limpiarMesa={limpiarMesa}
            imprimirCuenta={imprimirCuenta}
            fetchMesas={fetchMesas}
        />
    );
};

export default MesasManage;
