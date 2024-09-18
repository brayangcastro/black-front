import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faUniversity, faCheck, faGift, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Accordion, Card, Button } from 'react-bootstrap';

const ReportViewerRango = ({ pagoJson, totales, movEntrada, movSalida, productos10, cancelaciones, vendedores, cortesTotales, cortesCuenta, startDate, endDate }) => {
  console.log("p10", productos10)
  const totalDiferencia = pagoJson.reduce((acc, metodo) => acc + metodo.diferencia, 0);

  const generateBarChartData = (labels, datasets, colors, title) => ({
    labels,
    datasets: datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: colors[index],
    })),
  });

  const generateColors = (data) => data.map(value => value >= 0 ? '#8FDB5E' : '#E75050');

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

  const cortesTotalesData = generateBarChartData(
    cortesTotales.map(corte => corte.Fecha),
    [
      {
        label: 'Total por Corte',
        data: cortesTotales.map(corte => {
          const efectivo = parseFloat(corte.Efectivo) || 0;
          const tarjeta = parseFloat(corte.Tarjeta) || 0;
          const transferencia = parseFloat(corte.Transferencia) || 0;
          const cheque = parseFloat(corte.Cheque) || 0;
          const vale = parseFloat(corte.Vale) || 0;
          return efectivo + tarjeta + transferencia + cheque + vale;
        })
      }
    ],
    ['rgba(54, 162, 235, 0.8)'],
    'Total por Corte'
  );

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
                Top 10 Productos Más Vendidos (Total: ${total})
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
                      <td>{row.usuario}</td>
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
  const corteTotalsOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Total de Cortes'
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
        <h1 className="my-4">TACOS KISSI</h1>
        <div className="row mb-4 " >
          <div className="col-md-12 text-center">
            <h5><strong>Fecha:</strong> DEL {startDate} AL {endDate}</h5>
            <h5><strong>Total:</strong> ${pagoJson.reduce((total, metodo) => total + metodo.calculado, 0)}</h5>
            <h5><strong>Total de Cortes: </strong>{cortesCuenta}</h5>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-md-12">
            {/*<p><strong>Total de Cortes:</strong> {cortesCuenta}</p>*/}
            <div style={{ width: '100%', height: '100%' }}>
              <Bar
                data={cortesTotalesData}
                options={corteTotalsOptions}
              />
            </div>
          </div>
        </div><br></br><br></br>

        <div className="row">
          <h4>Desglose de Pagos</h4><br></br>
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
          <div className="col-md-6" style={{ marginTop: '90px', height: '400px' }}>
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
        <Productos10Table data={productos10} />
        <CancelacionesTable data={cancelaciones} />
        <TicketsVendedorTable data={vendedores} /></>
    </div >
  );
};

export default ReportViewerRango;
