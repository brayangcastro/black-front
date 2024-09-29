import React from 'react';
import './BoletoGrid.css';
import { FaTicketAlt } from 'react-icons/fa';

const BoletoGrid = ({ boletos, onSelect }) => {
  return (
    <div className="boleto-grid">
      {boletos.map((boleto, index) => (
        <div 
          key={index} 
          className={`boleto ${boleto.selected ? 'selected' : ''} ${boleto.Estado.toLowerCase()}`} 
          onClick={() => boleto.Estado === 'DISPONIBLE' && onSelect(boleto.ID)}  // Solo permite seleccionar si está disponible
        >
          <FaTicketAlt className="icon" />
          <span className="boleto-numero">Boleto #{boleto.Numero}</span> {/* Mostramos el número del boleto */}
          
          {boleto.Estado !== 'DISPONIBLE' && ( // Si el boleto no está disponible, mostramos una marca de ocupación
            <div className="overlay">
              <span className="overlay-cross">✕</span>
              <span className="estado-boleto">{boleto.Estado}</span> {/* Mostramos el estado del boleto */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BoletoGrid;
