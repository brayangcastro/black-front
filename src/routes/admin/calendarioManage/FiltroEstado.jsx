import React, { useState } from 'react';
import './FiltroEstado.css'; // Estilos actualizados

const FiltroEstado = ({ estadosSeleccionados, setEstadosSeleccionados }) => {
  const estadosDisponibles = ['DISPONIBLE', 'PROCESANDO', 'CONFIRMADO'];

  const handleCheckboxChange = (estado) => {
    if (estadosSeleccionados.includes(estado)) {
      setEstadosSeleccionados(estadosSeleccionados.filter((item) => item !== estado));
    } else {
      setEstadosSeleccionados([...estadosSeleccionados, estado]);
    }
  };

  return (
    <div className="filtro-estado-container">
      <h4>Filtrar por Estado</h4>
      <div className="checkbox-group">
        {estadosDisponibles.map((estado) => (
          <div key={estado} className="checkbox-estado">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                value={estado}
                checked={estadosSeleccionados.includes(estado)}
                onChange={() => handleCheckboxChange(estado)}
              />
              <span className="checkmark"></span>
              {estado}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiltroEstado;
