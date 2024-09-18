import { useState, useEffect } from 'react'
import { ConversManageView } from './conversManage-View'

import axios from 'axios';
import apiUrls from '../../../api';

import HeaderComponent from './HeaderComponent';

function getAllConvers() {
    // Estado para almacenar los datos de la API
    const [convers, setConvers] = useState([]);
 
    // Función para hacer la solicitud a la API
    const fetchData = async () => {
 
 

        try {
             const resultados = await axios.post( apiUrls.obtenerConversacionesEstado); 
            console.log(resultados.data);
            setConvers(resultados.data);
             const conversaciones = resultados.data;  
             return conversaciones;
 
           
        } catch (error) {
            // Captura cualquier error que ocurra durante el proceso y lo imprime en la consola
            console.error("Error al obtener el estado de las conversaciones:", error);
           
        }

    };

    // Llamar a la función fetchData al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    //console.log(orders);
    return convers;
}


const ConversManage = () => {

   
  const [ws, setWs] = useState(null);
 
  useEffect(() => {
    const connectWebSocket = () => {
        const socket = new WebSocket('ws://localhost:3001'); // Asegúrate de cambiar esta URL por la de tu servidor WebSocket
        setWs(socket);

        socket.onopen = () => {
            console.log('Conectado al servidor WebSocket'); // Este mensaje se mostrará en la consola del navegador
            // Aquí puedes agregar cualquier otra lógica que necesites ejecutar una vez establecida la conexión
        };

        socket.onclose = () => {
            console.log('Conexión WebSocket cerrada. Intentando reconectar...');
            // Reintenta conectar después de un retardo
            setTimeout(() => {
                connectWebSocket();
            }, 5000); // Reintenta cada 5 segundos
        };

        socket.onerror = (error) => {
            console.error('Error en la conexión WebSocket:', error);
        };

        // Asegúrate de manejar los mensajes entrantes y los errores adecuadamente
        socket.onmessage = (event) => {
            console.log('Mensaje del servidor:', event.data);
            // Aquí puedes agregar el manejo de los mensajes entrantes
        };
    };

    connectWebSocket();

    // Asegúrate de limpiar y cerrar la conexión WebSocket cuando el componente se desmonte
    return () => {
        if (ws) {
            ws.close();
        }
    };
}, []); // Sin dependencias, asegura que esto se ejecute solo una vez al montar el componente


  const sendMessage = () => {
    if (ws) {
      ws.send('Hola servidor');
    }
  };
    const [data, setData] = useState([]);
    const [context, setContext] = useState('Descripcion del negocio');
    const [chatbotStatus, setChatbotStatus] = useState('Activo');
    const [lastConversation, setLastConversation] = useState('No hay conversaciones recientes.');
    const [userCount, setUserCount] = useState(0);
    // const [users, setUsers] = useState([]); // Si necesitas una lista de usuarios
    // const [conversation, setConversation] = useState([]); // Si necesitas mantener un registro de la conversación

    const [activeUser, setActiveUser] = useState(null);
    const [isChatbotConnected, setIsChatbotConnected] = useState(true); // Asume que está conectado por defecto
    const [activeMessage, setActiveMessage] = useState('');
    const [activePhoneNumber, setActivePhoneNumber] = useState('');

    const handleSendMessage = async () => {
      const messageToSend = {
        Destino: activePhoneNumber, // o el identificador de chat activo
        Info: activeMessage
    };

      try {
        const response = await axios.post(apiUrls.insertarMensaje, messageToSend);
        console.log(response.data);
 
          const newMessage = {
            // Asegúrate de estructurar el mensaje como lo espera tu conversación actual
            Origen: 'Chatbot', // Cambia esto por el identificador de origen correcto
            ...messageToSend,
            Fecha: new Date().toISOString(), // O la fecha que retorna tu API
            // Incluye cualquier otra información necesaria para el mensaje
        };
          // Limpia el mensaje después de enviarlo
          setConversation(prevConversation => [...prevConversation, newMessage]);
          setActiveMessage('');
          // Manejo de la respuesta exitosa
      } catch (error) {
          console.error(`Error al enviar mensaje:`, error);
          // Manejo del error
      }
  };

  // ...resto del componente...

  // Función para actualizar el estado con el mensaje del input
  const handleActiveMessageChange = (message) => {
      setActiveMessage(message);
  };

 
  
    const toggleChatbotConnection = () => {
        // Aquí podrías llamar a una API para activar/desactivar el chatbot si es necesario
        setIsChatbotConnected(!isChatbotConnected);
      };
      
    const [users, setUsers] = useState([ ]);
    const [conversation, setConversation] = useState([ ]);
    useEffect(() => {
      // Suponiendo que tienes una llamada a la API que trae la data de los usuarios y conversaciones
      // Cuando la data esté lista, ordena los usuarios basándose en la última actividad
      if(data && data.length > 0) {
        const lastActivity = getLastActivityOfUsers(data);
        const sortedUsers = [...users].sort((a, b) => {
          // Asegúrate de manejar casos donde no haya última actividad conocida con '0' o alguna fecha base.
          return (lastActivity[b.id] || new Date(0)) - (lastActivity[a.id] || new Date(0));
        });
    
        setUsers(sortedUsers);
      }
    }, [data]); // Dependencia en la data cargada, ajusta según cómo estés cargando tus datos
    
    const [resumen, setResumen] = useState({
        totalMensajes: 0,
        totalUsuarios: 0,
        mensajesRecientes: 0
      });
      
      useEffect(() => {
        // Suponiendo que tienes una función en tu API para obtener el resumen
        const obtenerResumen = async () => {
          try {
            const resumen = await axios.post(apiUrls.obtenerResumenDeConversaciones);
            setResumen(resumen.data);
          } catch (error) {
            console.error('Error al obtener el resumen:', error);
          }
        };
      
        obtenerResumen();
      }, []);

 
   
     
    const allConvers = getAllConvers();
    console.log("allConvers",allConvers)
  
    
    const activarChatbot = async (celular) => {
        try {
            const response = await axios.post(apiUrls.activarChatbot, { celular });
            console.log("Chatbot activado:", response.data);
            // Aquí podrías actualizar el estado de tu aplicación si es necesario
        } catch (error) {
            console.error("Error al activar el chatbot:", error);
            // Manejo de errores, por ejemplo, mostrar un mensaje al usuario
        }
    };

    const desactivarChatbot = async (celular) => {
        try {
            const response = await axios.post(apiUrls.desactivarChatbot, { celular });
            console.log("Chatbot desactivado:", response.data);
            // Aquí podrías actualizar el estado de tu aplicación si es necesario
        } catch (error) {
            console.error("Error al desactivar el chatbot:", error);
            // Manejo de errores
        }
    };
    const obtenerConversacionesUsuario = async (cell) => {
    
        try {
            const response = await axios.post(apiUrls.obtenerConversacionesUsuario, {
                cell:cell  
            });
            
            if (response.status === 200) {
                const data = response.data;
                return data;
            } else {
                throw new Error('Respuesta no exitosa del backend para obtenerConversacionesUsuario');
            }
        } catch (error) {
            console.error('Error al obtener el submenú:', error);
            throw error;
        }
    };
    
    
    const obtenerEstadisticasConversacion = async (cell) => {
        
        try {
            const response = await axios.post(apiUrls.obtenerEstadisticasConversacion, {
                cell:cell  
            });
            
            if (response.status === 200) {
                const data = response.data;
                return data;
            } else {
                throw new Error('Respuesta no exitosa del backend para obtenerEstadisticasConversacion');
            }
        } catch (error) {
            console.error('Error al obtener el submenú:', error);
            throw error;
        }
    };
    
    const analizaConversacion = async (cell) => {
        
        try {
            const response = await axios.post(apiUrls.analizaConversacion, {
                cell:cell  
            });
            
            if (response.status === 200) {
                const data = response.data;
                return data;
            } else {
                throw new Error('Respuesta no exitosa del backend para analizaConversacion');
            }
        } catch (error) {
            console.error('Error al obtener el submenú:', error);
            throw error;
        }
    };
    
    
    
    const [totalConversaciones, setTotalConversaciones] = useState(0);
    const [totalEntrantes, setTotalEntrantes] = useState(0);
    const [totalSalientes, setTotalSalientes] = useState(0);
  
    // Estado para conexión WebSocket
    const [isConnected, setIsConnected] = useState(false);
      // Función para hacer la solicitud a la API
      const fetchData = async () => {
 


        try {
             const resultados = await axios.post( apiUrls.obtenerConversacionesEstado); 
            console.log(resultados.data);
            setConvers(resultados.data);
             const conversaciones = resultados.data;  


    // Aquí calculas los totales basándote en `resultados.data`
    const totalConvers = resultados.data.length;
    let entrantes = 0;
    let salientes = 0;

    resultados.data.forEach(conversacion => {
        conversacion.Stats.forEach(stat => {
            if (stat.messageType === 'incoming') {
                entrantes += stat.count;
            } else if (stat.messageType === null) {
                salientes += stat.count;
            }
        });
    });

    setTotalConversaciones(totalConvers);
    setTotalEntrantes(entrantes);
    setTotalSalientes(salientes);

          
        } catch (error) {
            // Captura cualquier error que ocurra durante el proceso y lo imprime en la consola
            console.error("Error al obtener el estado de las conversaciones:", error);
           
        }

    };

    // Llamar a la función fetchData al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <HeaderComponent
        totalConversaciones={totalConversaciones}
        totalEntrantes={totalEntrantes}
        totalSalientes={totalSalientes}
        isConnected={isConnected}
    />
        <ConversManageView
        allConvers={allConvers}
        obtenerConversacionesUsuario={obtenerConversacionesUsuario}
        obtenerEstadisticasConversacion={obtenerEstadisticasConversacion}
        analizaConversacion={analizaConversacion}
        
        
        />
           </>
    )
}




export default ConversManage