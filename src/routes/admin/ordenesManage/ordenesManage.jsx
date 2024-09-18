import { useState, useEffect } from 'react';
import { OrdenesManageView } from './ordenesManage-View';
import axios from 'axios';
import apiUrls from '../../../api';
import { PaymentComponent, CambioModal, TransactionForm } from '../../../components/components';
import { Modal, Button } from 'react-bootstrap'; // Asegúrate de importar estos componentes

const OrdenesManage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ordenes, setOrdenes] = useState([]);

    const [showCambioModal, setShowCambioModal] = useState(false);
    // Función para obtener todos los productos
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
                await axios.post(apiUrls.eliminarProducto, { productId }); // Asegúrate de que el método y la URL sean correctos para tu API
                console.log("Producto eliminado exitosamente.");
                fetchProducts(); // Volver a obtener la lista de productos para reflejar los cambios
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        } else {
            console.log("Eliminación cancelada.");
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


    const cancelarItem = async (metaId, cancelReason,user) => {
        try {




            const response = await axios.post(apiUrls.cancelarItem, {
                metaId, cancelReason,user
            });

            console.log("cancelarItem exitosamente.", response.data);
        } catch (error) {
            console.error('Error al agregar el cancelarItem:', error);
        }
    };

    const restaurarItem = async (metaId) => {
        try {



            const response = await axios.post(apiUrls.restaurarItem, {
                metaId
            });
            console.log("cancelarItem exitosamente.", response.data);
        } catch (error) {
            console.error('Error al agregar el cancelarItem:', error);
        }
    };

    const cancelarTicket = async (ticketId, cancelReason) => {
        try {

            const response = await axios.post(apiUrls.cancelarTicket, {
                ticketId, cancelReason
            });
            console.log("cancelarTicket exitosamente.", response.data);
        } catch (error) {
            console.error('Error al agregar el cancelarTicket:', error);
        }
    };

    const desagruparItem = async (metaId) => {
        try {
            const response = await axios.post(apiUrls.desagruparItem, {
                metaId
            });
            return response;
        } catch (error) {
            console.error('Error al desagrupar el item:', error);
            throw error;
        }
    };    

    const restaurarTicket = async (ticketId) => {
        try {

            const response = await axios.post(apiUrls.restaurarTicket, {
                ticketId
            });
            console.log("restaurarTicket exitosamente.", response.data);
        } catch (error) {
            console.error('Error al agregar el restaurarTicket:', error);
        }
    };



    return (
        <OrdenesManageView
            allProducts={products}
            allCategories={categories}
            ordenes={ordenes}
            actualizarProducto={actualizarProducto}
            agregarProducto={agregarProducto}
            editarProducto={editarProducto}
            eliminarProducto={eliminarProducto}
            fetchOrdenes={fetchOrdenes}
            restaurarItem={restaurarItem}
            cancelarItem={cancelarItem}
            cancelarTicket={cancelarTicket}
            restaurarTicket={restaurarTicket}
            desagruparItem={desagruparItem}

        />
    );
};

export default OrdenesManage;
