import React from 'react';
import { useState, useEffect } from 'react';
import UserManageView from "./torneosManage-View";
import axios from 'axios';
import apiUrls from '../../../api';

const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(apiUrls.deleteUser, {
            data: { id_usuario: userId }
        });

        console.log(`Usuario con ID ${userId} eliminado exitosamente`);

        // Volver a solicitar los datos después de la eliminación
        const updatedResponse = await axios.get(apiUrls.getAll);
        return updatedResponse.data;
    } catch (error) {
        console.error(`Error al eliminar el usuario con ID ${userId}:`, error);
        throw error; // Re-lanza el error para que pueda ser manejado por el componente
    }
};


const TorneosManage = () => {
    const [data, setData] = useState([]);
    const [user, setUser] = useState({
        Nombre_usuario: '',
        Apellido_usuario: '',
        Correo_usuario: '',
        Telefono_usuario: '',
        Donde_estudiar: '',
        Estado_usuario: '',
        Ciudad_usuario: '',
        publicMetadata: {},

    });

    const [userDetail, setUserDetail] = useState({});

    const [dataUserDelete, setDataUserDelete] = useState({});

    const [clave, setClave] = useState('');

    const apiGetUsers = apiUrls.getAll;
    const [userResponses, setUserResponses] = useState({});
    const [userLastResponse, setUserLastResponse] = useState({});
    const [userRestoreData, SetuserRestoreData] = useState({});

    
    const [userMetadata, setUserMetadata] = useState([]);



    const [torneos, setTorneos] = useState([]);
    const [partidos, setPartidos] = useState([]);

    

    const getUserMetada = async(userId) => {
         try {
            const response = await axios.post(apiUrls.infoUser, {
                ID_cliente: userId
            });
            
            setUserMetadata(prevResponses => ({
                ...prevResponses,
                [userId]: response.data.clerkInfo.publicMetadata,
            }));
            console.log(response.data[0].length)
        } catch (error) {
            console.error(`Error obteniendo las respuestas del usuario ${userId}:`, error);
        }
    };

    const getUserResponses = async(userId) => {
 
        try {
            const response = await axios.post(apiUrls.userResponses, {
                ID_cliente: userId
            });
            setUserResponses(prevResponses => ({
                ...prevResponses,
                [userId]: response.data[0],
            }));
         
        } catch (error) {
            console.error(`Error obteniendo las respuestas del usuario ${userId}:`, error);
        }
    };
    
    const obtenerPartidos = async (torneoId) => {
        try {
            const response = await axios.post(apiUrls.consultaPartidos, {
                torneoId: torneoId,
                ronda: 1
            });
    
            console.log(`PARTIDOS response para torneo ${torneoId}:`, response.data);
            // Asegúrate de que cada partido tiene el TorneoID esperado
            const partidosFiltrados = response.data.filter(partido => partido.TorneoID.toString() === torneoId.toString());
            setPartidos(prevPartidos => ({
                ...prevPartidos,
                [torneoId]: partidosFiltrados
            }));
        } catch (error) {
            console.error(`Error obteniendo los partidos del torneo ${torneoId}:`, error);
        }
    };
    
    useEffect(() => {
        axios.post(apiUrls.consultaListaTorneos)
            .then(response => {
                const responseTorneos = response.data;
                console.log("Torneos cargados:", responseTorneos);
                setTorneos(responseTorneos);
            })
            .catch(error => {
                console.error('Error al obtener datos de la API consultaListaTorneos:', error);
            });
    }, []);
    
    useEffect(() => {
        console.log("Torneos en estado tras carga:", torneos);
        torneos.forEach(torneo => {
            console.log(`Cargando partidos para el torneo ${torneo.ID}`);
            obtenerPartidos(torneo.ID);
        });
    }, [torneos]);
    
    useEffect(() => {
        axios.get(apiGetUsers)
            .then(response => {
                const usuarios = response.data;
                setData(usuarios);
    
                const metadataInicial = {};
    
                usuarios.forEach((usuario) => {
                    const metadata = usuario.publicMetadata || { accesoTest: '-', estadoTest: '-', tipoUsuario: '-' };
    
                    if ('accesoTest' in metadata) {
                        
                    } else {
                       
                    }
    
                    if ('estadoTest' in metadata) {
                       
                    } else {
                      
                    }
    
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

    const handleCreate = async () => {
        try {
            // Hacer la solicitud POST a la API utilizando Axios
            const response = await axios.post(apiUrls.addUser, user);
            if (response.error) {
                // Mostrar el mensaje de error al usuario
                alert(response.error);
            } else {
            setClave(response.data);

            // Volver a solicitar los datos después de la creación
            const updatedResponse = await axios.get(apiUrls.getAll);
            setData(updatedResponse.data);
          
            // Hacer algo con la respuesta de la API
            console.log('Respuesta de la API:', response.data);
          }} catch (error) {
            // Manejar errores de la API o de red
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const handleUserDetail = (userId) => {
        // Asigna el userId a la variable id_buscado
        var id_buscado = userId;

        // Utiliza la función find para buscar el registro con el Id_usuario especificado
        var registro_encontrado = data.find(function (registro) {
            return registro.Id_usuario === id_buscado;
        });

        // envío los datos al usestate userDetail
        setUserDetail(registro_encontrado);
    };

    const handleRestoreTest = (userId) => {
        //llamo a la api restoretest y le envío el id del usuario
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

    const fetchAndSetTorneos = async () => {
        try {
            const responseTorneos = await axios.post(apiUrls.consultaListaTorneos);
            console.log("Torneos actualizados:", responseTorneos.data);
            setTorneos(responseTorneos.data);
    
            // También actualizamos los partidos para cada torneo actualizado
            responseTorneos.data.forEach(torneo => {
                obtenerPartidos(torneo.ID);
            });
        } catch (error) {
            console.error('Error al obtener datos de torneos actualizados:', error);
        }
    };
    
    return (
        <>
            {/* Pasar los datos al componente UserManageView */}
        <UserManageView
            users={data}
            torneos={torneos}
            partidos={partidos}
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
                fetchAndSetTorneos={fetchAndSetTorneos}
            />
        </>
    );
};

export default TorneosManage;