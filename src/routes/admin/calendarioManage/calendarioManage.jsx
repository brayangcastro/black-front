import React, { useState, useEffect } from 'react';
import CalendarioManageView from './calendarioManageView';
import MensualManageView from './mensualManageView';
import TablaManageView from './tablaManageView';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CalendarioManageView.css';
import axios from 'axios';
import apiUrls from '../../../api';

const getWeekStartAndEnd = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // Si es domingo, restar 6; de lo contrario, ajustar al lunes
    start.setDate(start.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { startDate: start, endDate: end };
};

const CalendarioManage = () => {
    const { startDate: initialStartDate, endDate: initialEndDate } = getWeekStartAndEnd(new Date());
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [hours, setHours] = useState([]);
    const [viewMode, setViewMode] = useState('semanal');
    const [startDateTabla, setStartDateTabla] = useState(initialStartDate);
    const [endDateTabla, setEndDateTabla] = useState(initialEndDate);
    const [startDateSemana, setStartDateSemana] = useState(initialStartDate);
    const [endDateSemana, setEndDateSemana] = useState(initialEndDate);
    const [startDateMes, setStartDateMes] = useState(initialStartDate);
    const [endDateMes, setEndDateMes] = useState(initialEndDate);

    useEffect(() => {
        console.log("viewMode:", viewMode);
    }, [viewMode]);

    useEffect(() => {
        if (viewMode === 'semanal') {
            loadEventsAndAvailability(startDateSemana, endDateSemana);
        }
    }, [viewMode, startDateSemana, endDateSemana]);    

    useEffect(() => {
        const obtenerHorarios = async () => {
            try {
                const response = await axios.post(apiUrls.obtenerHorarios);
                const horariosExtraidos = response.data.map(horario => horario.horario);
                setHours(horariosExtraidos);
                console.log("Horarios obtenidos", horariosExtraidos);
            } catch (error) {
                console.error('Error obtenerHorarios del backend:', error);
            }
        };
        obtenerHorarios();
    }, []);

    const cambiarEstadoCita = async (idCita, nuevoEstado) => {
        try {
            const response = await axios.post(apiUrls.cambiarEstadoCita, { idCita, nuevoEstado });
            console.log("response", response);
        } catch (error) {
            console.error('Error cambiarEstadoCita del backend:', error);
        }
    };

    const editarEvento = async (evento) => {
        try {
            console.log("evento a enviar",evento)
            const response = await axios.post(apiUrls.editarEvento, {
                nuevoEvento: {
                    id: evento.id,
                    fecha: evento.fecha,
                    hour: evento.hour,
                    service: evento.service,
                    status: evento.status,
                    name: evento.name
                }
            });
            console.log("response", response);
            if (response.data.success) {
                console.log("Evento actualizado correctamente.");
                const { startDate, endDate } = getWeekStartAndEnd(currentWeek);
                loadEventsAndAvailability(startDate, endDate);
            } else {
                console.log("No se pudo actualizar el evento.");
            }
        } catch (error) {
            console.error('Error editarEvento del backend:', error);
        }
    };

    const handleNextWeek = () => {
        const nextWeekStart = new Date(startDateSemana);
        nextWeekStart.setDate(nextWeekStart.getDate() + 7);
        const { startDate, endDate } = getWeekStartAndEnd(nextWeekStart);
        updateDateRangeSemana(startDate, endDate);
    };

    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(startDateSemana);
        prevWeekStart.setDate(prevWeekStart.getDate() - 7);
        const { startDate, endDate } = getWeekStartAndEnd(prevWeekStart);
        updateDateRangeSemana(startDate, endDate);
    };

    const loadEventsAndAvailability = async (startDate, endDate) => {
        try {
            const eventsResponse = await axios.post(apiUrls.obtenerEventos, {
                fecha_inicio: startDate.toISOString().substring(0, 10),
                fecha_fin: endDate.toISOString().substring(0, 10)
            });
            setEvents(eventsResponse.data);
            console.log("Eventos:", eventsResponse.data);

            const availabilityResponse = await axios.post(apiUrls.obtenerDisponibilidadReal, {
                fecha_inicio: startDate.toISOString().substring(0, 10),
                fecha_fin: endDate.toISOString().substring(0, 10)
            });
            setDisponibilidad(availabilityResponse.data);
            console.log("Disponibilidad:", availabilityResponse.data);
        } catch (error) {
            console.error('Error obteniendo datos:', error);
        }
    };

    const saveEvento = async (evento) => {
        try {
            console.log("enviando evento", evento);
            const response = await axios.post(apiUrls.agregarEvento, { evento });
            console.log('Evento agregado:', response.data);
            const { startDate, endDate } = getWeekStartAndEnd(currentWeek);
            loadEventsAndAvailability(startDate, endDate);
        } catch (error) {
            console.error('Error al agregar evento:', error);
        }
    };

    const actualizarDisponibilidad = async (id, nuevaCapacidad) => {
        try {
            console.log('Enviando...', id, nuevaCapacidad);
            const response = await axios.post(apiUrls.editarDisponibilidad, {
                id: id,
                capacidad: nuevaCapacidad
            });
            console.log('Respuesta de actualizar disponibilidad:', response.data);
            alert('Disponibilidad actualizada correctamente.');
        } catch (error) {
            console.error('Error al actualizar la disponibilidad:', error);
            alert('Error al actualizar la disponibilidad.');
        }
    };

    const handleUpdateAvailability = async (fecha, horario, nuevaCapacidad) => {
        try {
            console.log('Enviando...', fecha, horario, nuevaCapacidad);
            const response = await axios.post(apiUrls.editarAgregarDisponibilidad, {
                fecha,
                horario,
                capacidad: nuevaCapacidad
            });
            if (response.data.success) {
                alert('Disponibilidad actualizada o agregada correctamente');
                const { startDate, endDate } = getWeekStartAndEnd(currentWeek);
                loadEventsAndAvailability(startDate, endDate);
            } else {
                alert('Error al actualizar la disponibilidad: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error al actualizar la disponibilidad:', error);
            alert('Error de comunicación al actualizar la disponibilidad');
        }
    };

    const updateDateRangeTabla = (start, end) => {
        setStartDateTabla(start);
        setEndDateTabla(end);
        loadEventsAndAvailability(start, end);
    };

    const updateDateRangeSemana = (start, end) => {
        setStartDateSemana(start);
        setEndDateSemana(end);
        loadEventsAndAvailability(start, end);
    };

    const updateDateRangeMes = (start, end) => {
        setStartDateMes(start);
        setEndDateMes(end);
        loadEventsAndAvailability(start, end);
    };

    return (
        <>
            <div className="container my-4">
                <div className="nav-header row mb-4">
                    <div className="view-buttons col">
                        <button onClick={() => setViewMode('semanal')} disabled={viewMode === 'semanal'} className={`btn btn-outline-primary mx-1 ${viewMode === 'semanal' ? 'active' : ''}`}>Vista Semanal</button>
                        <button onClick={() => setViewMode('mensual')} disabled={viewMode === 'mensual'} className={`btn btn-outline-primary mx-1 ${viewMode === 'mensual' ? 'active' : ''}`}>Vista Mensual</button>
                        <button onClick={() => setViewMode('tabla')} disabled={viewMode === 'tabla'} className={`btn btn-outline-primary mx-1 ${viewMode === 'tabla' ? 'active' : ''}`}>Vista en Tabla</button>
                    </div>
                    <div className="row mb-4">
                        <div className="col text-center">
                            <h3 className="gestion-title">GESTIÓN DE EVENTOS</h3>
                        </div>
                    </div>
                </div>
            </div>
            {viewMode === 'semanal' ? (
                <CalendarioManageView
                    week={currentWeek}
                    setWeek={setCurrentWeek}
                    events={events}
                    setEvents={setEvents}
                    disponibilidad={disponibilidad}
                    cambiarEstadoCita={cambiarEstadoCita}
                    saveEvento={saveEvento}
                    hours={hours}
                    handleUpdateAvailability={handleUpdateAvailability}
                    startDate={startDateSemana}
                    endDate={endDateSemana}
                    updateDateRange={updateDateRangeSemana}
                    loadEventsAndAvailability={loadEventsAndAvailability}
                    editarEvento={editarEvento}
                />
            ) : viewMode === 'mensual' ? (
                <MensualManageView
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    events={events}
                    setEvents={setEvents}
                    disponibilidad={disponibilidad}
                    cambiarEstadoCita={cambiarEstadoCita}
                    saveEvento={saveEvento}
                    hours={hours}
                    handleUpdateAvailability={handleUpdateAvailability}
                    updateDateRange={updateDateRangeMes}
                    startDate={startDateMes}
                    endDate={endDateMes}
                    loadEventsAndAvailability={loadEventsAndAvailability}
                />
            ) : (
                <TablaManageView
                    events={events}
                    setEvents={setEvents}
                    disponibilidad={disponibilidad}
                    startDate={startDateTabla}
                    endDate={endDateTabla}
                    updateDateRange={updateDateRangeTabla}
                    saveEvento={saveEvento}
                    cambiarEstadoCita={cambiarEstadoCita}
                />
            )}
        </>
    );
};

export default CalendarioManage;
