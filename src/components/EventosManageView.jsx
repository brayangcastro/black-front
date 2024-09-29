import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Form, Pagination } from 'react-bootstrap';
import axios from 'axios';

const EventosManageView = () => {
  const [eventos, setEventos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Obtener los eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/rifas/eventos');
        setEventos(response.data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };
    fetchEventos();
  }, []);

  // Filtrar los eventos por nombre
  const filteredEventos = eventos.filter((evento) => {
    return evento.Nombre.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Paginación
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentEventos = filteredEventos.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredEventos.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Funciones de control para cada acción
  const handleDelete = async (eventoID) => {
    try {
      await axios.delete(`http://localhost:3001/rifas/eventos/${eventoID}`);
      setEventos(eventos.filter((evento) => evento.ID !== eventoID));
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
    }
  };

  const handleRestart = async (eventoID) => {
    try {
      await axios.post(`http://localhost:3001/rifas/eventos/${eventoID}/reiniciar`);
      alert('Evento reiniciado');
    } catch (error) {
      console.error('Error al reiniciar el evento:', error);
    }
  };

  const handleCancel = async (eventoID) => {
    try {
      await axios.post(`http://localhost:3001/rifas/eventos/${eventoID}/cancelar`);
      alert('Evento cancelado');
    } catch (error) {
      console.error('Error al cancelar el evento:', error);
    }
  };

  const handleRestore = async (eventoID) => {
    try {
      await axios.post(`http://localhost:3001/rifas/eventos/${eventoID}/restaurar`);
      alert('Evento restaurado');
    } catch (error) {
      console.error('Error al restaurar el evento:', error);
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h4>Gestión de Eventos</h4>
        </Col>
      </Row>

      {/* Campo de búsqueda */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de evento"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Col>
      </Row>

      {/* Tabla de eventos */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Costo</th>
            <th>Acciones</th> {/* Nueva columna para los controles */}
          </tr>
        </thead>
        <tbody>
          {currentEventos.map((evento) => (
            <tr key={evento.ID}>
              <td>{evento.ID}</td>
              <td>{evento.Nombre}</td>
              <td>{isNaN(Date.parse(evento.Fecha)) ? evento.Fecha : new Date(evento.Fecha).toLocaleDateString()}</td>
              <td>
                {isNaN(parseFloat(evento.Costo))
                  ? evento.Costo
                  : `$${parseFloat(evento.Costo).toFixed(2)}`}
              </td>
              <td>
                {/* Botones de control */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(evento.ID)}
                >
                  Eliminar
                </Button>{' '}
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleRestart(evento.ID)}
                >
                  Reiniciar
                </Button>{' '}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCancel(evento.ID)}
                >
                  Cancelar
                </Button>{' '}
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => handleRestore(evento.ID)}
                >
                  Restaurar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginación */}
      <Pagination>
        {currentPage > 1 && <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />}
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        {currentPage < totalPages && <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />}
      </Pagination>
    </Container>
  );
};

export default EventosManageView;
