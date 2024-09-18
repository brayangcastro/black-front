import React from 'react'; 

import './HeaderComponent.css';  
// Importación de iconos omitida para brevedad

const Indicador = ({ Icon, value, label }) => { // Nota el cambio de `icon` a `Icon` para indicar que es un componente
    return (
      <div className="indicador">
       <Icon size={32} style={{ marginRight: 10 }} /> 

        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
          <div>{label}</div>
        </div>
      </div>
    );
  };
  

const styles = {
  indicador: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: '10px 20px',
    borderRadius: '8px',
    margin: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  }
};

export default Indicador;
