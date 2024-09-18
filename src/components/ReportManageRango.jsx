import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiUrls from '../api';  // Asegúrate de que este archivo tenga las URLs correctas de la API
import ReportViewerRango from './ReportViewerRango';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TailSpin } from 'react-loader-spinner';

const ReportManageRango = () => {
  const { start_date, end_date } = useParams();
  const [startDate, setStartDate] = useState(start_date || '');
  const [endDate, setEndDate] = useState(end_date || '');
  const [data, setData] = useState({
    pagoJson: [],
    totales: {},
    movEntrada: [],
    movSalida: [],
    productos10: [],
    cancelaciones: [],
    vendedores: [],
    cortesTotales: [],
    cortesCuenta: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      const responsePagoJson = await axios.post(apiUrls.getCorteDetailsByDateRange, { startDate, endDate });
      const responseTotales = await axios.post(apiUrls.getTicketsStatsPorRango, { startDate, endDate });
      const responseMovEntrada = await axios.post(apiUrls.movimientosCortePorRango, { startDate, endDate, tipo: "ENTRADA" });
      const responseMovSalida = await axios.post(apiUrls.movimientosCortePorRango, { startDate, endDate, tipo: "SALIDA" });
      const responseProductos10 = await axios.post(apiUrls.productosCortePorRango, { startDate, endDate });
      const responseCancelaciones = await axios.post(apiUrls.cancelacionesCortePorRango, { startDate, endDate });
      const responseVendedores = await axios.post(apiUrls.getVendedoresStatsPorRango, { startDate, endDate });
      const responseCortesTotales = await axios.post(apiUrls.getCortesPorRango, { startDate, endDate });
      const responseCortesCuenta = await axios.post(apiUrls.getCountCortesPorRango, { startDate, endDate });
      console.log("responseProductos10", responseProductos10)
      console.log("responseCancelaciones", responseCancelaciones)

      setData({
        pagoJson: responsePagoJson.data,
        totales: responseTotales.data,
        movEntrada: responseMovEntrada.data,
        movSalida: responseMovSalida.data,
        productos10: responseProductos10.data,
        cancelaciones: responseCancelaciones.data,
        vendedores: responseVendedores.data,
        cortesTotales: responseCortesTotales.data,
        cortesCuenta: responseCortesCuenta.data
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <TailSpin color="#076084" height={100} width={100} />
      </div>
    );
  }

  /*if (loading) {
    return <div>Loading...</div>;
  }*/

  if (error) {
    return <div>Error loading report: {error.message}</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-5">
          <label htmlFor="startDate">Fecha de inicio</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="form-control"
            value={startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-5">
          <label htmlFor="endDate">Fecha de fin</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="form-control"
            value={endDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary btn-block" onClick={() => fetchData(startDate, endDate)}>
            CONSULTAR
          </button>
        </div>
      </div>

      {startDate && endDate && (
        <ReportViewerRango
          pagoJson={data.pagoJson}
          totales={data.totales}
          movEntrada={data.movEntrada}
          movSalida={data.movSalida}
          productos10={data.productos10}
          cancelaciones={data.cancelaciones}
          vendedores={data.vendedores}
          cortesTotales={data.cortesTotales}
          cortesCuenta={data.cortesCuenta}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
};

export default ReportManageRango;
