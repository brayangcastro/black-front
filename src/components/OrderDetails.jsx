import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiUrls from '../api'; // Asegúrate de que la ruta sea correcta
import mapa from './mapa.png'; // Asegúrate de que la ruta sea correcta
import './OrderDetails.css'; // Mantén el archivo CSS que tenías

// Definir las coordenadas y las imágenes para cada producto en un JSON
const productCoordinates = {
  products: [
    {
      id: "C1",
      name: "Cubículo 1 - 4 personas",
      coordinates: {
        x: 500,
        y: 500
      },
      image: "http://localhost/black-front/src/components/images/cubiculo_1.jpg"
    },
    {
      id: "C2",
      name: "Sala de juntas - 8 personas",
      coordinates: {
        x: 300,
        y: 400
      },
      image: "/images/sala_juntas.png"
    },
    {
      id: "C3",
      name: "Auditorio - 50 personas",
      coordinates: {
        x: 500,
        y: 100
      },
      image: "/images/auditorio.png"
    }
  ]
};

const OrderDetails = () => {
  const { orderId } = useParams(); // Captura el orderId desde la URL
  const [order, setOrder] = useState(null); // Estado para almacenar la orden
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 }); // Coordenadas para el marcador
  const [imageUrl, setImageUrl] = useState(""); // URL de la imagen del producto

  // Efecto para cargar los datos cuando el componente se monta
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${apiUrls.getOrderById}/${orderId}`);
        setOrder(response.data);
        console.log("setOrder",response.data)

        // Buscar las coordenadas y la imagen del producto basado en el ID del producto (product_sku)
        const productId = response.data.items[0].product_sku; // Ajusta según la estructura de tu objeto 'order'
        const productData = getProductData(productId);
        setCoordinates(productData.coordinates);
        setImageUrl(productData.image);
      } catch (err) {
        setError('No se pudo cargar la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getProductData = (productId) => {
    const product = productCoordinates.products.find((p) => p.id === productId);
    return product ? { coordinates: product.coordinates, image: product.image } : { coordinates: { x: 0, y: 0 }, image: "" };
  };

  if (loading) {
    return <p className="loading-text">Cargando detalles de la orden...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!order) {
    return <p className="error-text">No se encontraron detalles para esta orden.</p>;
  }

  return (
    <div className="order-details-container">
      <div className="order-header">
        <h1>Detalles de la Reservación</h1>
        <div className="order-info">
          <p><strong>Número de Orden:</strong> {order.order_number}</p>
          <p><strong>Cliente:</strong> {order.customer.name}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Teléfono:</strong> {order.customer.phone}</p>
          <p><strong>Estado Financiero:</strong> {order.financial_status}</p>
          <p><strong>Estado de Fulfillment:</strong> {order.fulfillment_status}</p>
        </div>
      </div>

      <h2 className="section-title">Productos Reservados</h2>
      {order.items.map((item, index) => {
        const productData = getProductData(item.product_sku); // Busca el producto por SKU para obtener la imagen y coordenadas
        return (
          <div key={index} className="item-card">
            <p><strong>Producto:</strong> {item.product_name}</p>
            <p><strong>SKU:</strong> {item.product_sku}</p>
            <p><strong>Cantidad:</strong> {item.quantity}</p>
            <p><strong>Precio:</strong> ${item.price}</p>
            <p><strong>Subtotal:</strong> ${item.subtotal}</p>
            <p><strong>Fecha de Reserva:</strong> {item.reservation.date}</p>
            <p><strong>Hora de Inicio:</strong> {item.reservation.start_time}</p>
            <p><strong>Hora de Fin:</strong> {item.reservation.end_time}</p>
            <p><strong>Zona Horaria:</strong> {item.reservation.timezone}</p>
            
            {/* Imagen del producto reservado */}
            {productData.image && (
              <img src={productData.image} alt={item.product_name} className="product-image" />
            )}
          </div>
        );
      })}

      {/* Mapa con marcador */}
      <h2 className="section-title">Mapa del Sitio</h2>
      <div className="map-container">
        <img src={mapa} alt="Mapa del sitio" className="map-image" />
        <div
          className="marker"
          style={{
            top: `${coordinates.y}px`,
            left: `${coordinates.x}px`,
          }}
        />
      </div>
    </div>
  );
};

export default OrderDetails;
