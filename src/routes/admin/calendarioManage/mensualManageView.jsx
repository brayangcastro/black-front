import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarCheck, faCalendarAlt, faCalendarTimes, faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const MensualManageView = ({ currentMonth, setCurrentMonth, events, disponibilidad, updateDateRange, startDate, endDate }) => {
    const [monthDates, setMonthDates] = useState([]);
    console.log("AQUIIII", events)

    const [tooltipData, setTooltipData] = useState({ date: null, events: [] });

    useEffect(() => {
        console.log("Current month updated:", currentMonth);
        setMonthDates(getMonthDates(currentMonth));
        updateMonthDateRange(currentMonth);
    }, [currentMonth]);

    const updateMonthDateRange = (date) => {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        updateDateRange(startOfMonth, endOfMonth);
    };

    const getMonthNameAndYear = (date) => {
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    const getAvailability = (day) => {
        const formattedDay = day.toISOString().split('T')[0];
        const availabilities = disponibilidad.filter(d => {
            const availabilityDateStr = new Date(d.Fecha).toISOString().split('T')[0];
            return availabilityDateStr === formattedDay;
        });
        console.log(`Availabilities on ${formattedDay}:`, availabilities);
        return availabilities;
    };

    const getTotalAvailabilityOfDay = (date) => {
        const availabilities = getAvailability(date);
        const totalAvailability = availabilities.reduce((total, av) => {
            return total + (parseInt(av.EspaciosDisponibles, 10) || 0);
        }, 0);
        console.log(`Total availability on ${date.toISOString().split('T')[0]}:`, totalAvailability);
        return totalAvailability;
    };

    const getMonthDates = (date) => {
        let start = new Date(date.getFullYear(), date.getMonth(), 1);
        let end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        while (start.getDay() !== 0) {
            start.setDate(start.getDate() - 1);
        }

        while (end.getDay() !== 6) {
            end.setDate(end.getDate() + 1);
        }

        let dates = [];
        while (start <= end) {
            dates.push(new Date(start));
            start.setDate(start.getDate() + 1);
        }

        console.log("Month dates:", dates);
        return chunk(dates, 7);
    };

    const chunk = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        console.log("Chunked array:", chunkedArr);
        return chunkedArr;
    };

    const handlePreviousMonth = () => {
        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        setCurrentMonth(prevMonth);
        const start = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
        const end = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
        updateDateRange(start, end);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        setCurrentMonth(nextMonth);
        const start = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        const end = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);
        updateDateRange(start, end);
    };

    const handleMouseEnter = (date) => {
        const dayEvents = events.filter(event => new Date(event.fecha).toISOString().split('T')[0] === date.toISOString().split('T')[0]);
        setTooltipData({ date, events: dayEvents });
    };

    const handleMouseLeave = () => {
        setTooltipData({ date: null, events: [] });
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col text-center" style={{ color: '#29488F', fontSize: '24px', fontWeight: 'bold' }}>
                    Rango de Fechas: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                </div>
            </div>
            <div className="month-navigation d-flex justify-content-center align-items-center mb-4">
                <Button style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }} onClick={handlePreviousMonth}>Mes Anterior</Button>
                <span className="month-name mx-3">{getMonthNameAndYear(currentMonth)}</span>
                <Button style={{ backgroundColor: '#ffc107', borderColor: '#ffc107', color: '#000' }} onClick={handleNextMonth}>Mes Siguiente</Button>
            </div>
            <div className="icon-legend-container d-flex flex-column justify-content-center mb-4" style={{ border: '3px solid #fff', padding: '20px', borderRadius: '5px', backgroundColor: '#f8f9fa', width: '50%' }}>
                <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCalendarDay} style={{ color: 'gray', marginRight: '10px' }} />
                    Día del Mes
                </div>
                <div className="d-flex align-items-center mb-2">
                    <FontAwesomeIcon icon={faCalendarCheck} style={{ color: 'gray', marginRight: '10px' }} />
                    Total de eventos (verde: hay eventos, rojo: no hay eventos)
                </div>
                <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faClock} style={{ color: 'gray', marginRight: '10px' }} />
                    Total de disponibilidad (verde: hay disponibilidad, rojo: no hay disponibilidad)
                </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        {['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'].map(day => (
                            <th key={day} style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center', backgroundColor: '#254375', color: 'white', textTransform: 'uppercase' }}>
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {monthDates.map((week, i) => (
                        <tr key={i}>
                            {week.map((date, index) => {
                                const dayEvents = events.filter(event => new Date(event.fecha).toISOString().split('T')[0] === date.toISOString().split('T')[0]);
                                const totalEvents = events.filter(event => new Date(event.fecha).toISOString().split('T')[0] === date.toISOString().split('T')[0]).length;
                                const totalAvailability = getTotalAvailabilityOfDay(date);
                                const eventIconColor = totalEvents > 0 ? 'green' : 'red';
                                const availabilityIconColor = totalAvailability > 0 ? 'green' : 'red';

                                return (
                                    <Tippy key={index} content={
                                        <div>
                                            <p>{`Fecha: ${date.toLocaleDateString()}`}</p>
                                            <p>{`Disponibilidad: ${totalAvailability}`}</p>
                                            <p>{`Eventos:`}</p>
                                            {dayEvents.length > 0 ? (
                                                <ul>
                                                    {dayEvents.map((event, idx) => (
                                                        <li key={idx}>{`ID: ${event.id}, Servicio: ${event.service}`}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No hay eventos</p>
                                            )}
                                        </div>
                                    }>
                                        <td
                                            onMouseEnter={() => handleMouseEnter(date)}
                                            onMouseLeave={handleMouseLeave}
                                            style={{ border: '3px solid #6D7178', padding: '12px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div style={{ fontSize: '1.25rem' }}>
                                                    <FontAwesomeIcon icon={faCalendarDay} style={{ marginRight: '6px' }} />
                                                    <span>{date.getDate()}</span>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.25rem', marginTop: '10px' }}>
                                                    <FontAwesomeIcon icon={faCalendarCheck} style={{ color: eventIconColor, marginRight: '6px' }} />
                                                    <span>{totalEvents}</span>
                                                    <FontAwesomeIcon icon={faClock} style={{ color: availabilityIconColor, marginLeft: '20px', marginRight: '6px' }} />
                                                    <span>{totalAvailability}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </Tippy>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MensualManageView;
