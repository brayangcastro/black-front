import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import ModalEvento from './ModalEvento';
import ModalAgregarEvento from './ModalAgregarEvento';
import AgregarDisponibilidad from './AgregarDisponibilidad';
import EditarDisponibilidad from './EditarDisponibilidad';
import axios from 'axios';
import apiUrls from '../../../api';

const CalendarioManageView = ({
    week,
    setWeek,
    events,
    setEvents,
    disponibilidad,
    cambiarEstadoCita,
    saveEvento,
    hours,
    handleUpdateAvailability,
    startDate,
    endDate,
    updateDateRange,
    loadEventsAndAvailability,
    editarEvento
}) => {
    const [loading, setLoading] = useState(true); // Nuevo estado para el loader
    const [showAgregarDisponibilidad, setShowAgregarDisponibilidad] = useState(false);
    const [showEditarDisponibilidad, setShowEditarDisponibilidad] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModalEvento, setShowModalEvento] = useState(false);
    const [showModalAgregarEvento, setShowModalAgregarEvento] = useState(false);

    const [newEventDate, setNewEventDate] = useState(null);
    const [newEventHour, setNewEventHour] = useState('');
    const [fixedHour, setFixedHour] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);  // Nuevo estado

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const [weekDates, setWeekDates] = useState([]);

    const [services, setServices] = useState([]);

    const fetchServices = async () => {
        try {
            const response = await axios.post(apiUrls.obtenerServicios);
            console.log("fetchServices", response.data)
            setServices(response.data);
        } catch (error) {
            setServices([]);
        }
    };

    const getStartOfWeek = (date) => {
        const start = new Date(date);
        const day = start.getDay();
        const diff = (day === 0 ? -6 : 1) - day; // Si es domingo, restar 6; de lo contrario, ajustar al lunes
        start.setDate(start.getDate() + diff);
        start.setHours(0, 0, 0, 0);
        return start;
    };

    useEffect(() => {
        const today = new Date();
        const startOfWeek = getStartOfWeek(today);
        setWeek(startOfWeek);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        updateDateRange(startOfWeek, endOfWeek);
        loadEventsAndAvailability(startOfWeek, endOfWeek)
            .then(() => setLoading(false)); // Set loading to false after loading events and availability
    }, []);

    useEffect(() => {
        fetchServices();
    }, []);

    console.log("events", events);

    useEffect(() => {
        setWeekDates(getWeekDates(week));
    }, [week]);

    const findEvent = (date, hour) => {
        return events.find(event =>
            new Date(event.fecha).toISOString().split('T')[0] === date.toISOString().split('T')[0] &&
            event.hour === hour
        );
    };

    const findEvents = (date, hour) => {
        return events.filter(event =>
            new Date(event.fecha).toISOString().split('T')[0] === date.toISOString().split('T')[0] &&
            event.hour === hour
        );
    };

    const fetchAvailableHours = async (date) => {
        try {
            const response = await axios.post(apiUrls.obtenerDisponibilidadRealPorFecha, { fecha: date });
            const filteredHours = response.data.filter(hour => parseInt(hour.EspaciosDisponibles) > 0)
                .map(hour => `${hour.Horario} (${hour.EspaciosDisponibles} espacios disponibles)`);
            return filteredHours;
        } catch (error) {
            console.error('Error al obtener horas disponibles:', error);
            return [];
        }
    };

    const handleDisponibilidadClose = () => {
        setShowAgregarDisponibilidad(false);
        if (newEventDate) {
            fetchAvailableHours(newEventDate).then(setAvailableHours);
        }
        if (showModalAgregarEvento) {
            fetchAvailableHours(newEventDate).then(setAvailableHours); // Actualiza las horas disponibles en el modal de agregar evento
        }
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModalEvento(true);
    };

    const handleCellClick = (day, hour) => {
        const eventsAtThisTime = findEvents(day, hour);
        const availability = getAvailability(day, hour);
        const unavailable = availability.EspaciosDisponibles === 0; // Actualiza aquí

        const availabilityText = availability.EspaciosDisponibles > 0
            ? `${hour} (${availability.EspaciosDisponibles} espacios disponibles)`
            : `${hour} (No hay espacios disponibles)`;

        setNewEventDate(day.toISOString().split('T')[0]);
        setNewEventHour(availabilityText);
        setShowModalAgregarEvento(true);
        setFixedHour(true);
        setIsUnavailable(unavailable);  // Asegúrate de usar 'unavailable' aquí
    };

    const updateAvailableHours = async (date) => {
        try {
            const response = await axios.post(apiUrls.obtenerDisponibilidadRealPorFecha, { fecha: date });
            const filteredHours = response.data.filter(hour => parseInt(hour.EspaciosDisponibles) > 0)
                .map(hour => `${hour.Horario} (${hour.EspaciosDisponibles} espacios disponibles)`);
            return filteredHours;
        } catch (error) {
            return [];
        }
    };

    const handleAvailabilityClick = (date, hour) => {
        const availability = getAvailability(date, hour);
        if (availability) {
            const utcDate = date.toISOString().split('T')[0];
            setSelectedDate(utcDate);
            setSelectedAvailability({
                id: availability.ID,
                fecha: utcDate,
                horario: hour,
                capacidad: availability.capacidad
            });
            setShowEditarDisponibilidad(true);
        }
    };

    const handleUpdateEvent = async (updatedEvent) => {
        try {
            const service = services.find(service => service.id === updatedEvent.service);
            const updatedEventWithServiceName = {
                ...updatedEvent,
                serviceName: service ? service.nombre : ''
                
            };
            await editarEvento(updatedEventWithServiceName); // Llama a la función para actualizar en el backend
            const updatedEvents = events.map(event =>
                event.id === updatedEventWithServiceName.id ? updatedEventWithServiceName : event
            );
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error al actualizar el evento en el backend:', error);
        }
    };

    const isAvailable = (day, hour) => {
        const dayOfWeek = daysOfWeek.indexOf(day) + 1;
        const availabilityForDayAndHour = disponibilidad.find(d =>
            new Date(d.Fecha).getDay() === dayOfWeek && d.Horario === hour
        );
        return availabilityForDayAndHour && availabilityForDayAndHour.Capacidad > 0;
    };

    const getAvailability = (day, hour) => {
        const formattedDay = day.toISOString().split('T')[0];
        const availability = disponibilidad.find(d =>
            d.Fecha === formattedDay && d.Horario === hour
        );
        return availability || { EspaciosDisponibles: 0 };
    };

    const getWeekDates = (date) => {
        let start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const day = start.getDay();
        const diff = (day === 0 ? -6 : 1) - day;
        start.setDate(start.getDate() + diff);

        return Array.from({ length: 7 }, (_, i) => {
            let weekDate = new Date(start);
            weekDate.setDate(start.getDate() + i);
            return weekDate;
        });
    };

    const getWeekRange = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('es-ES')} - ${endOfWeek.toLocaleDateString('es-ES')}`;
    };

    const handleShowModalAgregarEvento = () => {
        setNewEventDate('');
        setNewEventHour('');
        setFixedHour(false);
        setShowModalAgregarEvento(true);
    };

    const handleCloseModalAgregarEvento = () => setShowModalAgregarEvento(false);

    const handleCloseModalEvento = () => setShowModalEvento(false);

    const handlePreviousWeek = () => {
        const newWeek = new Date(week);
        newWeek.setDate(newWeek.getDate() - 7);
        const start = getStartOfWeek(newWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        updateDateRange(start, end);
        setWeek(start);
        loadEventsAndAvailability(start, end); // Cargar eventos y disponibilidad
    };

    const handleNextWeek = () => {
        const newWeek = new Date(week);
        newWeek.setDate(newWeek.getDate() + 7);
        const start = getStartOfWeek(newWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        updateDateRange(start, end);
        setWeek(start);
        loadEventsAndAvailability(start, end); // Cargar eventos y disponibilidad
    };

    return (
        <div>
            {loading ? (
                <div className="loader-container">
                    <div className="loading-spinner">
                        <TailSpin
                            color="#00BFFF"
                            height={100}
                            width={100}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div className="row mb-4">
                        <div className="col text-center" style={{ color: '#29488F', fontSize: '24px', fontWeight: 'bold' }}>
                            Rango de Fechas: {getWeekRange(week)}
                        </div>
                    </div>
                    <div>
                        <button className="modern-button gold-button" onClick={handlePreviousWeek}>Semana Anterior</button>
                        <button className="modern-button gold-button" onClick={handleNextWeek}>Semana Siguiente</button>
                    </div>
                    <div>
                        <button className="modern-button blue-button" onClick={handleShowModalAgregarEvento}>Agregar Nuevo Evento</button>
                        <button className="modern-button blue-button" onClick={() => setShowAgregarDisponibilidad(true)}>Agregar Disponibilidad</button>

                        <ModalAgregarEvento
                            show={showModalAgregarEvento}
                            handleClose={handleCloseModalAgregarEvento}
                            saveEvento={saveEvento}
                            hours={hours}
                            initialDate={newEventDate}
                            initialHour={newEventHour.split(' (')[0]} // Solo la hora
                            fixedHour={fixedHour}
                            availabilityText={newEventHour}
                            onDisponibilidadClose={handleDisponibilidadClose}
                            isUnavailable={isUnavailable}  // Nueva prop
                            setIsUnavailable={setIsUnavailable}
                        />
                        <div className="container legend d-flex justify-content-center align-items-center mt-4" style={{ border: '2px solid #ddd', padding: '15px', borderRadius: '10px', backgroundColor: '#f8f9fa', width: '600px' }}>
                            <div className="d-flex align-items-center mx-3">
                                <span className="legend-color bg-success rounded-circle d-inline-block" style={{ width: '20px', height: '20px', marginRight: '5px' }}></span>
                                Confirmado
                            </div>
                            <div className="d-flex align-items-center mx-3">
                                <span className="legend-color bg-warning rounded-circle d-inline-block" style={{ width: '20px', height: '20px', marginRight: '5px' }}></span>
                                Pendiente
                            </div>
                            <div className="d-flex align-items-center mx-3">
                                <span className="legend-color bg-secondary rounded-circle d-inline-block" style={{ width: '20px', height: '20px', marginRight: '5px' }}></span>
                                Finalizado
                            </div>
                            <div className="d-flex align-items-center mx-3">
                                <span className="legend-color bg-danger rounded-circle d-inline-block" style={{ width: '20px', height: '20px', marginRight: '5px' }}></span>
                                Cancelado
                            </div>
                        </div>
                        <p>Rango de consulta: {getWeekRange(week)}</p>
                    </div>
                    {showAgregarDisponibilidad && (
                        <AgregarDisponibilidad
                            show={showAgregarDisponibilidad}
                            onClose={handleDisponibilidadClose}
                            initialDate={newEventDate}
                            initialHour={newEventHour}
                            fixedHour={fixedHour}
                        />
                    )}
                    {showEditarDisponibilidad && selectedAvailability && (
                        <EditarDisponibilidad
                            show={showEditarDisponibilidad}
                            fecha={selectedAvailability.fecha}
                            horario={selectedAvailability.horario}
                            capacidad={selectedAvailability.capacidad}
                            onClose={() => setShowEditarDisponibilidad(false)}
                            onSave={handleUpdateAvailability}
                        />
                    )}
                    <table>
                        <thead>
                            <tr>
                                <th style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB', color: 'black', textTransform: 'uppercase' }}>Horario</th>
                                {weekDates.map((date, index) => (
                                    <th style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB' }} key={index}>{daysOfWeek[date.getUTCDay()]} {date.getUTCDate()}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((hour, hourIndex) => (
                                <tr key={hourIndex} style={{ border: '3px solid #6D7178' }}>
                                    <td style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB' }}>{hour}</td>
                                    {weekDates.map((date, dateIndex) => {
                                        const eventsAtThisTime = findEvents(date, hour);
                                        const availability = getAvailability(date, hour);
                                        const availabilityText = `${availability.EspaciosDisponibles} espacios disponibles`;
                                        return (
                                            <td style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', position: 'relative' }} key={`${date.toISOString()}-${hour}`}
                                                onClick={(e) => { e.stopPropagation(); handleCellClick(date, hour); }}
                                            >
                                                {eventsAtThisTime.map(event => (
                                                    <div key={event.id} className={`event ${event.status.toLowerCase()}`} onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}>
                                                        {event.id} -  {event.name}
                                                    </div>
                                                ))}
                                                <div className="capacity-info" onClick={(e) => { e.stopPropagation(); handleAvailabilityClick(date, hour); }}>
                                                    {availabilityText}
                                                </div>
                                                <div className="add-event" onClick={(e) => { e.stopPropagation(); handleCellClick(date, hour); }} style={{ cursor: 'pointer', position: 'absolute', bottom: '5px', right: '5px', zIndex: 10, backgroundColor: '#f8f9fa', padding: '2px 5px', borderRadius: '3px', border: '1px solid #ddd' }}>
                                                    Agregar
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showModalEvento && selectedEvent && (
                        <ModalEvento
                            show={showModalEvento}
                            handleClose={handleCloseModalEvento}
                            event={selectedEvent}
                            updateEvent={handleUpdateEvent} // Pasa handleUpdateEvent aquí
                            saveEvento={saveEvento}
                            services={services} // Pasa services aquí si lo necesitas
                            editarEvento={editarEvento}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CalendarioManageView;
