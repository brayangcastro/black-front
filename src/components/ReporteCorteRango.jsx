import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const ReporteCorteRango = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Aquí deberías cargar los datos del reporte. Simulamos esto con un fetch.
    const fetchData = async () => {
      // Suponiendo que tienes una API que devuelve los datos del reporte.
      const response = await fetch('/api/reporte');
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Cargando...</div>;
  }

  const {
    pagoJson,
    totales,
    movEntrada,
    movSalida,
    productos10,
    cancelaciones,
    cortesTotales,
    cortesCuenta,
    startDate,
    endDate,
  } = data;

  const pagosData = {
    labels: pagoJson.map((item) => item.metodo),
    datasets: [
      {
        label: 'Calculado',
        data: pagoJson.map((item) => item.calculado),
        backgroundColor: ['#8FDB5E', '#E1DC4F', '#F77F3B', '#E75050', '#8C8C8C'],
      },
    ],
  };

  const totalesData = {
    labels: [
      'Total Ventas',
      'Total Entradas',
      'Total Salidas',
      'Total al Corte',
      'Promedio por Ticket',
      'Balance Movimientos',
    ],
    datasets: [
      {
        label: 'Totales',
        data: [
          totales.totalVentas,
          totales.totalEntradas,
          totales.totalSalidas,
          totales.totalCorte,
          totales.averageTicket,
          totales.balanceMovimientos,
        ],
        backgroundColor: (ctx) => {
          return ctx.raw >= 0 ? '#8FDB5E' : '#E75050';
        },
      },
    ],
  };

  const cortesData = {
    labels: cortesTotales.map((corte) => corte.Fecha),
    datasets: [
      {
        label: 'Total por Corte',
        data: cortesTotales.map((corte) => {
          const efectivo = parseFloat(corte.Efectivo) || 0;
          const tarjeta = parseFloat(corte.Tarjeta) || 0;
          const transferencia = parseFloat(corte.Transferencia) || 0;
          const cheque = parseFloat(corte.Cheque) || 0;
          const vale = parseFloat(corte.Vale) || 0;
          return efectivo + tarjeta + transferencia + cheque + vale;
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Reporte de Pagos</h1>
          <p>
            Fechas: Del {startDate} al {endDate}
          </p>
          <h2>Total: ${pagoJson.reduce((total, metodo) => total + metodo.calculado, 0)}</h2>
          <h3>Total de Cortes: {cortesCuenta}</h3>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <h4>Métodos de Pago</h4>
          <Bar data={pagosData} />
        </Col>
        <Col md={6}>
          <h4>Totales</h4>
          <Bar data={totalesData} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Totales por Corte</h4>
          <Bar data={cortesData} />
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Movimientos de Entrada</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {movEntrada.map((entrada, index) => (
                <tr key={index}>
                  <td>{entrada.orden}</td>
                  <td>{entrada.usuario}</td>
                  <td>{entrada.fecha}</td>
                  <td>${entrada.total}</td>
                  <td>{entrada.estado}</td>
                  <td>{entrada.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Movimientos de Salida</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Orden</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {movSalida.map((salida, index) => (
                <tr key={index}>
                  <td>{salida.orden}</td>
                  <td>{salida.usuario}</td>
                  <td>{salida.fecha}</td>
                  <td>${salida.total}</td>
                  <td>{salida.estado}</td>
                  <td>{salida.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Top 10 Productos Más Vendidos</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Vendidos</th>
                <th>Subtotal</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              {productos10.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.cantidad_vendida}</td>
                  <td>${producto.subtotal}</td>
                  <td>{producto.categoria}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <h4>Cancelaciones</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {cancelaciones.map((cancelacion, index) => (
                <tr key={index}>
                  <td>{cancelacion.orden}</td>
                  <td>{cancelacion.usuario}</td>
                  <td>{cancelacion.fecha}</td>
                  <td>${cancelacion.total}</td>
                  <td>{cancelacion.nota}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ReporteCorteRango;
