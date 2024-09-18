import React, { useState, useEffect } from 'react';
import { Button, InputGroup, Container, Row, Col, Form } from 'react-bootstrap';
import { faCheck, faBackspace } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './PaymentComponent.css'; // Asegúrate de importar tu archivo CSS personalizado

import axios from 'axios';
import apiUrls from '../api';

import { useNavigate } from 'react-router-dom';
import ValeModal from './ValeModal'; // Asegúrate de importar tu componente modal

const imprimirTicketUrl = import.meta.env.VITE_APP_IMPRIMIR_TICKET;

const PaymentComponent = ({ total, orderId, setShowCambioModal, setCantidadPagada, setCambio,setEfectivoPagado,setValePagado }) => {
    const navigate = useNavigate();
  
    total = Number(total) || 0;
    const [amountPaid, setAmountPaid] = useState(total.toString());

    const [selectedMethod, setSelectedMethod] = useState('Efectivo');
    const [paymentMethods, setPaymentMethods] = useState({
        Efectivo: total, // Inicializar con el total en efectivo
        Tarjeta: 0,
        Transferencia: 0,
        Cheque: 0,
        Vale: 0,
    });
    const [imprimirTicket, setImprimirTicket] = useState(false); // Estado para el checkbox
    const [showValeModal, setShowValeModal] = useState(false);
    const [selectedVale, setSelectedVale] = useState(null);

    const [forceRender, setForceRender] = useState(false);

useEffect(() => {
    const numericValue = parseFloat(amountPaid) || 0;
    setPaymentMethods(prev => {
        const updatedMethods = {
            ...prev,
            [selectedMethod]: numericValue,
        };
        console.log("Estado actual de paymentMethods:", updatedMethods);
        return updatedMethods;
    });
    setForceRender(prev => !prev);  // Forzar re-renderizado
}, [amountPaid, selectedMethod]);

    
    

    // Actualizar esta línea para calcular el cambio teniendo en cuenta el vale
    const totalPaid = Object.values(paymentMethods).reduce((acc, value) => acc + value, 0);
    const changeDue = totalPaid >= (total - paymentMethods.Vale) ? totalPaid - (total - paymentMethods.Vale) : 0;

    const handleSelectPaymentMethod = (method) => {
        setSelectedMethod(method);
        if (method === 'Vale') {
            setShowValeModal(true);
        } else {
            setAmountPaid(paymentMethods[method].toString());
        }
    };

    const vales = [
        
        { id: 1, nombre: 'Vale por porcentaje', estado: 'Activos', total: 0, tipo: 'Porcentaje' },
    ];
    
    const handleValeSelect = (valeId, percentageDiscount) => {
        const vale = vales.find(v => v.id === parseInt(valeId));
        if (vale) {
            let discountAmount = 0;
    
            if (percentageDiscount && percentageDiscount > 0) {
                discountAmount = (total * (percentageDiscount / 100)).toFixed(2);
            } else {
                discountAmount = vale.total;
            }
    
            const remainingAmount = total - parseFloat(discountAmount);
    
            setPaymentMethods(prev => ({
                ...prev,
                Vale: parseFloat(discountAmount),
                Efectivo: remainingAmount > 0 ? remainingAmount : 0,
            }));
    
            // Forzar una re-renderización manual del componente
            setForceRender(prev => !prev);
    
            console.log("Actualizando Vale:", discountAmount);
            setSelectedVale(vale);
            setAmountPaid('');
        }
    };
    
    

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmountPaid(value);
        }
    };

    const ImprimirTicket = () => {
        // URL de tu archivo PHP que maneja la apertura del cajón
        const url = `${imprimirTicketUrl}?Saldo=${orderId}`;
        axios.get(url)
            .then(response => {
                console.log('ImprimirTicket con éxito');
            })
            .catch(error => {
                console.error('Error al ImprimirTicket:', error);
            });
    };

    const enviarPago = async () => {
        try {
            const response = await axios.post(apiUrls.pagarTicket, 
                { paymentDetails: paymentMethods, ticketId: orderId }
            );
            if (response) {  
                setCantidadPagada(parseFloat(response.data.Ticket.TotalPagado));
                setCambio(parseFloat(response.data.Ticket.Cambio));
                setEfectivoPagado(paymentMethods.Efectivo);  // Actualiza efectivo pagado
                setValePagado(paymentMethods.Vale);          // Actualiza vale pagado
                if (imprimirTicket) ImprimirTicket();
                setShowCambioModal(true);
            }
        } catch (error) {
            console.error("Error al obtener los datos de la pagarTicket:", error);
        }
    };

    const handleSubmit = () => {
        const effectiveTotal = total - paymentMethods.Vale; // Descontar el vale del total
    
        if (totalPaid < effectiveTotal) {
            console.log('La cantidad pagada es menor al total');
            return;
        }
    
        enviarPago();
    
        // Resetear los montos después de la transacción
        setPaymentMethods({
            Efectivo: 0,
            Tarjeta: 0,
            Transferencia: 0,
            Cheque: 0,
            Vale: 0,
        });
        setAmountPaid('');
    };
    

    const handleReset = () => {
        setAmountPaid('');
        setSelectedMethod('Efectivo');
        setPaymentMethods({
            Efectivo: 0,
            Tarjeta: 0,
            Transferencia: 0,
            Cheque: 0,
            Vale: 0,
        });
    };

   const handleCompletePayment = (method) => {
    const totalPaidSoFar = Object.values(paymentMethods).reduce((acc, value) => acc + value, 0);
    const remainingAmount = total - totalPaidSoFar;

    if (remainingAmount > 0) {
        setPaymentMethods(prev => ({
            ...prev,
            [method]: (prev[method] || 0) + remainingAmount
        }));
    }
};

useEffect(() => {
    console.log("Estado actual de paymentMethods:", paymentMethods);
    setForceRender(prev => !prev);
}, [paymentMethods]);


    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'];

    return (
        <div className="payment-container">
            <div className="procesar-pago-header">
                <h4>Total a pagar (MXN): ${total.toFixed(2)}</h4>
            </div>
            <div className="totals-display">
                Total pagado: ${totalPaid.toFixed(2)}
                <br />
                Cambio (MXN): ${changeDue.toFixed(2)}
            </div>

            <InputGroup className="mb-3">
                <input
                    className="payment-input"
                    placeholder="Importe"
                    value={amountPaid}
                    onChange={handleAmountChange}
                />
                <Button className="payment-button wide" onClick={handleSubmit}>
                    <FontAwesomeIcon icon={faCheck} /> Pagar
                </Button>
            </InputGroup>

            <div className="d-flex align-items-center justify-content-between">
                <Form.Check
                    type="checkbox"
                    label="Imprimir Ticket"
                    checked={imprimirTicket}
                    onChange={(e) => setImprimirTicket(e.target.checked)}
                    className="ms-2"
                />
            </div>

            <div className="payment-methods-grid">
    {Object.entries(paymentMethods).map(([method, value]) => (
        <Button
            key={method}
            className={`payment-button method ${value > 0 ? 'has-amount' : ''} ${selectedMethod === method ? 'selected' : ''}`}
            onClick={() => handleSelectPaymentMethod(method)}
            onDoubleClick={() => handleCompletePayment(method)}
        >
            {method} (${value.toFixed(2)}) {/* Aquí se muestra el valor actualizado */}
        </Button>
    ))}
</div>


            <div className="payment-keypad">
                {keys.map((key) => (
                    <Button
                        key={key}
                        className="payment-button key"
                        style={{ fontSize: '28px' }} // Estilo en línea para el tamaño de la fuente
                        onClick={() => setAmountPaid(amountPaid + key)}
                    >
                        {key}
                    </Button>
                ))}
                <Button
                    className="payment-button key"
                    onClick={() => setAmountPaid(amountPaid.slice(0, -1))}
                >
                    <FontAwesomeIcon icon={faBackspace} />
                </Button>
            </div>

            <div className="quick-amounts-grid">
                {[20, 50, 100, 200, 500].map((amount) => (
                    <Button
                        key={amount}
                        className="payment-button quick-amount"
                        onClick={() => setAmountPaid(amount.toString())}
                    >
                        ${amount}
                    </Button>
                ))}
            </div>

            <Button className="payment-button reset wide" onClick={handleReset}>
                Reset
            </Button>
            <ValeModal
                show={showValeModal}
                handleClose={() => setShowValeModal(false)}
                handleSelectVale={handleValeSelect}
            />
        </div>
    );
};

export default PaymentComponent;
