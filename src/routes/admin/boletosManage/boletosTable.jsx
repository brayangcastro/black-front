import React, { useState } from 'react';
import { Table, Row, Col, Button, Form, Pagination } from 'react-bootstrap';

const BoletosTable = ({ boletos = [], searchTerm, setSearchTerm, handleVerDetalles }) => {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const filteredBoletos = boletos.filter(boleto => {
        return (
            (boleto.Numero && boleto.Numero.toString().includes(searchTerm)) ||
            (boleto.Nombre && boleto.Nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (boleto.Estado && boleto.Estado.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentBoletos = filteredBoletos.slice(firstIndex, lastIndex);

    const totalPages = Math.ceil(filteredBoletos.length / itemsPerPage);

    const handlePageChange = page => setCurrentPage(page);

    return (
        <Row>
            <Col md={12}>
                <Form.Control
                    type="text"
                    placeholder="Buscar por número, nombre o estado"
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <Table striped hover responsive>
                    <thead>
                        <tr>
                            <th>Numero</th>
                            <th>Nombre</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Sorteo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBoletos.map((boleto, index) => (
                            <tr key={index}>
                                <td>{boleto.Numero}</td>
                                <td>{boleto.Nombre}</td>
                                <td>{boleto.Estado}</td>
                                <td>{boleto.Fecha}</td>
                                <td>{boleto.Sorteo}</td>
                                <td>
                                    <Button variant="info" onClick={() => handleVerDetalles(boleto)}>
                                        Ver Detalles
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination>
                    {currentPage > 1 && (
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                    )}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Pagination.Item
                            key={index}
                            active={currentPage === index + 1}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    {currentPage < totalPages && (
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                    )}
                </Pagination>
            </Col>
        </Row>
    );
};

export default BoletosTable;
