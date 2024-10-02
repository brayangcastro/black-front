import React, { useState, useEffect } from 'react';
import './ModalProducto.css'; // Importa los estilos que diseñaremos para el modal

const ModalProducto = ({ showModal, onClose, space }) => {
  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [horas, setHoras] = useState(1);
  const [tipoComida, setTipoComida] = useState("esencial");
  const [total, setTotal] = useState(100);

  // Definir los precios por tipo de comida
  const preciosComida = {
    esencial: 100,   // Precio por persona por hora
    completo: 200,   // Precio por persona por hora
    gourmet: 300     // Precio por persona por hora
  };

  // Función para calcular el total
  const calcularTotal = () => {
    const precioComida = preciosComida[tipoComida];
    const nuevoTotal = precioComida * horas * cantidadPersonas;
    setTotal(nuevoTotal);
  };

  const handleCantidadPersonasChange = (e) => {
    setCantidadPersonas(e.target.value);
    calcularTotal();
  };

  const handleHorasChange = (e) => {
    setHoras(e.target.value);
    calcularTotal();
  };

  const handleTipoComidaChange = (e) => {
    setTipoComida(e.target.value);
    calcularTotal();
  };

  // Escuchar la tecla 'Esc' para cerrar el modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-button" onClick={onClose} aria-label="Cerrar modal">
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

          {/* Mostrar las opciones solo si el ID del espacio es igual a 11 */}
          {space.id === 11 && (
            <>
              <div className="option-group">
                <label htmlFor="comida">Comida:</label>
                <select
                  id="comida"
                  className="option-select"
                  value={tipoComida}
                  onChange={handleTipoComidaChange}
                >
                  <option value="esencial">Esencial</option>
                  <option value="completo">Completo</option>
                  <option value="gourmet">Gourmet</option>
                </select>
              </div>

              {/* Fila con cantidad de personas y horas */}
              <div className="option-row">
                <div className="option-group option-input-row">
                  <label htmlFor="cantidadPersonas">Cantidad de personas:</label>
                  <input
                    type="number"
                    id="cantidadPersonas"
                    className="option-input"
                    value={cantidadPersonas}
                    onChange={handleCantidadPersonasChange}
                    min="1"
                  />
                </div>

                <div className="option-group option-input-row">
                  <label htmlFor="horas">Horas:</label>
                  <input
                    type="number"
                    id="horas"
                    className="option-input"
                    value={horas}
                    onChange={handleHorasChange}
                    min="1"
                  />
                </div>
              </div>

              {/* Mostrar el total calculado */}
              <div className="total">
                <h3>Total: ${total}</h3>
              </div>

              {/* Botón de reservar */}
              <button
                className="reserve-button"
                onClick={() => alert(`Reservar para ${cantidadPersonas} personas por ${horas} horas. Total: $${total}`)}
              >
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
