import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaQuestionCircle, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import './MainScreen.css'; // Asegúrate de que la ruta al archivo CSS es correcta

const MainScreen = () => {
  return (
    <div className="main-screen">
      <Link to="/usuarios" className="main-button">
        <FaUsers className="icon" />
        <span>Usuarios</span>
      </Link>
      <Link to="/test" className="main-button">
        <FaQuestionCircle className="icon" />
        <span>Preguntas</span>
      </Link>
      <Link to="/resultados" className="main-button">
        <FaChartBar className="icon" />
        <span>Resultados</span>
      </Link>
      <Link to="/logout" className="main-button"> {/* Cambia "/logout" por la ruta que maneje el cierre de sesión */}
        <FaSignOutAlt className="icon" />
        <span>Salir</span>
      </Link>
    </div>
  );
};

export default MainScreen;
