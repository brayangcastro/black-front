import React, { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';

export const IngresarOrdenProductos = ({ allProducts, allProveedores, ingresarOrden }) => {
  const [nuevosProductos, setNuevosProductos] = useState([]);

  const agregarNuevoProducto = () => {
    setNuevosProductos([
      ...nuevosProductos,
      {
        nombre: '',
        proveedor: '',  // Asegúrate de que proveedor esté vacío o sea un número ID
        presentacion: '',
        paquetesPorPresentacion: 1,
        unidadesPorPaquete: 1,
        costoPorPresentacion: 0,
        costoPorPaquete: 0,
        costoPorUnidad: 0,
        precioPublico: 0,
        stockActual: 0,
        cantidad: 0,
        stockFinal: 0,
        searchResults: [],
       
        estilo: '',
        modelo: '',
        marca: '',
        talla: '',
        familia: ''

      }
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const productosActualizados = [...nuevosProductos];
    productosActualizados[index][field] = value;

    if (field === 'cantidad' || field === 'stockActual') {
      productosActualizados[index].stockFinal =
        parseInt(productosActualizados[index].cantidad || 0) + parseInt(productosActualizados[index].stockActual || 0);
    }

    // Calcula los costos por paquete y por unidad si cambian los costos o cantidades
    if (['costoPorPresentacion', 'paquetesPorPresentacion', 'unidadesPorPaquete'].includes(field)) {
      const paquetesPorPresentacion = parseInt(productosActualizados[index].paquetesPorPresentacion || 0);
      const unidadesPorPaquete = parseInt(productosActualizados[index].unidadesPorPaquete || 0);
      const costoPorPresentacion = parseFloat(productosActualizados[index].costoPorPresentacion || 0);
      
      // Calculo de los costos basados en la presentación
      productosActualizados[index].costoPorPaquete = paquetesPorPresentacion ? (costoPorPresentacion / paquetesPorPresentacion).toFixed(2) : 0;
      productosActualizados[index].costoPorUnidad = (paquetesPorPresentacion * unidadesPorPaquete) ? (costoPorPresentacion / (paquetesPorPresentacion * unidadesPorPaquete)).toFixed(2) : 0;
    }

    setNuevosProductos(productosActualizados);

    if (field === 'nombre' && value) {
      const resultados = allProducts.filter((producto) =>
        producto.Nombre.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limitar a 10 resultados
      productosActualizados[index].searchResults = resultados; // Actualizar resultados de búsqueda específicos de la fila
      setNuevosProductos(productosActualizados);
    } else if (field === 'nombre' && !value) {
      productosActualizados[index].searchResults = [];
      setNuevosProductos(productosActualizados);
    }
  };

  const handleSelectProduct = (index, productoSeleccionado) => {
    const productosActualizados = [...nuevosProductos];
    productosActualizados[index] = {
      ...productosActualizados[index],
      nombre: productoSeleccionado.Nombre,
      proveedor: productoSeleccionado.Proveedor,  // Usar el ID del proveedor
      costoPorPresentacion: productoSeleccionado.Costo,
      precioPublico: productoSeleccionado.Precio,
      stockActual: productoSeleccionado.Existencia,
      modelo: productoSeleccionado.Modelo,
      marca: productoSeleccionado.Marca,
      talla: productoSeleccionado.Talla,
      estilo: productoSeleccionado.Estilo,
      familia: productoSeleccionado.Familia,
      searchResults: []
    };
    setNuevosProductos(productosActualizados);
  };

  const handleIngresarOrden = async () => {
    try {
        const ingresoDetails = {
            fechaIngreso: new Date().toISOString().slice(0, 19).replace('T', ' '), // Formato de fecha y hora
            totalProductos,
            totalCosto,
            totalPrecioPublico
        };

        // Preparar productos para enviar al backend
        const productos = nuevosProductos.map(producto => {
            const productoExistente = allProducts.find(p => p.Nombre === producto.nombre);
            if (productoExistente) {
                // Producto existente, agregar ID
                return {
                    ...producto,
                    id: productoExistente.ID, // Usar el ID del producto existente
                    stockFinal: parseInt(productoExistente.Existencia) + parseInt(producto.cantidad)
                };
            } else {
                // Producto nuevo, no tiene ID
                return {
                    ...producto,
                    id: null, // Sin ID porque es nuevo
                    stockFinal: parseInt(producto.cantidad)
                };
            }
        });

        // Enviar solicitud POST al backend
        const response = await ingresarOrden(ingresoDetails, productos);

        console.log('Orden ingresada:', response);
        setNuevosProductos([]); // Resetear el estado después de ingresar la orden
    } catch (error) {
        console.error('Error al ingresar la orden:', error);
    }
  };

  const calcularTotales = () => {
    const totalProductos = nuevosProductos.reduce((acc, producto) => acc + parseInt(producto.cantidad || 0), 0);
    const totalCosto = nuevosProductos.reduce((acc, producto) => acc + parseFloat(producto.costoPorPresentacion || 0) * parseInt(producto.cantidad || 0), 0);
    const totalPrecioPublico = nuevosProductos.reduce((acc, producto) => acc + parseFloat(producto.precioPublico || 0) * parseInt(producto.cantidad || 0), 0);
    return { totalProductos, totalCosto, totalPrecioPublico };
  };

  const { totalProductos, totalCosto, totalPrecioPublico } = calcularTotales();

  return (
    <div>
      <h2>Crear Orden de Ingreso de Nuevos Productos</h2>
      <div className="resumen">
        <p><strong>Total de Productos:</strong> {totalProductos}</p>
        <p><strong>Total del Costo:</strong> ${totalCosto.toFixed(2)}</p>
        <p><strong>Total del Precio al Público:</strong> ${totalPrecioPublico.toFixed(2)}</p>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Proveedor</th>
            <th>Talla</th>
            <th>Modelo</th>
            <th>Escuela</th>
         
            <th>Costo por Unidad</th>
            <th>Precio al Público</th>
            <th>Stock Actual</th>
            <th>Cantidad</th>
            <th>Stock Final</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {nuevosProductos.map((producto, index) => (
            <tr key={index}>
              <td>
                <Form.Control
                  type="text"
                  value={producto.nombre}
                  onChange={(e) => handleInputChange(index, 'nombre', e.target.value)}
                  onFocus={() => handleInputChange(index, 'nombre', producto.nombre)}
                />
                {producto.searchResults.length > 0 && (
                  <div className="search-results">
                    {producto.searchResults.map((resultado) => (
                      <div
                        key={resultado.ID}
                        onClick={() => handleSelectProduct(index, resultado)}
                      >
                        {resultado.Nombre} T-{resultado.Talla} ({resultado.Modelo} )
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td>
                <Form.Select
                  value={producto.proveedor}
                  onChange={(e) => handleInputChange(index, 'proveedor', e.target.value)}
                >
                  <option value="">Selecciona un proveedor</option>
                  {allProveedores.map((proveedor) => (
                    <option key={proveedor.ID} value={proveedor.ID}>
                      {proveedor.Nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
             
              <td>
                <Form.Control
                  type="text"
                  value={producto.talla}
                  onChange={(e) => handleInputChange(index, 'Talla', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={producto.modelo}
                  onChange={(e) => handleInputChange(index, 'Modelo', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={producto.familia}
                  onChange={(e) => handleInputChange(index, 'Familia', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={producto.costoPorPresentacion}
                  onChange={(e) => handleInputChange(index, 'costoPorPresentacion', e.target.value)}
                />
              </td>
              
              <td>
                <Form.Control
                  type="number"
                  value={producto.precioPublico}
                  onChange={(e) => handleInputChange(index, 'precioPublico', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={producto.stockActual}
                  readOnly
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => handleInputChange(index, 'cantidad', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="number"
                  value={producto.stockFinal}
                  readOnly
                />
              </td>
              <td>
                <Button variant="danger" onClick={() => setNuevosProductos(nuevosProductos.filter((_, i) => i !== index))}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={agregarNuevoProducto}>
        + Agregar Producto
      </Button>
      <Button variant="success" onClick={handleIngresarOrden}>
        Ingresar Orden
      </Button>
    </div>
  );
};
