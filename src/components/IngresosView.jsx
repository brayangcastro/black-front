import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import apiUrls from '../api';

export const IngresosView = () => {
  const [ingresos, setIngresos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const response = await axios.post(apiUrls.getAllIngresos);
        setIngresos(response.data);
      } catch (error) {
        console.error('Error al obtener ingresos:', error);
        setError('Hubo un problema al obtener los ingresos.');
      } finally {
        setLoading(false);
      }
    };

    fetchIngresos();
  }, []);

  if (loading) {
    return <p>Cargando ingresos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Lista de Ingresos</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha de Ingreso</th>
            <th>Total de Productos</th>
            <th>Total del Costo</th>
            <th>Total del Precio al Público</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso.ID}>
              <td>{ingreso.ID}</td>
              <td>{ingreso.fechaIngreso}</td>
              <td>{ingreso.totalProductos}</td>
              <td>
                ${parseFloat(ingreso.totalCosto || 0).toFixed(2)}
              </td>
              <td>
                ${parseFloat(ingreso.totalPrecioPublico || 0).toFixed(2)}
              </td>
              <td>
                <Button variant="info" onClick={() => handleViewDetails(ingreso.ID)}>
                  Ver Detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// Función para manejar la visualización de detalles
const handleViewDetails = (ingresoId) => {
  console.log('Ver detalles para el ingreso ID:', ingresoId);
  // Aquí puedes redirigir a una vista de detalles o mostrar un modal con detalles adicionales.
};

export default IngresosView;
