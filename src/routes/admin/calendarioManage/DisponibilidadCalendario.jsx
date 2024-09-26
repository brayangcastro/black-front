import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DisponibilidadCalendario.css';
import { TailSpin } from 'react-loader-spinner';
import MapaOcupacion from './MapaOcupacion';

const DisponibilidadCalendario = ({
  selectedDate,
  setSelectedDate,
  selectedSpace,
  setSelectedSpace,
  spaces,
  availability,
  selectedTimes,
  handleTimeSelection,
  totalCost,
  loading,
  handleProcessBooking
}) => {
  const [timeFormat, setTimeFormat] = useState('24');

  const handlePrevSpace = () => {
    setSelectedSpace((prev) => {
      if (!spaces.length || prev === null) return prev;
      return prev === 0 ? spaces.length - 1 : prev - 1;
    });
  };

  const handleNextSpace = () => {
    setSelectedSpace((prev) => {
      if (!spaces.length || prev === null) return prev;
      return prev === spaces.length - 1 ? 0 : prev + 1;
    });
  };

  const toggleTimeFormat = () => {
    setTimeFormat((prev) => (prev === '24' ? 'am/pm' : '24'));
  };

  const formatHour = (horario) => {
    const [start, end] = horario.split(' - ');
    return `${convertTimeFormat(start)} - ${convertTimeFormat(end)}`;
  };

  const convertTimeFormat = (time) => {
    if (timeFormat === 'am/pm') {
      let [hour, minute] = time.split(':');
      hour = parseInt(hour, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    } else {
      return time;
    }
  };

  const isSelected = (time) => selectedTimes.includes(time);

  // Convierte la hora a un número comparable (minutos desde las 00:00)
  const convertToComparableTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Ordena la disponibilidad de menor a mayor hora
  const sortedAvailability = [...availability].sort((a, b) => {
    const startA = a.horario.split(' - ')[0]; // Hora de inicio del bloque A
    const startB = b.horario.split(' - ')[0]; // Hora de inicio del bloque B

    return convertToComparableTime(startA) - convertToComparableTime(startB);
  });

  return (
    <div className="disponibilidad-container">
      {/* Panel Izquierdo: Calendario y Espacio */}
      <div className="calendar-panel">
        <div className="space-selector">
          <FaChevronLeft className="arrow" onClick={handlePrevSpace} />
          <div className="space-info">
            <img
              src="https://via.placeholder.com/50"
              alt="Espacio"
              className="space-image"
            />
            <h2>{spaces[selectedSpace]?.name || 'Cargando espacios...'}</h2>
            <h3>Costo: ${spaces[selectedSpace]?.costo || '0'}</h3>
          </div>
          <FaChevronRight className="arrow" onClick={handleNextSpace} />
        </div>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          locale="es-ES"
          className="react-calendar"
        />
        <h4>
          {selectedDate.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </h4>
      </div>

      {/* Panel Derecho: Disponibilidad de Horas */}
      <div className="availability-panel">
        <div className="availability-header">
          <h4>¿Qué hora te viene mejor?</h4>
          <div className="time-format-switch">
            <label htmlFor="timeFormatSwitch">am/pm</label>
            <input
              type="checkbox"
              id="timeFormatSwitch"
              onChange={toggleTimeFormat}
              checked={timeFormat === 'am/pm'}
            />
          </div>
        </div>
        <p>America/Mazatlan</p>

        <div className="availability-list">
          {loading ? (
            <div className="loading-spinner">
              <TailSpin color="#00BFFF" height={50} width={50} />
            </div>
          ) : sortedAvailability.length > 0 ? (
            sortedAvailability.map((hora, index) => (
              <button
                key={index}
                className={`availability-button ${
                  isSelected(hora.horario) ? 'selected' : ''
                }`}
                disabled={hora.espaciosDisponibles === 0}
                onClick={() => handleTimeSelection(hora.horario)}
              >
                {formatHour(hora.horario)}
              </button>
            ))
          ) : (
            <p>No hay disponibilidad para esta fecha y espacio.</p>
          )}
        </div>

        <div className="total-cost">
          <h4>Total: ${totalCost.toFixed(2)}</h4>
          <button
            className="process-booking-button"
            disabled={selectedTimes.length === 0}
            onClick={handleProcessBooking}
          >
            Procesar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisponibilidadCalendario;
