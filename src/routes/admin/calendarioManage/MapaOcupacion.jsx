import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './MapaOcupacion.css';
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

  // Obtener horarios al montar el componente
  useEffect(() => {
    const obtenerHorarios = async () => {
      try {
        const response = await axios.post(apiUrls.obtenerHorarios);
        const horariosExtraidos = response.data.map((horario) => horario.horario);
        setAvailableHours(horariosExtraidos);
        console.log('Horarios obtenidos', horariosExtraidos);
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

            console.log("Ejecutando fetchAvailability con fecha:", fecha, "y horario:", horario);

            const response = await axios.post(apiUrls.obtenerDisponibilidadPorFechaYHora, {
                fecha,
                horario,
            });

            console.log('Datos crudos obtenidos del backend:', response.data);

            // Filtrar los espacios donde `disponible` sea `0` (ocupados)
            const espaciosOcupados = response.data
                .filter((slot) => slot.disponible == 1)
                .map((slot) => slot.espacioId);

            setOccupancyData(espaciosOcupados);
            console.log('occupancyData actualizado:', espaciosOcupados);
        } catch (error) {
            console.error('Error al obtener la disponibilidad:', error);
            setOccupancyData([]);  // Limpia en caso de error
        }
    };

    fetchAvailability();
}, [selectedDate, selectedTime]); // Asegúrate de que ambas dependencias están aquí




  const handleSpaceClick = (space) => {
    if (!selectedTime) {
      alert('Por favor, seleccione una hora antes de elegir un espacio.');
      return;
    }

    // Verificar si el espacio está ocupado
    const isOccupied = occupancyData.includes(space.id.toString()); // Convertir space.id a string si es necesario
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Asegúrate de que el mes tiene 2 dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Asegúrate de que el día tiene 2 dígitos
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
    console.log('bookingDetails', bookingDetails);

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
  const scaleFactor = 0.75; // Escalar la imagen al 50% del tamaño original


  return (
    <div className="mapa-ocupacion-container">
      {/* Selectores de Fecha y Hora */}
      <div className="date-time-selectors">
      <div>
        <label>Seleccione Fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Seleccione Hora:</label>
        <select
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="time-select"
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
  style={{
    transform: `scale(${scaleFactor})`, // Aplica el factor de escala
    transformOrigin: 'top left' // Asegura que la escala se aplique desde la esquina superior izquierda
  }}
/>

{spaces.map((space) => {
  const isOccupied = occupancyData.includes(space.id.toString());

  return (
    <div
      key={space.id}
      className={`espacio ${isOccupied ? 'disponible' : 'ocupado'}`}  
      style={{
        top: `${space.ubicacion.y * scaleFactor+10}px`,  // Aplica el factor de escala a la posición Y
        left: `${space.ubicacion.x * scaleFactor+10}px`, // Aplica el factor de escala a la posición X
        width: `${space.dimensiones.width * scaleFactor}px`, // Aplica el factor de escala a la anchura
        height: `${space.dimensiones.height * scaleFactor}px`, // Aplica el factor de escala a la altura
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
