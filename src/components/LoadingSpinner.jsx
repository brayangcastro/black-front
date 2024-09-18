// LoadingSpinner.js
import React from 'react';
import './LoadingSpinner.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p className="loading-text">Cargando datos...</p>
  </div>
);

export default LoadingSpinner;
