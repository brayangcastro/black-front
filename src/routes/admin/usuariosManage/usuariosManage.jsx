import React from 'react';
import { useState, useEffect } from 'react';
import UserManageView from "./usuariosManage-View";
import axios from 'axios';
import apiUrls from '../../../api';

const UsuariosManage = () => {
    const [data, setData] = useState([]);
    const [user, setUser] = useState({
        Nombre: '',
        Apellido: '',
        Email: '',
        Celular: '',
        publicMetadata: {},
    });

    const [editingUser, setEditingUser] = useState({
        Nombre: '',
        Apellido: '',
        Email: '',
        Celular: '',
        publicMetadata: {},
    });

    const [userDetail, setUserDetail] = useState({});
    const [dataUserDelete, setDataUserDelete] = useState({});
    const [clave, setClave] = useState('');

    const apiGetUsers = apiUrls.getAllUsers;
    const [userResponses, setUserResponses] = useState({});
    const [userLastResponse, setUserLastResponse] = useState({});
    const [userRestoreData, SetuserRestoreData] = useState({});
    const [userMetadata, setUserMetadata] = useState([]);
    const [membershipOptions, setMembershipOptions] = useState([]);

    useEffect(() => {
        const fetchMembershipOptions = async () => {
            try {
                const response = await axios.post(apiUrls.listMemberships);
                setMembershipOptions(response.data);
            } catch (error) {
                console.error('Error fetching membership options:', error);
            }
        };

        fetchMembershipOptions();
    }, []);

    const renewMembership = async (user, membershipType, paymentMethods = [], comments, renewFromToday) => {
        // Ejemplo de cómo podrías configurar los datos del ticket
        console.log("ME LLEGO paymentMethods", paymentMethods);
        let ticketData = { 'data': { 'Mesa': '1', 'Vendedor': '1', 'Cliente': '1' } };
        ticketData.data.Cliente = user.ID;

        let ticketDetails = { 'Codigo': '1', 'Nombre': "Mensualidad", 'Precio': '500', 'Cantidad': '1' };
        ticketDetails.Nombre = membershipType.Nombre;
        ticketDetails.Precio = membershipType.Precio;

        let paymentDetails = {
            'Total': '0',
            'Efectivo': '0',
            'Tarjeta': 0,
            'Transferencia': 0,
            'Cheque': 0,
            'Vale': 0
        };
        paymentDetails.Total = membershipType.Precio;

        if (Array.isArray(paymentMethods)) {
            paymentMethods.forEach(method => {
                const amount = parseFloat(method.amount);
                if (paymentDetails.hasOwnProperty(method.method)) {
                    paymentDetails[method.method] = amount;
                } else {
                    console.log("Método de pago no reconocido:", method.method);
                }
            });
        }

        console.log("testpaymnet", paymentDetails);

        try {
            const createResponse = await createTicket(ticketData);
            const ticketId = createResponse.data;
            console.log("NUEVO TICKET CREADO", ticketId);
            await addTicketDetails(ticketId, ticketDetails);
            await finalizeTicket(ticketId, paymentDetails);
            console.log('Membresía renovada con éxito');
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

    const finalizeTicket = async (ticketId, paymentDetails) => {
        try {
            const response = await axios.post(apiUrls.finalizeTicket, {
                ticketId: ticketId,
                paymentDetails: paymentDetails
            });
            const updatedResponse = await axios.get(apiUrls.getAllUsers);
            setData(updatedResponse.data);
            return response;
        } catch (error) {
            console.error(`Error al finalizeTicket:`, error);
            throw error;
        }
    };

    const deleteUser = async (userId) => {
        console.log("tratando de eliminar", userId);
        try {
            const response = await axios.post(apiUrls.deleteUser, { ID_cliente: userId });
            console.log(`Usuario con ID ${userId} eliminado exitosamente`);
            const updatedResponse = await axios.get(apiUrls.getAllUsers);
            setData(updatedResponse.data);
            return updatedResponse.data;
        } catch (error) {
            console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
            throw error;
        }
    };

    const getUserMetada = async (userId) => {
        try {
            const response = await axios.post(apiUrls.infoUser, { ID_cliente: userId });
            setUserMetadata(prevResponses => ({
                ...prevResponses,
                [userId]: response.data.clerkInfo.publicMetadata,
            }));
            console.log(response.data[0].length);
        } catch (error) {
            console.error(`Error obteniendo las respuestas del usuario ${userId}:`, error);
        }
    };

    const getUserResponses = async (userId) => {
        try {
            const response = await axios.post(apiUrls.userResponses, { ID_cliente: userId });
            setUserResponses(prevResponses => ({
                ...prevResponses,
                [userId]: response.data[0],
            }));
        } catch (error) {
            console.error(`Error obteniendo las respuestas del usuario ${userId}:`, error);
        }
    };

    useEffect(() => {
        axios.get(apiGetUsers)
            .then(response => {
                const usuarios = response.data;
                setData(usuarios);
                const metadataInicial = {};
                usuarios.forEach((usuario) => {
                    const metadata = usuario.publicMetadata || { accesoTest: '-', estadoTest: '-', tipoUsuario: '-' };
                    metadataInicial[usuario.Id_usuario] = metadata;
                });
                setUserMetadata(metadataInicial);
                usuarios.forEach(user => getUserResponses(user.Id_usuario));
            })
            .catch(error => {
                console.error('Error al obtener datos de la API:', error);
            });
    }, []);

    const handleDelete = async (userId) => {
        try {
            const updatedData = await deleteUser(userId);
            setData(updatedData);
        } catch (error) {
            // Manejar el error si ocurre algún problema al eliminar el usuario
        }
    };

    const handleUpdateUser = async () => {
        console.log("VOYA EDITAR USUARIO");
        try {
            const response = await axios.post(apiUrls.updateUser, { userData: editingUser });
            if (response.error) {
                console.log(response.error);
            } else {
                const updatedResponse = await axios.get(apiUrls.getAllUsers);
                setData(updatedResponse.data);
                console.log('Respuesta de la API:', response.data);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const handleCreate = async () => {
        try {
            console.log("nuevo user", user);
            const response = await axios.post(apiUrls.nuevoCliente, { userData: user });
            if (response.error) {
                console.log(response.error);
            } else {
                const updatedResponse = await axios.get(apiUrls.getAllUsers);
                setData(updatedResponse.data);
                console.log('Respuesta de la API:', response.data);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const handleUserDetail = (userId) => {
        var id_buscado = userId;
        var registro_encontrado = data.find(function (registro) {
            return registro.ID === id_buscado;
        });
        setUserDetail(registro_encontrado);
    };

    const handleRestoreTest = (userId) => {
        axios.post(apiUrls.restoreTest, { id_usuario: userId })
            .then(response => {
                console.log(response.data);
                return response.data;
            })
            .catch(error => {
                console.error('Error al restaurar el test:', error);
                return false;
            });
    };

    return (
        <>
            <UserManageView
                users={data}
                userResponses={userResponses}
                handleDelete={handleDelete}
                handleCreate={handleCreate}
                handleRestoreTest={handleRestoreTest}
                setUser={setUser}
                user={user}
                userMetadata={userMetadata}
                clave={clave}
                handleUserDetail={handleUserDetail}
                userDetail={userDetail}
                userRestoreData={userRestoreData}
                SetuserRestoreData={SetuserRestoreData}
                dataUserDelete={dataUserDelete}
                setDataUserDelete={setDataUserDelete}
                handleUpdateUser={handleUpdateUser}
                renewMembership={renewMembership}
                membershipOptions={membershipOptions}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
            />
        </>
    );
};

export default UsuariosManage;
