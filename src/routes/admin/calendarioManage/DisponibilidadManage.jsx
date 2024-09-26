import React, { useState, useEffect } from 'react';
import DisponibilidadCalendario from './DisponibilidadCalendario';
import axios from 'axios';
import apiUrls from '../../../api';
import MapaOcupacion from './MapaOcupacion'; // Importa el nuevo componente

const DisponibilidadManage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]); // Horarios seleccionados
  const [totalCost, setTotalCost] = useState(0); // Total acumulado
  const [occupancyData, setOccupancyData] = useState([]);

  const handleSpaceClick = (space) => {
    if (occupancyData.includes(space.id.toString())) {
      alert('Este espacio está ocupado en la fecha seleccionada.');
    } else {
      setSelectedSpace(spaces.findIndex((s) => s.id === space.id));
    }
  };

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.post(apiUrls.obtenerEspacios);
        setSpaces(response.data);
        console.log('setSpaces', response.data);

        if (response.data.length > 0) {
          setSelectedSpace(0);
        }
      } catch (error) {
        console.error('Error al obtener los espacios:', error);
      }
    };

    fetchSpaces();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        if (spaces.length > 0 && selectedSpace !== null) {
          const response = await axios.post(apiUrls.obtenerDisponibilidadPorFechaYEspacio, {
            fecha: formatDateToYYYYMMDD(selectedDate),
            espacioId: spaces[selectedSpace]?.id.toString(),
          });
          console.log("obtenerDisponibilidadPorFechaYEspacio",response.data)
          setAvailability(response.data);

          // Actualiza occupancyData con los espacios ocupados
          const espaciosOcupados = response.data
            .filter((slot) => slot.espaciosDisponibles === 0)
            .map((slot) => slot.espacioId);
          setOccupancyData(espaciosOcupados);
        }
      } catch (error) {
        console.error('Error al obtener la disponibilidad:', error);
      }
    };

    fetchAvailability();
  }, [selectedDate, selectedSpace, spaces]);

  const handleTimeSelection = (time) => {
    setSelectedTimes((prevTimes) =>
      prevTimes.includes(time) ? prevTimes.filter((t) => t !== time) : [...prevTimes, time]
    );
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
      spaceId: spaces[selectedSpace]?.id,
      spaceName: spaces[selectedSpace]?.name,
      times: selectedTimes,
      totalCost: totalCost,
      spaceCost: spaces[selectedSpace]?.costo,
    };
    console.log('bookingDetails', bookingDetails);

    try {
      const response = await axios.post(apiUrls.procesarReserva, { bookingDetails });
      const { checkoutUrl } = response.data;

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error al procesar la reserva:', error);
    }
  };

  return (
    <div>
      <MapaOcupacion
        spaces={spaces}
        occupancyData={occupancyData}
        onSpaceClick={handleSpaceClick}
      />
      <DisponibilidadCalendario
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedSpace={selectedSpace}
        setSelectedSpace={setSelectedSpace}
        spaces={spaces}
        availability={availability}
        selectedTimes={selectedTimes}
        handleTimeSelection={handleTimeSelection}
        totalCost={totalCost}
        handleProcessBooking={handleProcessBooking}
      />
    </div>
  );
};

export default DisponibilidadManage;
