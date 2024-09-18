import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addDays, format, differenceInDays ,parseISO} from 'date-fns';  

const MembershipRenewalForm = ({ show, handleClose, user, renewMembership }) => {
    const [membershipType, setMembershipType] = useState('Mensual');
    const [manualRenewalDate, setManualRenewalDate] = useState('');
    const [paymentAmount, setPaymentAmount] = useState(500); // Monto por defecto
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [comments, setComments] = useState('');
    const [daysUntilExpiry, setDaysUntilExpiry] = useState(0);
    const [currentDate, setCurrentDate] = useState('');

    // Montos por defecto para cada tipo de membresía
    const getPriceForMembershipType = (type) => {
        const prices = {
            'Anual': 5000,
            'Mensual': 500,
            'Quincenal': 300,
            'Semanal': 150,
            'Diaria': 60,
        };

        return prices[type];
    };

    const getDaysForMembershipType = (type) => {
        const days = {
            'Anual': 365,
            'Mensual': 30,
            'Quincenal': 15,
            'Semanal': 7,
            'Diaria': 1,
        };

        return days[type];
    };

    useEffect(() => {
        const today = new Date();
        setCurrentDate(format(today, 'yyyy-MM-dd'));
        const expiryDate = new Date(user.Fecha);
        const daysDiff = differenceInDays(expiryDate, today);
        setDaysUntilExpiry(daysDiff);

        const defaultRenewalDate = addDays(today, getDaysForMembershipType(membershipType));
        setManualRenewalDate(format(defaultRenewalDate, 'yyyy-MM-dd')); // Fecha por defecto
    }, [user]);

    const handleMembershipTypeChange = (e) => {
        const selectedType = e.target.value;
        setMembershipType(selectedType);
        setPaymentAmount(getPriceForMembershipType(selectedType)); // Montos por defecto
        const newRenewalDate = addDays(new Date(), getDaysForMembershipType(selectedType));
        setManualRenewalDate(format(newRenewalDate, 'yyyy-MM-dd')); // Ajuste automático
    };

    const handleSubmit = () => {
        const renewalDate = format(parseISO(manualRenewalDate), 'yyyy-MM-dd'); // Formatear la fecha
 
       // const renewalDate = new Date(manualRenewalDate);
        renewMembership(user, membershipType, paymentAmount, comments, renewalDate, paymentMethod);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Renovar Membresía para {user?.Nombre}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Fecha actual: {currentDate}</p> {/* Muestra la fecha actual */}
                <p>Días hasta el vencimiento: {daysUntilExpiry}</p> {/* Días de vencimiento */}

                <Form.Group className="mb-3">
                    <Form.Label>Tipo de Membresía</Form.Label> {/* Cierre correcto */}
                    <Form.Select
                        value={membershipType}
                        onChange={handleMembershipTypeChange} // Maneja el cambio de membresía
                    >
                        <option value="Anual">Anual</option>
                        <option value="Mensual">Mensual</option>
                        <option value="Quincenal">Quincenal</option>
                        <option value="Semanal">Semanal</option>
                        <option value="Diaria">Diaria</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Fecha de Renovación</Form.Label> {/* Cierre correcto */}
                    <Form.Control
                        type="date"
                        value={manualRenewalDate} // Asegúrate de cerrar correctamente
                        onChange={(e) => setManualRenewalDate(e.target.value)} 
                    />
                </Form.Group> {/* Cierre completo */}

                <Form.Group className="mb-3">
                    <Form.Label>Monto a Pagar</Form.Label> {/* Correcto cierre */}
                    <Form.Control
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Método de Pago</Form.Label>
                    <Form.Select 
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                    >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Transferencia">Transferencia</option>
                        <option value="Vale">Vale</option>
                    </Form.Select> {/* Cierre correcto */}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Comentarios</Form.Label> {/* Cierre correcto */}
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={comments} 
                        onChange={(e) => setComments(e.target.value)} 
                    />
                </Form.Group> {/* Cierre correcto */}
                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirmar Renovación
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MembershipRenewalForm;
