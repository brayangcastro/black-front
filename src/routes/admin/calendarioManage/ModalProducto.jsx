import React from 'react';
import './ModalProducto.css'; // Importa los estilos que diseñaremos para el modal

const ModalProducto = ({ showModal, onClose, space }) => {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <img
            src={space.image || 'https://via.placeholder.com/300'}
            alt={space.name}
            className="space-image"
          />
          <h2>{space.name}</h2>
          <p>{space.description || 'Descripción no disponible'}</p>

          {/* Mostrar las opciones solo si el ID del espacio es igual a 1 */}
          {space.id === 1 && (
            <>
              <div className="option-group">
                <label htmlFor="comida">Comida:</label>
                <select id="comida" className="option-select">
                  <option value="esencial">Esencial</option>
                  <option value="completo">Completo</option>
                  <option value="gourmet">Gourmet</option>
                </select>
              </div>

              <div className="option-group">
                <label htmlFor="tiempo">Acomodo:</label>
                <select id="tiempo" className="option-select">
                  <option value="1hora">Herradura</option>
                  <option value="2horas">Escuela</option>
                  <option value="medioDia">Auditorio</option>
                </select>
              </div>

              <button className="reserve-button" onClick={() => alert('Reservar ahora')}>
                Reservar ahora
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalProducto;
