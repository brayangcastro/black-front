import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faUniversity, faCheck, faGift, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Card, Button } from 'react-bootstrap';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables, ChartDataLabels);

const ReportViewer = ({ pagoJson, totales, movEntrada, movSalida, productos10, cancelaciones, fechaCorte, ticketsTotales, vendedores, corteId }) => {

  const productosVendidos = productos10.filter(producto => producto.categoria !== "ESPECIES Y SEMILLAS");
  const productosEspeciesYSemillas = productos10.filter(producto => producto.categoria === "ESPECIES Y SEMILLAS");

  console.log("vendedores", vendedores)
  console.log("movEntrada", movEntrada)
  console.log("movSalida", movSalida)

  // Agrupar los productos por categoría y calcular el total vendido por cada categoría
  const categorias = productos10.reduce((acc, producto) => {
    if (!acc[producto.categoria]) {
      acc[producto.categoria] = 0;
    }
    acc[producto.categoria] += parseFloat(producto.subtotal) || 0;
    return acc;
  }, {});

  // Preparar datos para el gráfico de barras
  const categoriasLabels = Object.keys(categorias);
  const categoriasData = Object.values(categorias);
  const categoriasColors = categoriasLabels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16)); // Generar colores aleatorios

  const categoriasChartData = {
    labels: categoriasLabels,
    datasets: [{
      label: 'Total Vendido por Categoría',
      data: categoriasData,
      backgroundColor: categoriasColors
    }]
  };

  const categoriasChartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Total Vendido por Categoría'
      },
      legend: {
        display: false // Desactiva la leyenda incorporada de Chart.js
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'end',
        offset: -7,
        rotation: -55,
        formatter: (value) => `$${value.toFixed(2)}` // Formatear los valores para que aparezcan como números con dos decimales
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const totalDiferencia = pagoJson?.reduce((acc, metodo) => acc + metodo.diferencia, 0) || 0;

  const generateBarChartData = (labels, datasets, colors) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: colors
    })),
  });

  // Extraer y ordenar los datos por hora
  const sortedTicketsTotales = ticketsTotales
    .map(ticket => ({
      ...ticket,
      Hora: ticket.Fecha.split(' ')[1]
    }))
    .sort((a, b) => a.Hora.localeCompare(b.Hora));

  const ticketColors = sortedTicketsTotales.map(ticket => {
    if (ticket.Tipo === 'VENTA') return '#87BCF3'; // Azul
    if (ticket.Tipo === 'SALIDA') return '#E75050'; // Rojo
    if (ticket.Tipo === 'ENTRADA') return '#8FDB5E'; // Verde
    return '#84878A'; // Gris por defecto para otros tipos
  });

  const ticketsTotalesData = generateBarChartData(
    sortedTicketsTotales.map(ticket => ticket.Hora), // Usar las horas ordenadas
    [{ label: 'Total por Ticket', data: sortedTicketsTotales.map(ticket => ticket.Total) }],
    ticketColors
  );

  const paymentMethodsData = {
    labels: pagoJson?.map(resultado => resultado.metodo) || [],
    datasets: [
      {
        label: 'Calculado',
        data: pagoJson?.map(resultado => resultado.calculado) || [],
        backgroundColor: '#FFA500' // Naranja
      },
      {
        label: 'Contado',
        data: pagoJson?.map(resultado => resultado.contado) || [],
        backgroundColor: '#8FDB5E' // Verde
      },
      {
        label: 'Diferencia',
        data: pagoJson?.map(resultado => resultado.diferencia) || [],
        backgroundColor: '#E75050' // Rojo
      }
    ]
  };

  const totalData = {
    labels: ['Total Ventas', 'Total Entradas', 'Total Salidas', 'Balance Movimientos', 'Tickets Totales', 'Promedio por Ticket', 'Total al Corte'],
    datasets: [{
      label: 'Totales',
      data: [totales?.totalVentas, totales?.totalEntradas, totales?.totalSalidas, totales?.balanceMovimientos, totales?.conteoTotal, totales?.averageTicket, totales?.totalCorte] || [],
      backgroundColor: [
        totales?.totalVentas >= 0 ? '#8FDB5E' : '#E75050',
        totales?.totalEntradas >= 0 ? '#8FDB5E' : '#E75050',
        totales?.totalSalidas >= 0 ? '#8FDB5E' : '#E75050',
        totales?.balanceMovimientos >= 0 ? '#8FDB5E' : '#E75050',
        totales?.conteoTotal >= 0 ? '#8FDB5E' : '#E75050',
        totales?.averageTicket >= 0 ? '#8FDB5E' : '#E75050',
        totales?.totalCorte >= 0 ? '#8FDB5E' : '#E75050'
      ]
    }]
  };

  const StandardBarChart = ({ data, title, formatter }) => {
    const options = {
      plugins: {
        title: {
          display: true,
          text: title
        },
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          color: 'black',
          anchor: 'end',
          align: 'end',
          offset: -7,
          rotation: -55,
          formatter: formatter || ((value) => `$${value.toFixed(2)}`) // Default to money format
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div style={{ width: '100%', height: '400px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };

  const MovimientosEntradaTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const chartData = {
      labels: data.map(item => item.usuario),
      datasets: [{
        label: 'Total',
        data: data.map(item => parseFloat(item.total)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="2">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Movimientos de Entrada (Total: ${total})
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
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
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.orden}</td>
                      <td>{row.usuario}</td>
                      <td>{row.fecha}</td>
                      <td>{row.total}</td>
                      <td>{row.estado}</td>
                      <td>{row.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const MovimientosSalidaTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const chartData = {
      labels: data.map(item => item.usuario),
      datasets: [{
        label: 'Total',
        data: data.map(item => parseFloat(item.total)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="2">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Movimientos de Salida (Total: ${total})
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
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
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.orden}</td>
                      <td>{row.usuario}</td>
                      <td>{row.fecha}</td>
                      <td>{row.total}</td>
                      <td>{row.estado}</td>
                      <td>{row.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const Productos10Table = ({ data }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0).toFixed(2);

    const chartData = {
      labels: data.map(item => item.nombre),
      datasets: [{
        label: 'Productos Vendidos',
        data: data.map(item => parseFloat(item.subtotal)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="2">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Productos Vendidos (Total: ${total})
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
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
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.id}</td>
                      <td>{row.nombre}</td>
                      <td>{row.precio}</td>
                      <td>{row.cantidad_vendida}</td>
                      <td>{row.subtotal}</td>
                      <td>{row.categoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const EspeciesYSemillasTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0).toFixed(2);

    const chartData = {
      labels: data.map(item => item.nombre),
      datasets: [{
        label: 'Especies y Semillas',
        data: data.map(item => parseFloat(item.subtotal)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="2">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Especies y Semillas (Total: ${total})
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
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
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.id}</td>
                      <td>{row.nombre}</td>
                      <td>{row.precio}</td>
                      <td>{row.cantidad_vendida}</td>
                      <td>{row.subtotal}</td>
                      <td>{row.categoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const CancelacionesTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const total = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const chartData = {
      labels: data.map(item => item.producto),
      datasets: [{
        label: 'Total',
        data: data.map(item => parseFloat(item.total)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="2">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Cancelaciones (Total: ${total})
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Cantidad</th>
                    <th>Producto</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.id}</td>
                      <td>{row.cantidad}</td>
                      <td>{row.producto}</td>
                      <td>{row.nombreCliente}</td>
                      <td>{row.fecha}</td>
                      <td>{row.total}</td>
                      <td>{row.nota}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const TicketsVendedorTable = ({ data }) => {
    if (!data || data.length === 0) return null;

    const chartData = {
      labels: data.map(item => item.nombre),
      datasets: [{
        label: 'Tickets Por Vendedor',
        data: data.map(item => parseFloat(item.total)),
        backgroundColor: '#87BCF3'
      }]
    };

    return (
      <Accordion>
        <Card style={{ marginBottom: '1rem', border: '1px solid #ccc' }}>
          <Accordion.Item eventKey="4">
            <Accordion.Header style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#ffffff', borderBottom: '1px solid #ccc', borderRadius: '0.25rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <div style={{ padding: '1px 6px', backgroundColor: 'transparent', color: '#464646', fontSize: '1.4rem', fontWeight: 'bold', width: '100%' }}>
                Tickets Por Vendedor
              </div>
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#e9ecef', color: '#000' }}>
              <table className="table table-striped">
                <thead className="thead-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Total de Tickets</th>
                    <th>Ticket Promedio</th>
                    <th>Total</th>
                    <th>Total Cancelaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.nombre}</td>
                      <td>{row.total_tickets}</td>
                      <td>{row.ticket_promedio}</td>
                      <td>{row.total}</td>
                      <td>{row.total_cancelaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <StandardBarChart data={chartData} title="" />
            </Accordion.Body>
          </Accordion.Item>
        </Card>
      </Accordion>
    );
  };

  const getIcon = (method) => {
    switch (method) {
      case 'Efectivo':
        return <FontAwesomeIcon icon={faMoneyBillWave} />;
      case 'Tarjeta':
        return <FontAwesomeIcon icon={faCreditCard} />;
      case 'Transferencia':
        return <FontAwesomeIcon icon={faUniversity} />;
      case 'Cheque':
        return <FontAwesomeIcon icon={faCheck} />;
      case 'Vale':
        return <FontAwesomeIcon icon={faGift} />;
      default:
        return <FontAwesomeIcon icon={faInfoCircle} />;
    }
  };

  // Opciones específicas para el gráfico de tickets totales
  const ticketTotalsOptions = {
    plugins: {
      title: {
        display: true,
        text: ''
      },
      legend: {
        display: false // Desactiva la leyenda incorporada de Chart.js
      },
      datalabels: {
        display: true,
        color: 'black',
        anchor: 'end',
        align: 'start',
        offset: -35, // Ajusta esta propiedad para mover las etiquetas más arriba
        rotation: -55, // Rotación de las etiquetas
        formatter: (value) => `$${value}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Definir colores y etiquetas para la leyenda
  const legendItems = [
    { color: '#87BCF3', label: 'VENTA' },
    { color: '#E75050', label: 'SALIDA' },
    { color: '#8FDB5E', label: 'ENTRADA' }
  ];

  // Opciones para los gráficos que no deben tener etiquetas de datos
  const paymentMethodsOptions = {
    plugins: {
      datalabels: {
        display: false // Desactivar etiquetas de datos
      },
      title: { display: true, text: 'Métodos de Pago' },
      scales: { y: { beginAtZero: true } }
    }
  };

  const totalOptions = {
    plugins: {
      datalabels: {
        display: false // Desactivar etiquetas de datos
      },
      title: { display: true, text: 'Totales' },
      scales: { y: { beginAtZero: true } }
    }
  };

  return (
    <div className="container">
      <>
        <h2 className="my-4 text-center">PUNTO MÁGICO</h2>
        <div className="row mb-4">
          <div className="col-md-12 text-center">
            <h5><strong>Fecha del Corte:</strong> {fechaCorte}</h5>
            <h5><strong>ID del Corte:</strong> {corteId}</h5>
            <h5><strong>Total:</strong> ${totales.totalCorte}</h5>
          </div>
        </div>

        <div className="row">
          <h4>Tickets Totales: {totales.conteoTotal}</h4>
          <div style={{ width: '100%' }}>
            <Bar
              data={ticketsTotalesData}
              options={ticketTotalsOptions}
            />
          </div>
          <div className="legend mt-2">
            {legendItems.map((item, index) => (
              <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      backgroundColor: item.color,
                      width: '20px',
                      height: '20px',
                      display: 'inline-block',
                      marginRight: '5px',
                      borderRadius: '50%',
                      flexShrink: 0
                    }}
                  ></span>
                  <span>{item.label}</span>
                </span>
              </div>
            ))}
          </div>
        </div><br></br>

        <div className="row my-4">
          <h4>Total Vendido por Categoría</h4>
          <div style={{ width: '100%' }}>
            <Bar
              data={categoriasChartData}
              options={categoriasChartOptions}
            />
          </div>
        </div>

        <div className="row">
          <h4>Desglose de Pagos</h4>
          <div className="col-md-6">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Método</th>
                  <th>Calculado</th>
                  <th>Contado</th>
                  <th>Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {pagoJson.map((metodo, index) => (
                  <tr key={index}>
                    <td>{getIcon(metodo.metodo)} {metodo.metodo}</td>
                    <td>${metodo.calculado}</td>
                    <td>${metodo.contado}</td>
                    <td>${metodo.diferencia}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3"><strong>Diferencia Total</strong></td>
                  <td><strong>${totalDiferencia}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="col-md-6" style={{ marginTop: '90px' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <Bar
                data={paymentMethodsData}
                options={paymentMethodsOptions}
              />
            </div>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-md-12 text-center">
            <h4>Totales</h4>
          </div>
          <div className="col-md-6">
            <ul className="list-group mb-4">
              <li className="list-group-item">Total Ventas: ${totales.totalVentas}</li>
              <li className="list-group-item">Total Entradas: ${totales.totalEntradas}</li>
              <li className="list-group-item">Total Salidas: ${totales.totalSalidas}</li>
              <li className="list-group-item">Balance Movimientos: ${totales.balanceMovimientos}</li>
              <li className="list-group-item">Tickets Totales: {totales.conteoTotal}</li>
              <li className="list-group-item">Promedio por Ticket: ${totales.averageTicket}</li>
              <li className="list-group-item">Total al Corte: ${totales.totalCorte}</li>
            </ul>
          </div>
          <div className="col-md-6" style={{ marginTop: '30px' }}>
            <div style={{ width: '100%', height: '100%' }}>
              <Bar
                data={totalData}
                options={totalOptions}
              />
            </div>
          </div>
        </div>

        <MovimientosEntradaTable data={movEntrada} />
        <MovimientosSalidaTable data={movSalida} />
        <Productos10Table data={productosVendidos} />
        <EspeciesYSemillasTable data={productosEspeciesYSemillas} />
        <CancelacionesTable data={cancelaciones} />
        <TicketsVendedorTable data={vendedores} /></>
    </div>
  );
};

export default ReportViewer;
