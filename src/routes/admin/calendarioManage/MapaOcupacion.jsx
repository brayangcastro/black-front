import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MapaOcupacion.css';
import { FaCalendarAlt, FaClock } from 'react-icons/fa'; // Importa los iconos
import mapa from './mapa.png';
import Modal from './ModalProducto'; // Importa el modal
import axios from 'axios';
import apiUrls from '../../../api';

const MapaOcupacion = ({ spaces }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [availableHours, setAvailableHours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [occupancyData, setOccupancyData] = useState([]);

  // Refs para la imagen del mapa y contenedor
  const mapaRef = useRef(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const obtenerHorarios = async () => {
      try {
        const response = await axios.post(apiUrls.obtenerHorarios);
        const horariosExtraidos = response.data.map((horario) => horario.horario);
        setAvailableHours(horariosExtraidos);
      } catch (error) {
        console.error('Error al obtener horarios del backend:', error);
      }
    };
    obtenerHorarios();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedTime) {
        setOccupancyData([]); // Limpia el estado si no hay hora seleccionada
        return;
      }

      try {
        const fecha = formatDateToYYYYMMDD(selectedDate);
        const horario = selectedTime;

        const response = await axios.post(apiUrls.obtenerDisponibilidadPorFechaYHora, {
          fecha,
          horario,
        });

        const espaciosOcupados = response.data
          .filter((slot) => slot.disponible == 1)
          .map((slot) => slot.espacioId);

        setOccupancyData(espaciosOcupados);
      } catch (error) {
        console.error('Error al obtener la disponibilidad:', error);
        setOccupancyData([]);  // Limpia en caso de error
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedTime]);

  const handleSpaceClick = (space) => {
    if (!selectedTime) {
      alert('Por favor, seleccione una hora antes de elegir un espacio.');
      return;
    }

    const isOccupied = occupancyData.includes(space.id.toString());
    if (!isOccupied) {
      alert('Este espacio está ocupado en la fecha y hora seleccionadas.');
      return;
    }

    setSelectedSpace(space);
    setAvailability(true);
    setShowModal(true);
  };

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleProcessBooking = async () => {
    const bookingDetails = {
      date: formatDateToYYYYMMDD(selectedDate),
      spaceId: selectedSpace.id,
      spaceName: selectedSpace.name,
      times: [selectedTime],
      totalCost: parseFloat(selectedSpace.costo || 0),
      spaceCost: selectedSpace.costo,
    };

    try {
      const response = await axios.post(apiUrls.procesarReserva, {
        bookingDetails: bookingDetails,
      });
      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
    }
  };

  useEffect(() => {
    const actualizarScaleFactor = () => {
      if (mapaRef.current) {
        const originalWidth = 1360;
        const currentWidth = mapaRef.current.clientWidth;

        const factor = currentWidth / originalWidth;
        setScaleFactor(factor);
      }
    };

    window.addEventListener('resize', actualizarScaleFactor);
    actualizarScaleFactor();

    return () => window.removeEventListener('resize', actualizarScaleFactor);
  }, []);

  return (
    <div className="mapa-ocupacion-container">
      {/* Selectores de Fecha y Hora */}
      <div className="date-time-selectors modern">
        <div className="date-picker-container">
          <FaCalendarAlt className="icon" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
          />
        </div>
        <div className="time-picker-container">
          <FaClock className="icon" />
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="time-select modern-select"
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

      {/* Mapa y Espacios */}
      <div className="map-container">
        <img
          src={mapa}
          alt="Mapa del lugar"
          className="mapa-imagen"
          ref={mapaRef}
        />
        {spaces.map((space) => {
          const isOccupied = occupancyData.includes(space.id.toString());

          return (
            <div
              key={space.id}
              className={`espacio ${isOccupied ? 'disponible' : 'ocupado'}`}
              style={{
                top: `${(space.ubicacion.y + 0) * scaleFactor}px`,
                left: `${(space.ubicacion.x + 0) * scaleFactor}px`,
                width: `${space.dimensiones.width * scaleFactor}px`,
                height: `${space.dimensiones.height * scaleFactor}px`,
              }}
              onClick={() => handleSpaceClick(space)}
              title={space.name}
            />
          );
        })}
      </div>

      {/* Modal para mostrar detalles y disponibilidad */}
      {showModal && selectedSpace && (
        <Modal
          showModal={showModal}
          onClose={() => {
            setShowModal(false);
            setAvailability(null);
          }}
          space={selectedSpace}
          availability={availability}
          handleProcessBooking={handleProcessBooking}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      )}
    </div>
  );
};

export default MapaOcupacion;
