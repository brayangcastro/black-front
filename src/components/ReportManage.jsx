import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrls from '../api'; // Asegúrate de que este archivo tenga las URLs correctas de la API
import ReportViewer from './ReportViewer';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const ReportManage = () => {
  const { corte_id } = useParams();
  const navigate = useNavigate();
  const [corteId, setCorteId] = useState(corte_id || '');
  const [data, setData] = useState({
    pagoJson: [],
    totales: {},
    movEntrada: [],
    movSalida: [],
    productos10: [],
    cancelaciones: [],
    fechaCorte: '',
    ticketsTotales: [],
    vendedores: [],
    corteId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Manejo para cargar automáticamente al inicio con corte_id de la URL
    if (corte_id) {
      setCorteId(corte_id);
    }
  }, [corte_id]);

  const fetchData = async (corteId) => {
    setLoading(true);
    setError(null);
    try {
      const responsePagoJson = await axios.post(apiUrls.getCorteDetails, { corteId });
      const responseTotales = await axios.post(apiUrls.getTicketsStatsCorte, { corteId });
      const responseMovEntrada = await axios.post(apiUrls.movimientosCorte, { corteId, tipo: "ENTRADA" });
      const responseMovSalida = await axios.post(apiUrls.movimientosCorte, { corteId, tipo: "SALIDA" });
      const responseProductos10 = await axios.post(apiUrls.productosCorte, { corteId });
      const responseCancelaciones = await axios.post(apiUrls.cancelacionesCorte, { corteId });
      const responseFechaCorte = await axios.post(apiUrls.getFechaCorte, { corteId });
      const responseTicketsTotales = await axios.post(apiUrls.getTicketsPorCorte, { corteId });
      const responseVendedores = await axios.post(apiUrls.getVendedoresStatsPorCorte, { corteId });

      setData({
        pagoJson: responsePagoJson.data,
        totales: responseTotales.data,
        movEntrada: responseMovEntrada.data,
        movSalida: responseMovSalida.data,
        productos10: responseProductos10.data,
        cancelaciones: responseCancelaciones.data,
        fechaCorte: responseFechaCorte.data,
        ticketsTotales: responseTicketsTotales.data,
        vendedores: responseVendedores.data,
        corteId: corteId
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCorteId(e.target.value);
  };

  const handleConsultarClick = () => {
    if (corteId) {
      navigate(`/reportes/${corteId}`);
    }
  };

  useEffect(() => {
    // Manejo para cargar automáticamente al inicio con corte_id de la URL
    if (corte_id) {
      setCorteId(corte_id);
      fetchData(corte_id);
    }
  }, [corte_id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <TailSpin color="#076084" height={100} width={100} />
      </div>
    );
  }

  if (error) {
    return <div>Error loading report: {error.message}</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={corteId}
        onChange={handleInputChange}
        placeholder="Ingrese el ID del corte"
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          width: '10%',
          boxSizing: 'border-box'
        }}
      />
      <button
        onClick={handleConsultarClick}
        style={{
          backgroundColor: '#007bff',
          border: 'none',
          color: 'white',
          padding: '10px 20px',
          fontSize: '16px',
          fontWeight: 'bold',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease'
        }}
      >
        CONSULTAR
      </button>
      {data.corteId && (
        <ReportViewer
          pagoJson={data.pagoJson}
          totales={data.totales}
          movEntrada={data.movEntrada}
          movSalida={data.movSalida}
          productos10={data.productos10}
          cancelaciones={data.cancelaciones}
          fechaCorte={data.fechaCorte}
          ticketsTotales={data.ticketsTotales}
          vendedores={data.vendedores}
          corteId={data.corteId}
        />
      )}
      {loading && <div>Loading...</div>}
      {error && <div>Error loading report: {error.message}</div>}
    </div>
  );
};

export default ReportManage;
