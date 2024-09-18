import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form, Row, Col, InputGroup, Tooltip, OverlayTrigger, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillWave, faCreditCard, faUniversity, faCheck, faGift, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function FormatearCantidad(cantidad) {
  const numero = parseFloat(cantidad);
  return !isNaN(numero) ? numero.toFixed(2) : '0.00';
}

function CorteModal({ show, handleClose, realizarCorte, totalesCalculados, ticketStats, fetchTicketStats }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [pagos, setPagos] = useState({
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    cheque: 0,
    vales: 0, 
    ajusteCorte: 0
  });

  const [nota, setNota] = useState("");
  const [ajusteCorte, setAjusteCorte] = useState(0);

  const [totalContado, setTotalContado] = useState(0);
  const [totalCalculado, setTotalCalculado] = useState(0);
  const [showDenominacionesModal, setShowDenominacionesModal] = useState(false);
  const [showMovimientosModal, setShowMovimientosModal] = useState(false);

  useEffect(() => {
    const total = Object.values(pagos).reduce((acc, current) => acc + parseFloat(current || 0), 0);
    setTotalContado(total);
  }, [pagos]);

  useEffect(() => {
    const total = Object.values(totalesCalculados).reduce((acc, current) => acc + parseFloat(current || 0), 0);
    setTotalCalculado(total);
  }, [totalesCalculados]);

  const renderTooltip = (props) => (
    <Tooltip {...props}>Información relevante sobre el método de pago.</Tooltip>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPagos({
      ...pagos,
      [name]: Number(value),
    });
  };

  const handleNotaChange = (e) => {
    setNota(e.target.value);
  };

  const handleAjusteCorteChange = (e) => {
    setAjusteCorte(Number(e.target.value));
  };

  const calcularDiferencia = (metodo) => {
    const contado = pagos[metodo];
    const calculado = totalesCalculados[metodo];
    return contado - calculado;
  };

  const handleRealizarCorte = async () => {
    setIsLoading(true);
    const diferencias = Object.keys(pagos).map(metodo => calcularDiferencia(metodo));
    const hayDiferencias = diferencias.some(dif => dif !== 0);

    if (hayDiferencias) {
      // alert("Existen diferencias entre lo contado y lo calculado.");
    }

    try {
      const respuestaCorte = await realizarCorte(pagos, totalContado, movimientos, nota, ajusteCorte);
      setConfirmationMessage(respuestaCorte);
      setShowConfirmation(false);
      fetchTicketStats();
    } catch (error) {
      setConfirmationMessage("Hubo un error al realizar el corte.");
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
      fetchTicketStats();
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setPagos({
      efectivo: 0,
      tarjeta: 0,
      transferencia: 0,
      cheque: 0,
      vales: 0 
    });
    setNota("");
    setAjusteCorte(0);
    setConfirmationMessage("");
    handleClose();
  };

  const billetesValores = {
    mil: 1000,
    quinientos: 500,
    doscientos: 200,
    cien: 100,
    cincuenta: 50,
    veinteBillete: 20,
  };

  const monedasValores = {
    veinteMoneda: 20,
    diez: 10,
    cinco: 5,
    uno: 1,
  };

  const [billetes, setBilletes] = useState({
    mil: 0,
    quinientos: 0,
    doscientos: 0,
    cien: 0,
    cincuenta: 0,
    veinteBillete: 0,
  });

  const [monedas, setMonedas] = useState({
    veinteMoneda: 0,
    diez: 0,
    cinco: 0,
    uno: 0,
  });

  const handleChangeDenominaciones = (e, tipo) => {
    const { name, value } = e.target;
    if (tipo === 'billete') {
      setBilletes(prev => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (tipo === 'moneda') {
      setMonedas(prev => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  useEffect(() => {
    const totalBilletes = Object.entries(billetes).reduce((acc, [denominacion, cantidad]) => {
      return acc + (cantidad * billetesValores[denominacion]);
    }, 0);

    const totalMonedas = Object.entries(monedas).reduce((acc, [denominacion, cantidad]) => {
      return acc + (cantidad * monedasValores[denominacion]);
    }, 0);

    const totalEfectivo = totalBilletes + totalMonedas;

    setPagos(prevPagos => ({
      ...prevPagos,
      efectivo: totalEfectivo,
    }));

    setTotalContado(totalEfectivo);

  }, [billetes, monedas]);

  const renderDenominacionesInputs = (valores, tipo) => {

    return Object.entries(valores).map(([denominacion, valor]) => (
      <Form.Group as={Row} key={denominacion} className="align-items-center">
        <Form.Label column sm="6">{`$${valor} - ${denominacion}`}</Form.Label>
        <Col sm="6">
          <Form.Control
            type="number"
            name={denominacion}
            value={tipo === 'billete' ? billetes[denominacion] : monedas[denominacion]}
            onChange={(e) => handleChangeDenominaciones(e, tipo)}
            min="0"
          />
        </Col>
      </Form.Group>
    ));

  };

  const [movimientos, setMovimientos] = useState({
    entradas: 0,
    salidas: 0
  });

  const handleMovimientosChange = (e) => {
    const { name, value } = e.target;
    setMovimientos(prev => ({
      ...prev,
      [name]: Number(value)
    }));

    setPagos(prevPagos => ({
      ...prevPagos,
      movimientos: Number(value),
    }));
  };

  const calcularVentaReal = () => {
    const totalVentas = parseFloat(pagos.efectivo) + parseFloat(pagos.tarjeta) + parseFloat(pagos.transferencia) + parseFloat(pagos.cheque) + parseFloat(pagos.vales);
    const totalEmpleados = parseFloat(pagos.totalEmpleados) || 0;
    return totalVentas - totalEmpleados;
  };

  const calcularCorteTotal = () => {
    const totalVentas = parseFloat(pagos.efectivo) + parseFloat(pagos.tarjeta) + parseFloat(pagos.transferencia) + parseFloat(pagos.cheque) + parseFloat(pagos.vales);
    const totalEmpleados = parseFloat(pagos.totalEmpleados) || 0;
    console.log("totalVentas", totalVentas);
    console.log("totalEmpleados", totalEmpleados);
    console.log("ticketStats.totalEntradas", ticketStats.totalEntradas);
    console.log("ticketStats.totalSalidas", ticketStats.totalSalidas);

    return totalVentas - totalEmpleados + ticketStats.totalEntradas - ticketStats.totalSalidas;
  };

  return (
    <>
      <Row className="mt-3">
        <Modal show={showDenominacionesModal} onHide={() => setShowDenominacionesModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Desglose de billetes y monedas</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col sm="6">
                <h5>Billetes</h5>
                {renderDenominacionesInputs(billetesValores, 'billete')}
              </Col>
              <Col sm="6">
                <h5>Monedas</h5>
                {renderDenominacionesInputs(monedasValores, 'moneda')}
              </Col>
            </Row>
            <Row>
              <Col>
                <h5 className="text-center">Total Efectivo: ${totalContado.toFixed(2)}</h5>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDenominacionesModal(false)}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </Row>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Desglose de Pagos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Procesando...</p>
            </div>
          )}
          {Object.entries(pagos).map(([metodo, valor]) => (
            <Form.Group as={Row} key={metodo} className="align-items-center">
              <Col xs="6" sm="4" className="d-flex align-items-center">
                <FontAwesomeIcon icon={metodo === 'efectivo' ? faMoneyBillWave : metodo === 'tarjeta' ? faCreditCard : metodo === 'transferencia' ? faUniversity : metodo === 'cheque' ? faCheck : metodo === 'vales' ? faGift : faCheck} className="me-2" size="lg" />
                <Form.Label>{metodo.charAt(0).toUpperCase() + metodo.slice(1)}</Form.Label>
                <OverlayTrigger placement="right" overlay={renderTooltip}>
                  <FontAwesomeIcon icon={faInfoCircle} className="ms-2" onClick={() => setShowDenominacionesModal(true)} />
                </OverlayTrigger>
              </Col>
              <Col xs="3" sm="3">
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    name={metodo}
                    value={valor}
                    onChange={handleChange}
                    min="0"
                  />
                </InputGroup>
              </Col>
              <Col xs="3" sm="2" className="text-right">
                <strong>${totalesCalculados[metodo]}</strong>
              </Col>
              <Col xs="3" sm="3" className="text-end">
                <strong className={calcularDiferencia(metodo) !== 0 ? 'text-danger' : ''}>
                  Dif: ${calcularDiferencia(metodo)}
                </strong>
              </Col>
            </Form.Group>
          ))}
          <Row className="mt-3">
            <Col sm="3"></Col>
            <Col sm="3" className="text-end">
              <strong>Contado: ${totalContado.toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Calculado: ${totalCalculado.toFixed(2)}</strong>
            </Col>
            <Col sm="3"></Col>
          </Row>
          <Row className="mt-3">
            <Col sm="3" className="text-end">
              <strong>Total Ventas: ${Math.abs(pagos.efectivo + pagos.tarjeta + pagos.transferencia + pagos.cheque + pagos.vales).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Total Entradas: ${Math.abs(ticketStats.totalEntradas).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Total Salidas: ${Math.abs(ticketStats.totalSalidas).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Total al Corte: ${Math.abs(calcularCorteTotal()).toFixed(2)}</strong>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm="3" className="text-end">
              <strong>Venta Real: ${Math.abs(calcularVentaReal()).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Efectivo: ${Math.abs(pagos.efectivo).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Tarjeta: ${Math.abs(pagos.tarjeta).toFixed(2)}</strong>
            </Col>
            <Col sm="3" className="text-end">
              <strong>Gastos: ${Math.abs(movimientos.salidas).toFixed(2)}</strong>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col sm="8" className="text-end">
              <Form.Group as={Row} className="align-items-center mt-3">
                <Col xs="6" sm="4" className="d-flex align-items-center">
                  <Form.Label>Comentarios sobre el corte</Form.Label>
                </Col>
                <Col xs="12" sm="8">
                  <Form.Control
                    type="text"
                    value={nota}
                    onChange={handleNotaChange}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>Salir</Button>
          <Button variant="success" onClick={() => setShowConfirmation(true)} disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Realizar Corte'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmation} onHide={() => setShowConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Corte</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres realizar el corte?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmation(false)}>Cancelar</Button>
       
          <Button variant="success" onClick={() => handleRealizarCorte(true)} disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Confirmar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={confirmationMessage !== ""} onHide={() => setConfirmationMessage("")}>
        <Modal.Header closeButton>
          <Modal.Title>Resultado del Corte</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmationMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CorteModal;
