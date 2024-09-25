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
    const [loading, setLoading] = useState(true);
    const [showAgregarDisponibilidad, setShowAgregarDisponibilidad] = useState(false);
    const [showEditarDisponibilidad, setShowEditarDisponibilidad] = useState(false);
    const [selectedAvailability, setSelectedAvailability] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModalEvento, setShowModalEvento] = useState(false);
    const [showModalAgregarEvento, setShowModalAgregarEvento] = useState(false);

    const [newEventDate, setNewEventDate] = useState(null);
    const [newEventHour, setNewEventHour] = useState('');
    const [fixedHour, setFixedHour] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [selectedViewDate, setSelectedViewDate] = useState(new Date());

    const spaces = Array.from({ length: 11 }, (_, i) => i + 1); // Espacios del 1 al 11

    useEffect(() => {
        const startOfWeek = new Date(selectedViewDate);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 1);
        updateDateRange(startOfWeek, endOfWeek);
        loadEventsAndAvailability(startOfWeek, endOfWeek)
            .then(() => setLoading(false));
    }, [selectedViewDate]);

    const findEventsBySpaceAndHour = (space, hour) => {
        return events.filter(event =>
            event.espacio == space && event.hour === hour && event.fecha === formatDateToYYYYMMDD(selectedViewDate)
        );
    };

    const getAvailabilityBySpaceAndHour = (space, hour) => {
        return disponibilidad.find(d => {
            const availabilityDate = d.Fecha;
            const selectedDate = formatDateToYYYYMMDD(selectedViewDate);

            return d.Espacio == space &&
                   d.Horario === hour &&
                   availabilityDate === selectedDate;
        }) || { EspaciosDisponibles: 0 };
    };

    const handleCellClick = (space, hour, date) => {
        const availability = getAvailabilityBySpaceAndHour(space, hour);
        const isSpaceAvailable = availability.EspaciosDisponibles > 0;

        setSelectedAvailability({
            fecha: formatDateToYYYYMMDD(date),
            horario: hour,
            capacidad: availability.Capacidad,
            espacio: space
        });

        setNewEventDate(formatDateToYYYYMMDD(date));
        setNewEventHour(hour);
        setFixedHour(true);
        setIsUnavailable(!isSpaceAvailable);

        setShowModalAgregarEvento(true);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setShowModalEvento(true);
    };

    const handleShowModalAgregarEvento = () => {
        setNewEventDate('');
        setNewEventHour('');
        setFixedHour(false);
        setShowModalAgregarEvento(true);
    };

    const handleCloseModalAgregarEvento = () => setShowModalAgregarEvento(false);

    const handleCloseModalEvento = () => setShowModalEvento(false);

    const handleUpdateEvent = async (updatedEvent) => {
        try {
            await editarEvento(updatedEvent);
            const updatedEvents = events.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            );
            setEvents(updatedEvents);
            setSelectedEvent(null);
            loadEventsAndAvailability(startDate, endDate);
        } catch (error) {
            console.error('Error al actualizar el evento en el backend:', error);
        }
    };

    const handleEditAvailability = (availability, space, hour, date) => {
        const formattedDate = formatDateToYYYYMMDD(date);

        setSelectedAvailability({
            fecha: formattedDate,
            horario: hour,
            capacidad: availability.Capacidad,
            espacio: space
        });

        setShowEditarDisponibilidad(true);
    };

    const handlePreviousWeek = () => {
        const newViewDate = new Date(selectedViewDate);
        newViewDate.setDate(newViewDate.getDate() - 7);
        setSelectedViewDate(newViewDate);
    };

    const handleNextWeek = () => {
        const newViewDate = new Date(selectedViewDate);
        newViewDate.setDate(newViewDate.getDate() + 7);
        setSelectedViewDate(newViewDate);
    };

    const handleDateChange = (e) => {
        const newDate = new Date(e.target.value + 'T00:00:00');
        setSelectedViewDate(newDate);
    };

    const formatDateToYYYYMMDD = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato de dos dígitos
        const day = String(date.getDate()).padStart(2, '0'); // Día en formato de dos dígitos
        return `${year}-${month}-${day}`;
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
                            Rango de Fechas: {formatDateToYYYYMMDD(startDate)} - {formatDateToYYYYMMDD(endDate)}
                        </div>
                        <div className="col text-center">
                            <label>Seleccionar Fecha</label>
                            <input
                                type="date"
                                value={formatDateToYYYYMMDD(selectedViewDate)}
                                onChange={handleDateChange}
                                style={{ padding: '5px', marginLeft: '10px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <button className="modern-button gold-button" onClick={handlePreviousWeek}>Semana Anterior</button>
                        <button className="modern-button gold-button" onClick={handleNextWeek}>Semana Siguiente</button>
                    </div>
                    <div>
                        <button className="modern-button blue-button" onClick={handleShowModalAgregarEvento}>Agregar Nuevo Evento</button>
                        <button className="modern-button blue-button" onClick={() => setShowAgregarDisponibilidad(true)}>Agregar Disponibilidad</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB' }}>Horario</th>
                                {spaces.map((space) => (
                                    <th key={space} style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB' }}>
                                        Espacio {space}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((hour, hourIndex) => (
                                <tr key={hourIndex} style={{ border: '3px solid #6D7178' }}>
                                    <td style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#D8DBDB' }}>{hour}</td>
                                    {spaces.map((space) => {
                                        const eventsAtThisTime = findEventsBySpaceAndHour(space, hour);
                                        const availability = getAvailabilityBySpaceAndHour(space, hour);
                                        const availabilityText = `${availability.EspaciosDisponibles} espacios disponibles`;
                                        return (
                                            <td
                                                key={`${space}-${hour}`}
                                                style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', position: 'relative' }}
                                                onClick={() => handleCellClick(space, hour, selectedViewDate)}
                                            >
                                                {eventsAtThisTime.map(event => (
                                                    <div key={event.id} className={`event ${event.status.toLowerCase()}`} onClick={(e) => { e.stopPropagation(); handleEventClick(event); }}>
                                                        {event.id} - {event.name}
                                                    </div>
                                                ))}
                                                <div className="capacity-info">
                                                    {availabilityText}
                                                </div>
                                                <div className="edit-availability" onClick={(e) => { e.stopPropagation(); handleEditAvailability(availability, space, hour, selectedViewDate); }} style={{ cursor: 'pointer', position: 'absolute', bottom: '5px', right: '5px', backgroundColor: '#f8f9fa', padding: '2px 5px', borderRadius: '3px' }}>
                                                    Editar
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showAgregarDisponibilidad && (
                        <AgregarDisponibilidad
                            show={showAgregarDisponibilidad}
                            onClose={() => setShowAgregarDisponibilidad(false)}
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
                            espacio={selectedAvailability.espacio}
                            onClose={() => setShowEditarDisponibilidad(false)}
                            onSave={handleUpdateAvailability}
                        />
                    )}

                    {showModalAgregarEvento && (
                        <ModalAgregarEvento
                            show={showModalAgregarEvento}
                            handleClose={handleCloseModalAgregarEvento}
                            saveEvento={saveEvento}
                            hours={hours}
                            initialDate={newEventDate}
                            initialHour={newEventHour}
                            fixedHour={fixedHour}
                            isUnavailable={isUnavailable}
                            setIsUnavailable={setIsUnavailable}
                        />
                    )}

                    {showModalEvento && selectedEvent && (
                        <ModalEvento
                            show={showModalEvento}
                            handleClose={handleCloseModalEvento}
                            event={selectedEvent}
                            updateEvent={handleUpdateEvent}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CalendarioManageView;
