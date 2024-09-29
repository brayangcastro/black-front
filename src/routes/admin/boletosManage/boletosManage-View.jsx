import React, { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Doughnut, Chart } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import BoletosTable from './boletosTable';
import BoletoDetalleModal from './BoletoDetalleModal'; // Importamos el nuevo modal
import './boletosManage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const BoletosManageView = ({ boletos, setBoleto, boleto, clave, boletoDetail, dataBoletoDelete, setDataBoletoDelete, editingBoleto, setEditingBoleto, eventos, setEventoSeleccionado, eventoSeleccionado }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [boletoSeleccionado, setBoletoSeleccionado] = useState(null); // Para almacenar el boleto seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    // Función para manejar cuando se hace clic en "Ver Detalles"
    const handleVerDetalles = (boleto) => {
        setBoletoSeleccionado(boleto); // Guardar el boleto seleccionado
        setShowModal(true); // Mostrar el modal
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setBoletoSeleccionado(null);
    };

    // Función para cancelar el boleto
    const handleCancelarBoleto = () => {
        console.log("Cancelar Boleto:", boletoSeleccionado);
        // Aquí puedes implementar la lógica para cancelar el boleto
        handleCloseModal(); // Cerrar el modal después de la acción
    };

    // Función para limpiar el boleto
    const handleLimpiarBoleto = () => {
        console.log("Limpiar Boleto:", boletoSeleccionado);
        // Implementa la lógica para limpiar el boleto
        handleCloseModal(); // Cerrar el modal
    };

    // Función para apartar el boleto
    const handleApartarBoleto = () => {
        console.log("Apartar Boleto:", boletoSeleccionado);
        // Implementa la lógica para apartar el boleto
        handleCloseModal(); // Cerrar el modal
    };

    // Contar los boletos en cada estado
    const contarEstadosBoletos = (boletos) => {
        let confirmado = 0;
        let procesando = 0;
        let disponible = 0;

        boletos.forEach(boleto => {
            switch (boleto.Estado.toUpperCase()) {
                case 'CONFIRMADO':
                    confirmado++;
                    break;
                case 'PROCESANDO':
                    procesando++;
                    break;
                case 'DISPONIBLE':
                    disponible++;
                    break;
                default:
                    break;
            }
        });

        return [confirmado, procesando, disponible];
    };

    const [confirmado, procesando, disponible] = contarEstadosBoletos(boletos);

    const chartData = {
        labels: ['Confirmado', 'Procesando', 'Disponible'], // Etiquetas basadas en los estados de boletos
        datasets: [
            {
                label: 'Boletos por Estado',
                data: [confirmado, procesando, disponible], // Actualizado según los estados de boletos
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Color para "Confirmado"
                    'rgba(255, 205, 86, 0.6)', // Color para "Procesando"
                    'rgba(75, 192, 192, 0.6)' , // Color para "Disponible"
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)' , // Borde para "Confirmado"
                    'rgba(255, 205, 86, 1)', // Borde para "Procesando"
                    'rgba(75, 192, 192, 1)', // Borde para "Disponible"
                ],
                borderWidth: 1,
            },
        ],
    };

    const optionsDoughnut = {
        plugins: {
            legend: {
                display: true,
                position: 'right',
            },
            datalabels: {
                formatter: (value, context) => {
                    const percentage = (value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
                    return `${percentage.toFixed(2)}%`;
                },
            },
        },
    };

    const descargarReporte = async () => {
        // Lógica para descargar el reporte de boletos
        // Puedes integrarlo según los requerimientos de tu API
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col>
                    <h4>Gestión de Boletos</h4>
                </Col>
            </Row>

            <Row className="mt-3 mb-3">
                <Col md={8} sm={{ order: 1 }} xs={{ order: 2 }}>
                    {/* Selector de eventos */}
                    <Form.Group controlId="formEvento">
    <Form.Label>Selecciona un Evento</Form.Label>
    <Form.Control 
        as="select" 
        value={eventoSeleccionado || ""}  // Usar "" si eventoSeleccionado es null o undefined
        onChange={(e) => setEventoSeleccionado(e.target.value)}
    >
        {eventos.map(evento => (
            <option key={evento.ID} value={evento.ID}>
                {evento.Nombre} - {evento.Fecha}
            </option>
        ))}
    </Form.Control>
</Form.Group>


                    <Row className="mt-3 mb-3">
                        <Col md={3} xs={4} className="d-flex align-items-stretch">
                            <Button className='btn-accion' variant="success">
                                Agregar Boleto
                            </Button>
                        </Col>
                        <Col md={3} xs={4} className="d-flex align-items-stretch">
                            <Button className='btn-accion' variant="success" onClick={descargarReporte}>
                                <FontAwesomeIcon icon={faDownload} /> Descargar reporte
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <BoletosTable
                            boletos={boletos}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            handleVerDetalles={handleVerDetalles} // Pasar la función para ver detalles
                        />
                    </Row>
                </Col>
                <Col md={4} sm={{ order: 2 }} xs={{ order: 1 }}>
                    <Row className="mb-3">
                        <Col md>
                            <Chart
                                type="bar"
                                data={chartData}
                                plugins={[ChartDataLabels]}
                                options={{
                                    indexAxis: 'y',
                                }}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Row className="mb-3">
                                <Col>
                                    <Doughnut data={chartData} plugins={[ChartDataLabels]} options={optionsDoughnut} className='chart' />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Modal para ver detalles del boleto */}
            <BoletoDetalleModal
                show={showModal}
                handleClose={handleCloseModal}
                boletoSeleccionado={boletoSeleccionado}
                handleCancelarBoleto={handleCancelarBoleto}
                handleLimpiarBoleto={handleLimpiarBoleto}
                handleApartarBoleto={handleApartarBoleto}
            />
        </Container>
    );
};

export default BoletosManageView;
