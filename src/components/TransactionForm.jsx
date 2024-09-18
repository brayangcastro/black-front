import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const TransactionForm = ({ show, handleClose, processTransaction }) => {
    const [transactionType, setTransactionType] = useState('SALIDA');
    const [details, setDetails] = useState('');
    const [paymentMethods, setPaymentMethods] = useState([{ method: 'Efectivo', amount: 0 }]);
    const [comments, setComments] = useState('');

    const formatNumberInput = (value) => {
        // Eliminar cualquier cosa que no sea número o punto
        let numberString = value.replace(/[^0-9.]/g, '');
        // Evitar ceros a la izquierda y permitir solo dos decimales
        numberString = numberString.replace(/^0+/, '').replace(/(\.\d{2})\d+/, '$1');
        // Separar parte entera y decimal para formatear
        let parts = numberString.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Añadir comas en la parte entera
        return parts.join('.').replace(/^,/, ''); // Evitar coma inicial si existe
    };
    
    const handlePaymentChange = (index, field, value) => {
        const newPaymentMethods = [...paymentMethods];
        if (field === 'amount') {
            // Solo actualiza si el cambio es diferente, para evitar problemas con el cursor
            const formattedValue = formatNumberInput(value);
            if (formattedValue !== newPaymentMethods[index][field]) {
                newPaymentMethods[index][field] = formattedValue;
            }
        } else {
            newPaymentMethods[index][field] = value;
        }
        setPaymentMethods(newPaymentMethods);
    };

    const addPaymentMethod = () => {
        setPaymentMethods([...paymentMethods, { method: 'Efectivo', amount: 0 }]);
    };

    const removePaymentMethod = (index) => {
        const newPaymentMethods = [...paymentMethods];
        newPaymentMethods.splice(index, 1);
        setPaymentMethods(newPaymentMethods);
    };

    const handleSubmit = () => {
        if (comments.trim() === '') {
            alert('El campo de comentarios no puede estar vacío.');
            return;
        }
        console.log("Transaction Details", transactionType, details, paymentMethods, comments);
        processTransaction(transactionType, details, paymentMethods, comments);
        handleClose(); // Cierra el modal después de procesar la transacción
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Movimiento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tipo de movimiento</Form.Label>
                    <Form.Select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                        <option value="SALIDA">Salida</option>
                        <option value="ENTRADA">Entrada</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group hidden className="mb-3">
                    <Form.Label>Detalles del movimiento</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={details} 
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder="Producto/Servicio" 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Comentarios</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={comments} 
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Agregue cualquier comentario aquí" 
                    />
                </Form.Group>
                {paymentMethods.map((payment, index) => (
                    <div key={index} className="mb-3">
                        <Form.Group className="mb-2">
                            <Form.Label>Método de pago</Form.Label>
                            <Form.Select value={payment.method} onChange={(e) => handlePaymentChange(index, 'method', e.target.value)}>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Vale">Vale</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="text" // Cambiado a text
                                value={payment.amount}
                                onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                                placeholder="Ingrese el monto pagado"
                                pattern="\d*" // Esto permite solo dígitos, como un input de tipo number
                            />
                        </Form.Group>
                        {paymentMethods.length > 1 && (
                            <Button variant="danger" onClick={() => removePaymentMethod(index)}>
                                Eliminar
                            </Button>
                        )}
                    </div>
                ))}
                <Button hidden variant="secondary" onClick={addPaymentMethod}>Agregar otro método de pago</Button>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirmar Transacción
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TransactionForm;
