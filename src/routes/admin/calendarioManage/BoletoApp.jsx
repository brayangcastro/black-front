import React, { useState, useEffect } from 'react';
import BoletoGrid from './BoletoGrid';
import FiltroEstado from './FiltroEstado'; // Componente del filtro
import './BoletoGrid.css';
import Modal from './BoletoModal'; // Modal para registro
import { obtenerBoletosPorEvento, cambiarEstadoBoleto } from './rifasService'; // Importar servicios

const BoletoApp = () => {
  const [boletos, setBoletos] = useState([]);
  const [boletosSeleccionados, setBoletosSeleccionados] = useState([]);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [estadosSeleccionados, setEstadosSeleccionados] = useState(['DISPONIBLE']); // Estados seleccionados por el filtro

  const evento = {
    id: 5, // Supón que el evento tiene un ID 1, cámbialo si es necesario
    nombre: "Rifa por unos vergazos...",
    fecha: "2024-10-15"
  };

  useEffect(() => {
    const cargarBoletos = async () => {
      const boletosData = await obtenerBoletosPorEvento(evento.id);
      setBoletos(boletosData);
    };
    cargarBoletos();
  }, [evento.id]);

  useEffect(() => {
    const seleccionados = boletos.filter(boleto => boleto.selected);
    setBoletosSeleccionados(seleccionados);
    const totalCosto = seleccionados.reduce((acc, boleto) => acc + parseFloat(boleto.Total || 0), 0);
    setTotal(totalCosto);
  }, [boletos]);

  const boletosLibres = boletos.filter(boleto => boleto.Estado === 'DISPONIBLE').length;
  const boletosOcupados = boletos.length - boletosLibres;

  // Cambiar la selección del boleto por ID
  const handleSelect = (id) => {
    const nuevosBoletos = boletos.map(boleto => {
      if (boleto.ID === id && boleto.Estado === 'DISPONIBLE') {
        return { ...boleto, selected: !boleto.selected };
      }
      return boleto;
    });
    setBoletos(nuevosBoletos); // Actualiza el estado con los boletos modificados
  };

  const handleProcessPurchase = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handlePurchase = async () => {
    try {
      for (const boleto of boletosSeleccionados) {
        await cambiarEstadoBoleto(boleto.ID, 'PROCESANDO');
      }

      const nuevosBoletos = boletos.map(boleto =>
        boletosSeleccionados.some(b => b.ID === boleto.ID)
          ? { ...boleto, Estado: 'PROCESANDO' }
          : boleto
      );
      setBoletos(nuevosBoletos);
      setModalOpen(false);
    } catch (error) {
      console.error('Error al cambiar el estado de los boletos:', error);
    }
  };

  // Aplicar el filtro a los boletos
  const boletosFiltrados = boletos.filter(boleto => 
    estadosSeleccionados.includes(boleto.Estado)
  );

  return (
    <div>
      <div className="evento-detalles">
        <h3>{evento.nombre}</h3>
        <p>Fecha: {evento.fecha}</p>
        <p>Total de Boletos: {boletos.length}</p>
        <p>Boletos Libres: {boletosLibres} | Boletos Ocupados: {boletosOcupados}</p>
      </div>

      <h1>Selecciona tus boletos</h1>

      {/* Componente del filtro de estados */}
      <FiltroEstado estadosSeleccionados={estadosSeleccionados} setEstadosSeleccionados={setEstadosSeleccionados} />

      {/* Mostrar la cuadrícula de boletos filtrados */}
      <BoletoGrid boletos={boletosFiltrados} onSelect={handleSelect} />

      <div className="resumen-seleccion">
        <h2>Boletos Seleccionados</h2>
        <div className="seleccion-grid">
          {boletosSeleccionados.map((boleto, index) => (
            <div key={index} className="boleto-seleccionado">
              <span>Boleto #{boleto.Numero}</span>
            </div>
          ))}
        </div>
        <h3 className="mt-4">Total: ${total.toFixed(2)}</h3>
        {boletosSeleccionados.length > 0 && (
          <button className="btn-procesar mt-4" onClick={handleProcessPurchase}>
            Procesar Compra
          </button>
        )}
      </div>

      {isModalOpen && (
        <Modal 
          boletosSeleccionados={boletosSeleccionados} 
          total={total} 
          onClose={handleCloseModal}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default BoletoApp;
