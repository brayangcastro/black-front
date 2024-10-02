import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import './MapaOcupacion.css';

const MapaOcupacion = ({ spaces }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableHours, setAvailableHours] = useState([]);
  
  // Otros estados y lógica omitidos por brevedad...

  return (
    <div className="mapa-ocupacion-container">
      {/* Contenedor para fecha y hora en una sola fila */}
      <div className="date-time-selectors-modern">
        <div className="selector-item">
          <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker-modern"
          />
        </div>
        <div className="selector-item">
          <FontAwesomeIcon icon={faClock} className="icon" />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="time-select-modern"
          >
            {availableHours.length === 0 ? (
              <option value="">No hay horarios disponibles</option>
            ) : (
              <>
                <option value="">Seleccione una hora</option>
                {availableHours.map((hour, index) => (
                  <option key={index} value={hour}>
                    {hour}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Mapa y otros componentes */}
      <div className="map-container">
        {/* Imagen del mapa y lógica omitida... */}
      </div>
    </div>
  );
};

export default MapaOcupacion;
