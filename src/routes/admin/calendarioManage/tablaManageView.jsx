import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import ModalAgregarEvento from './ModalAgregarEvento';
import ModalEvento from './ModalEvento'; // Importa el modal de edición de evento
import './tablaManageView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import apiUrls from '../../../api';
import AgregarDisponibilidad from './AgregarDisponibilidad';

const TablaManageView = ({ events, disponibilidad, startDate, endDate, updateDateRange, saveEvento, updateEvent, hours, setEvents, cambiarEstadoCita }) => {
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [fechaInicio, setFechaInicio] = useState(startDate.toISOString().substring(0, 10));
    const [fechaFin, setFechaFin] = useState(endDate.toISOString().substring(0, 10));
    const [showModalAgregar, setShowModalAgregar] = useState(false);
    const [showModalEditar, setShowModalEditar] = useState(false);
    const [newEventDate, setNewEventDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null); // Estado para el evento seleccionado

    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const filtered = events.filter(event => {
            const eventDate = new Date(event.fecha);
            const isWithinDateRange = eventDate >= new Date(fechaInicio) && eventDate <= new Date(fechaFin);
            const matchesStatusFilter = statusFilter === 'all' || event.status === statusFilter;
            const matchesSearchTerm = (event.name && event.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (event.service && event.service.toLowerCase().includes(searchTerm.toLowerCase()));
            return isWithinDateRange && matchesStatusFilter && matchesSearchTerm;
        });
        setFilteredEvents(filtered);
    }, [events, fechaInicio, fechaFin, statusFilter, searchTerm]);

    const handleDeleteEvent = async (idEvento) => {
        const confirmDelete = window.confirm("¿Seguro que quiere eliminar este evento?");
        if (confirmDelete) {
            try {
                const response = await axios.post(apiUrls.eliminarEvento, { idEvento: idEvento });
                if (response.data.success) {
                    setEvents(events.filter(event => event.id !== idEvento));
                    console.log("Evento eliminado:", idEvento);
                    alert('Evento eliminado correctamente.');
                } else {
                    alert('No se pudo eliminar el evento.');
                }
            } catch (error) {
                console.error('Error al eliminar el evento:', error);
                alert('Ocurrió un error al intentar eliminar el evento.');
            }
        }
    };

    const handleDateChange = () => {
        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);
    
        if (start > end) {
            setFechaFin(fechaInicio);
        }
    
        updateDateRange(start, end);
    };    

    const handleUpdateEvent = (updatedEvent) => {
        const updatedEvents = events.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        );
        setEvents(updatedEvents);
        setSelectedEvent(null);
        cambiarEstadoCita(updatedEvent.id, updatedEvent.status);
    };

    const countEventStatus = (events) => {
        const statusCounts = { total: 0, confirmado: 0, pendiente: 0, finalizado: 0, cancelado: 0 };
        events.forEach(event => {
            statusCounts.total++;
            if (event.status === 'confirmado') {
                statusCounts.confirmado++;
            } else if (event.status === 'pendiente') {
                statusCounts.pendiente++;
            } else if (event.status === 'finalizado') {
                statusCounts.finalizado++;
            } else if (event.status === 'cancelado') {
                statusCounts.cancelado++;
            }
        });
        return statusCounts;
    };

    const statusCounts = countEventStatus(filteredEvents);

    const dataEstudiantes = {
        labels: ['Total de eventos', 'Confirmado', 'Pendiente', 'Finalizado', 'Cancelado'],
        datasets: [
            {
                label: 'Estado de Eventos',
                backgroundColor: [
                    '#1ab1de20',
                    '#28a745',  // Verde para confirmados
                    '#ffc107',  // Amarillo para pendientes
                    '#6c757d',  // Gris para finalizados
                    '#dc3545',  // Rojo para cancelados
                ],
                borderColor: '#1ab1de',
                borderWidth: 1,
                hoverBackgroundColor: [
                    '#1ab1de20',
                    '#28a745',  // Verde para confirmados
                    '#ffc107',  // Amarillo para pendientes
                    '#6c757d',  // Gris para finalizados
                    '#dc3545', // Rojo para cancelados
                ],
                data: [
                    statusCounts.total, // Total de eventos
                    statusCounts.confirmado, // Confirmado
                    statusCounts.pendiente, // Pendiente
                    statusCounts.finalizado, // Finalizado
                    statusCounts.cancelado, // Cancelado
                ],
            },
        ],
    };

    const dataEstudiantesPastel = {
        labels: ['Confirmado', 'Pendiente', 'Finalizado', 'Cancelado'],
        datasets: [
            {
                backgroundColor: [
                    '#28a745',  // Verde para confirmados
                    '#ffc107',  // Amarillo para pendientes
                    '#6c757d',  // Gris para finalizados
                    '#dc3545',  // Rojo para cancelados
                ],
                borderColor: '#1ab1de',
                borderWidth: 1,
                hoverBackgroundColor: [
                    '#28a745',  // Verde para confirmados
                    '#ffc107',  // Amarillo para pendientes
                    '#6c757d',  // Gris para finalizados
                    '#dc3545', // Rojo para cancelados
                ],
                data: [
                    statusCounts.confirmado, // Confirmado
                    statusCounts.pendiente, // Pendiente
                    statusCounts.finalizado, // Finalizado
                    statusCounts.cancelado, // Cancelado
                ],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
                color: '#000',
                font: {
                    weight: 'bold',
                },
                formatter: (value) => value,
            },
            legend: {
                display: true,
                position: 'right',
                labels: {
                    boxWidth: 20,
                    padding: 20,
                    font: {
                        size: 12,
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
        },
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajusta la fecha a la zona horaria local
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    const formatDateWithoutTimezoneOffset = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const findDisponibilidad = (fecha, hora) => {
        const disponibilidadItem = disponibilidad.find(
            (item) => item.Fecha === fecha && item.Horario.includes(hora)
        );
        return disponibilidadItem ? disponibilidadItem.EspaciosDisponibles : 'N/A';
    };

    const handleShowModalAgregar = () => setShowModalAgregar(true);
    const handleCloseModalAgregar = () => setShowModalAgregar(false);

    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setShowModalEditar(true);
    };

    const handleCloseModalEditar = () => setShowModalEditar(false);

    const resetDates = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setFechaInicio(firstDay.toISOString().substring(0, 10));
        setFechaFin(lastDay.toISOString().substring(0, 10));
        updateDateRange(firstDay, lastDay);
    };

    return (
        <div className="table-manage-view">
            <div className="table-actions">
                <button className="new-event-btn" onClick={handleShowModalAgregar}>+ Agregar Evento</button>
            </div>
            <div className="search-and-filter">
                <div className="col d-flex align-items-center">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar por nombre o servicio"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="status-filter" onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">Todos los Estados</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>
            </div>
            <div className="date-filters">
                <div className="date-inputs">
                    <label className="mx-2">Fecha Inicio:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => {
                            setFechaInicio(e.target.value);
                            if (new Date(e.target.value) > new Date(fechaFin)) {
                                setFechaFin(e.target.value);
                            }
                        }}
                        className="form-control mx-1 fecha-inicio"
                        onBlur={handleDateChange}
                    />
                    <label className="mx-2">Fecha Fin:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        className="form-control mx-1 fecha-fin"
                        onBlur={handleDateChange}
                    />
                </div>
                <div className="reset-button">
                    <button onClick={resetDates} className="new-event-btn">Resetear Fechas <FontAwesomeIcon icon={faSyncAlt} /></button>
                </div>
            </div>
            <div className="content">
                <div className="table-container">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Estado</th>
                                <th>Nombre</th>
                                <th>Disponibilidad</th>
                                <th>Hora</th>
                                <th>Fecha</th>
                                <th>Servicio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event) => {
                                const disponibilidad = findDisponibilidad(event.fecha, event.hour);
                                return (
                                    <tr key={event.id}>
                                        <td>{event.id}</td>
                                        <td>{event.status}</td>
                                        <td>{event.name}</td>
                                        <td>{disponibilidad}</td>
                                        <td>{event.hour}</td>
                                        <td>{formatDate(event.fecha)}</td>
                                        <td>{event.service}</td>
                                        <td className="actions-cell">
                                            <button className="action-btn" onClick={() => handleEditEvent(event)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDeleteEvent(event.id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="chart-container">
                    <div className="chart-wrapper">
                        <Chart
                            type="bar"
                            data={dataEstudiantes}
                            plugins={[ChartDataLabels]}
                            options={{
                                indexAxis: 'y',
                            }}
                        />
                    </div>
                    <div className="chart-wrapper">
                        <Chart
                            type="doughnut"
                            data={dataEstudiantesPastel}
                            plugins={[ChartDataLabels]}
                            options={{
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'right',
                                        labels: {
                                            boxWidth: 30,
                                            padding: 10,
                                            font: {
                                                size: 12,
                                            },
                                        },
                                    },
                                    datalabels: {
                                        formatter: (value, context) => {
                                            const percentage = (value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
                                            return `${percentage.toFixed(2)}%`;
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <ModalAgregarEvento
                show={showModalAgregar}
                handleClose={handleCloseModalAgregar}
                saveEvento={saveEvento}
                hours={hours}
                initialDate={newEventDate}
            />
            {selectedEvent && (
                <ModalEvento
                    show={showModalEditar}
                    handleClose={handleCloseModalEditar}
                    event={selectedEvent}
                    updateEvent={handleUpdateEvent}
                    saveEvento={saveEvento}
                />
            )}
        </div>
    );
};

export default TablaManageView;
