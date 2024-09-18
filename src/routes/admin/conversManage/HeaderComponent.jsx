import React from 'react';
import { FaComments, FaSignInAlt, FaSignOutAlt, FaRobot } from 'react-icons/fa';

import Indicador from './Indicador';
import './HeaderComponent.css';  

  
const HeaderComponent = ({ totalConversaciones, totalEntrantes, totalSalientes, isConnected }) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
        <Indicador Icon={FaComments} value={totalConversaciones} label="Conversaciones" />
        <Indicador Icon={FaSignInAlt} value={totalEntrantes} label="Entrantes" />
        <Indicador Icon={FaSignOutAlt} value={totalSalientes} label="Salientes" />
        <Indicador Icon={FaRobot} value={isConnected ? 'Conectado' : 'Desconectado'} label="Chatbot" />
      </div>
    );
  };
  
export default HeaderComponent;
