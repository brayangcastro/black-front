import {  useRef,useState, useEffect } from 'react';
import ChatbotView from './chatbot-view'
import axios from 'axios'
import apiUrls from '../../../api';
 
const parseDateString = (dateString) => {
  // Dividir la fecha y la hora
  const parts = dateString.split(' ');
  const dateParts = parts[0].split('-');
  const timeParts = parts[1].split(':');

  // Crear un objeto Date con los componentes de la fecha y hora
  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);
};
const getLastActivityOfUsers = (allMessages) => {
  const lastActivity = {};
  allMessages.forEach(message => {
      const user = message.Origen === "Chatbot" ? message.Destino : message.Origen;
      const messageDate = parseDateString(message.Fecha);
      if (!lastActivity[user] || lastActivity[user] < messageDate) {
          lastActivity[user] = messageDate;
      }
  });
  return lastActivity;
};
 
const Chatbot = () => {

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

    useEffect(() => {
        axios.post(apiUrls.obtenerConversaciones)
            .then(response => {
                const dataReceived = response.data;
                console.log("dataReceived", dataReceived);
                setData(dataReceived);
                const userConversations = {};
                dataReceived.forEach(item => {
                    const userId = item.Origen === "Chatbot" ? item.Destino : item.Origen;
                    if (!userConversations[userId]) {
                        userConversations[userId] = [];
                    }
                    userConversations[userId].push(item);
                });
                setUsers(Object.keys(userConversations).map(id => ({ id, name: id })));
            })
            .catch(error => {
                console.error('Error al obtener datos de la API:', error);
            });
    }, []);
   
 
      const onUserSelect = userId => {
        setActiveUser(userId); // Establecer el usuario activo
        setActivePhoneNumber(userId);
        const selectedUserConversations = data.filter(item => 
            item.Origen === userId || item.Destino === userId
        );
        setConversation(selectedUserConversations);
    };    
    return (
        
        <ChatbotView
            context={context}
            onContextChange={setContext}
            chatbotStatus={chatbotStatus}
            lastConversation={lastConversation}
            userCount={userCount}
            users={users}
            conversation={conversation}
            onUserSelect={onUserSelect}
            handleSendMessage={handleSendMessage}
            activeUser={activeUser}
            resumen={resumen}
            isChatbotConnected={isChatbotConnected}
            toggleChatbotConnection={toggleChatbotConnection}
            handleActiveMessageChange={handleActiveMessageChange}
            
            activeMessage={activeMessage}
            // users={users} // Pasar si es necesario
            // conversation={conversation} // Pasar si es necesario
            />
    );
};

export default Chatbot;
