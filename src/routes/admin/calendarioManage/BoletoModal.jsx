import React, { useState } from 'react';
import './BoletoModal.css';
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa'; // Importamos los iconos

const BoletoModal = ({ boletosSeleccionados, total, onClose, onPurchase }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    correo: ''
  });

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Procesa la compra cuando se envía el formulario
  const handleSubmit = () => {
    console.log('Procesando orden...', formData);
    onPurchase(); // Llama la función para procesar la compra
    onClose(); // Cierra el modal después de procesar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Resumen de tu compra</h2>
        
        {/* Mostrar boletos seleccionados */}
        <div className="seleccion-grid">
          <h3>Boletos Seleccionados:</h3>
          {boletosSeleccionados.map((boleto, index) => (
            <div key={index}>
              <span>Boleto #{boleto.Numero}</span> {/* Muestra el número del boleto */}
            </div>
          ))}
        </div>

        {/* Mostrar total */}
        <h3>Total a pagar: ${total.toFixed(2)}</h3>

        {/* Formulario de datos del usuario */}
        <h3>Datos del Comprador</h3>
        <div className="form-group">
          <FaUser className="icon" />
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre Completo" 
            value={formData.nombre} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <FaPhone className="icon" />
          <input 
            type="text" 
            name="celular" 
            placeholder="Celular" 
            value={formData.celular} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <FaEnvelope className="icon" />
          <input 
            type="email" 
            name="correo" 
            placeholder="Correo Electrónico" 
            value={formData.correo} 
            onChange={handleChange} 
          />
        </div>

        {/* Botón para procesar la compra */}
        <button className="btn-procesar" onClick={handleSubmit}>Confirmar Compra</button>
        <button className="btn-cerrar" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default BoletoModal;
