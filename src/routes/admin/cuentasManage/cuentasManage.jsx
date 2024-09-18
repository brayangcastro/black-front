import { useState, useEffect } from 'react';
import  CuentasManageView  from './CuentasManageView'; 
import axios from 'axios';
import apiUrls from '../../../api'; 
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CuentasManage = () => {
    const [cuentas, setCuentas] = useState([]);
    const navigate = useNavigate();

    const fetchCuentas = async () => {
        try {
            const response = await axios.post(apiUrls.listarCuentas);
            setCuentas(response.data);  // Asume que tienes un estado llamado cuentas
        } catch (error) {
            console.error('Error al obtener las cuentas:', error);
        }
    };
    
    // Llamar a fetchCuentas cuando el componente se monte
    useEffect(() => {
        fetchCuentas();
    }, []);

    
    const agregarCuenta = async (cuentaData) => {
        try {
            const response = await axios.post(apiUrls.agregarCuenta, { cuentaData:cuentaData });
            console.log('Cuenta agregada exitosamente.', response.data);
            fetchCuentas();  // Volver a cargar las cuentas después de agregar
        } catch (error) {
            console.error('Error al agregar la cuenta:', error);
        }
    };

    
    const editarCuenta = async (cuentaId, cuentaData) => {
        try {
            const response = await axios.post(`${apiUrls.actualizarCuenta}`, { cuentaId:cuentaId,cuentaData:cuentaData });
            console.log('Cuenta actualizada exitosamente.', response.data);
            fetchCuentas();  // Volver a cargar las cuentas después de actualizar
        } catch (error) {
            console.error('Error al actualizar la cuenta:', error);
        }
    };
     
     
    const eliminarCuenta = async (cuentaId) => {
        try {
            const response = await axios.post(apiUrls.eliminarCuenta,   { cuentaId:cuentaId } );
            console.log('Cuenta eliminada exitosamente.', response.data);
            fetchCuentas();  // Volver a cargar las cuentas después de eliminar
        } catch (error) {
            console.error('Error al eliminar la cuenta:', error);
        }
    };
    
    const crearAbono = async (Data) => {
        
         
        let ticketData = { 'data': { 'Mesa': '1', 'Vendedor': Data.Vendedor, 'Cliente': Data.Cliente } };
        
        let ticketDetails = { 'Codigo': '1', 'Nombre': "Abono", 'Precio': Data.Abono,
             'Cantidad': '1','Estado':'PROCESANDO' };
       

        try {
            const createResponse = await createTicket(ticketData);
            const ticketId = createResponse.data;
            console.log("NUEVO TICKET CREADO", ticketId);
            await addTicketDetails(ticketId, ticketDetails);

            navigate(`/ordenes/${ticketId}`);
           // await finalizeTicket(ticketId, paymentDetails,renewalDate);
            console.log('Abono creado con éxito');
        } catch (error) {
            console.error('Error al renovar la membresía:', error);
        }
    };

    const createTicket = async (data) => {
        try {
            const response = await axios.post(apiUrls.createTicket, data);
            return response;
        } catch (error) {
            console.error(`Error al createTicket:`, error);
            throw error;
        }
    };

    const addTicketDetails = async (ticketId, productDetails) => {
        try {
            const response = await axios.post(apiUrls.addTicketDetails, {
                ticketId: ticketId,
                productDetails: productDetails
            });
            return response;
        } catch (error) {
            console.error(`Error al addTicketDetails:`, error);
            throw error;
        }
    };

    const finalizeTicket = async (ticketId, paymentDetails,renewalDate) => {
        try {
            const response = await axios.post(apiUrls.finalizeTicket, {
                ticketId: ticketId,
                paymentDetails: paymentDetails,
                renewalDate:renewalDate
            });
            const updatedResponse = await axios.get(apiUrls.getAllUsers);
            setData(updatedResponse.data);
            return response;
        } catch (error) {
            console.error(`Error al finalizeTicket:`, error);
            throw error;
        }
    };



    return (
        <>
        
        <CuentasManageView   
        
            allCuentas={cuentas}  // Asume que tienes el estado "cuentas" que contiene las cuentas obtenidas del backend
            agregarCuenta={agregarCuenta}
            editarCuenta={editarCuenta}
            eliminarCuenta={eliminarCuenta}
            crearAbono={crearAbono}
            />
     
           
        </>

    );
};

export default CuentasManage;
