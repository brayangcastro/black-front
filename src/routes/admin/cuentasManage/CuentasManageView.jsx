import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Form, Pagination } from 'react-bootstrap';
import CuentaDetailModal from './CuentaDetailModal';
import EditCuentaForm from './EditCuentaForm';
import AddCuentaForm from './AddCuentaForm';
import PDFPreviewCuenta from './PDFPreviewCuenta';
import NuevoAbonoForm from './NuevoAbono';

const CuentasManageView = (props) => {
    const { allCuentas, agregarCuenta, editarCuenta, eliminarCuenta,crearAbono } = props;

    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPDFPreview, setShowPDFPreview] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [selectedCuenta, setSelectedCuenta] = useState(null);

    
    const [showAbonoModal, setShowAbonoModal] = useState(false);

    const filteredCuentas = allCuentas.filter(cuenta => {
        return cuenta.Nombre.toLowerCase().includes(search.toLowerCase());
    });

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentCuentas = filteredCuentas.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCuentas.length / ITEMS_PER_PAGE);

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <Button onClick={() => setShowAddModal(true)}>Agregar Cuenta</Button>
                </Col>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Buscar cuenta"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </Col>
            </Row>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Valor Total</th>
                        <th>Abonado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCuentas.map(cuenta => (
                        <tr key={cuenta.ID}>
                            <td>{cuenta.ID}</td>
                            <td>{cuenta.Nombre}</td>
                            <td>{cuenta.Valor_total}</td>
                            <td>{cuenta.Abonado}</td>
                            <td> 
                            <Button onClick={() => { setShowAbonoModal(true);}}>Abonar</Button>
                            <Button onClick={() => { setSelectedCuenta(cuenta); setShowEditModal(true); }}>Editar</Button>
                                <Button onClick={() => eliminarCuenta(cuenta.ID)}>Eliminar</Button>
                                <Button onClick={() => { setSelectedCuenta(cuenta); setShowPDFPreview(true); }}>Vista PDF</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            
            <NuevoAbonoForm show={showAbonoModal} showAbonoModal={showAbonoModal} setShowAbonoModal={setShowAbonoModal} crearAbono={crearAbono} />
            <AddCuentaForm showAddModal={showAddModal} setShowAddModal={setShowAddModal} agregarCuenta={agregarCuenta} />
            <EditCuentaForm showEditModal={showEditModal} setShowEditModal={setShowEditModal} cuenta={selectedCuenta} editarCuenta={editarCuenta} />
            <PDFPreviewCuenta show={showPDFPreview} pdfUrl={pdfUrl} handleClose={() => setShowPDFPreview(false)} />
        </Container>
    );
};

export default CuentasManageView;
