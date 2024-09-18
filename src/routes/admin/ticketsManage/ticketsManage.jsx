import { useState, useEffect } from 'react'

import {  useNavigate } from 'react-router-dom';
import { TicketsManageView } from './ticketsManage-View'

import axios from 'axios';
import apiUrls from '../../../api';
import { useUser } from '/src/UserContext'; // Asegúrate de que la ruta sea correcta

const saveEvento = async (evento) => {
  try {
    const response = await axios.post(apiUrls.agregarEvento, { evento });
    console.log('Evento agregado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al agregar evento:', error);
    throw error;
  }
};

// Use getAllTickets como un custom hook fuera del componente TicketsManage
function useAllTickets() {


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrls.getAllTickets);
        // Asegurar que siempre se establezca un arreglo, incluso si la API retorna undefined o null
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        setOrders([]); // En caso de error, también se establece orders a un arreglo vacío
      }
    };

    fetchData();
  }, []); // Dependencias vacías para correr solo en el montaje

  return orders; // Retorna los tickets y la función para refrescar

}



const TicketsManage = () => {

  
  const navigate = useNavigate();
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Si 'user' está vacía o no cumple con las condiciones necesarias
    if (!user || Object.keys(user).length === 0) {
        // Redirige a la pantalla de bloqueo
        navigate('/lockscreen');
    }
}, [user, navigate]); // Asegúrate de incluir 'navigate' en la lista de dependencias


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrls.getAllTickets);
        // Asegurar que siempre se establezca un arreglo, incluso si la API retorna undefined o null
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        setOrders([]); // En caso de error, también se establece orders a un arreglo vacío
      }
    };

    fetchData();
  }, []); // Dependencias vacías para correr solo en el montaje

  const [cortes, setCortes] = useState([]);


  const fetchAllTickets = async () => {
    try {
        const response = await axios.get(apiUrls.getAllTickets);
        setOrders(response.data || []);
    } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        setOrders([]);
    }
};

  useEffect(() => {
    const fetchCortes = async () => {
      try {
        const response = await axios.post(apiUrls.listarCortes);
        console.log("listarCortes", response.data)
        // Asegurar que siempre se establezca un arreglo, incluso si la API retorna undefined o null
        setCortes(response.data || []);

      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        setCortes([]); // En caso de error, también se establece orders a un arreglo vacío
      }
    };

    fetchCortes();
  }, []); // Dependencias vacías para correr solo en el montaje

  const [ticketStats, setTicketStats] = useState({
    totalCorte: 0,
        totalTickets: 0,
        promedioTicket: 0,
        totalVenta: 0,
        totalEntradas: 0,
        totalSalidas: 0,
        balanceMovimientos: 0,
        totalEmpleados:0
  });

  const [totalesCalculados, setTotalesCalculados] = useState({
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    cheque: 0,
    vales: 0,
    totalEmpleados:0,
    movimientos:0,
    ajusteCorte:0
  });


  const allTickets = orders;


  const fetchTicketStats = async () => {
    try {
      console.log("intentandapiUrls.getTicketStatso", apiUrls.getTicketsStats)
      const response = await axios.post(apiUrls.getTicketsStats);
      console.log("getticketstasts", response.data)
      if (response.data) {
        setTicketStats({
          totalCorte: response.data.totalCorte,
          conteoTotal: response.data.conteoTotal,
          promedioTicket: response.data.averageTicket,
          totalVenta: response.data.totalVentas,
          totalEntradas: response.data.totalEntradas,
          totalSalidas: response.data.totalSalidas,
          balanceMovimientos: response.data.balanceMovimientos,
          totalEmpleados:response.data.totalEmpleados
        });
      }
    } catch (error) {
      console.error('Error al obtener estadísticas de tickets:', error);
    }
  };
  // Estado para almacenar los detalles del ticket seleccionado
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);

  // Función para obtener los detalles de un ticket específico
  const fetchTicketDetails = async (ticketId) => {
    try {
      console.log('/getTicketWithDetails', apiUrls.getTicketDetailsById);
      const response = await axios.post(`${apiUrls.getTicketDetailsById}`,
        {
          ticketId
        });
      console.log("respuestaticvketdetail", response.data)
      setSelectedTicketDetails(response.data);
    } catch (error) {
      console.error('Error al obtener detalles del ticket:', error);
      setSelectedTicketDetails(null);
    }
  };

  // Llama a esta función dentro de un useEffect para cargar los datos al montar el componente
  useEffect(() => {
    fetchTicketStats();
    // otras llamadas a funciones de inicialización si son necesarias
  }, []);





  const processTransaction = async (transactionType, details, paymentMethods, comments) => {
    try {
      console.log("processTransaction", transactionType, details, paymentMethods, comments)
      // Aquí deberías calcular los totales por método de pago como espera tu backend.
      let totalEfectivo = 0;
      let totalTarjeta = 0;
      let totalTransferencia = 0;
      let totalVale = 0;
      let totalCheque = 0;

      // Calcular totales basados en paymentMethods
      paymentMethods.forEach(pm => {
        let amount = parseFloat(pm.amount.replace(/,/g, '')); // Elimina comas y convierte a float
        switch (pm.method) {
          case 'Efectivo':
            totalEfectivo += amount;
            break;
          case 'Tarjeta':
            totalTarjeta += amount;
            break;
          case 'Transferencia':
            totalTransferencia += amount;
            break;
          case 'Vale':
            totalVale += amount;
            break;
          case 'Cheque':
            totalCheque += amount;
            break;
          default:
          // Manejar error o caso no esperado
        }
      });
      const dataToSend = {
        Tipo: transactionType,
        Vendedor: 1, // Asegúrate de obtener este dato desde donde sea necesario
        Cliente: 1, // Asegúrate de obtener este dato desde donde sea necesario
        totalEfectivo,
        totalTarjeta,
        totalTransferencia,
        totalVale,
        totalCheque,
        Nota: comments
      };

       await axios.post(apiUrls.createMovimientoTicket, dataToSend);
       
      const response = await axios.get(apiUrls.getAllTickets);
      setOrders(response.data || []);
        // Actualiza las estadísticas de los tickets
        await fetchTicketStats();

    } catch (error) {
      console.error('Error al realizar el corte:', error);
    }
  };

  const getTimeSlot = (date, availableSlots) => {
    let closestSlot = availableSlots[0];

    for (let i = 0; i < availableSlots.length; i++) {
      const slot = availableSlots[i];
      const [start, end] = slot.split(' - ').map(time => {
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':').map(Number);
        if (period.toLowerCase() === 'pm' && hours < 12) hours += 12;
        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
      });

      if (date >= start && date < end) {
        return slot;
      }

      if (date >= end && i < availableSlots.length - 1) {
        const nextSlot = availableSlots[i + 1];
        const nextStart = nextSlot.split(' - ')[0];
        const [nextTimeString, nextPeriod] = nextStart.split(' ');
        let [nextHours, nextMinutes] = nextTimeString.split(':').map(Number);
        if (nextPeriod.toLowerCase() === 'pm' && nextHours < 12) nextHours += 12;
        if (nextPeriod.toLowerCase() === 'am' && nextHours === 12) nextHours = 0;
        const nextSlotStartDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), nextHours, nextMinutes);

        if (date < nextSlotStartDate) {
          return nextSlot;
        }
      }
    }

    return availableSlots[availableSlots.length - 1];
  };

  
  const realizarCorte = async (pagos, totalContado, movimientos, nota, ajusteCorte) => {
    try {



      const response = await axios.post(apiUrls.createCorteTicket, {
        totalEfectivo: totalesCalculados.efectivo,
        totalTarjeta: totalesCalculados.tarjeta,
        totalTransferencia: totalesCalculados.transferencia,
        totalCheque: totalesCalculados.cheque,
        totalVale: totalesCalculados.vales,
        usuario:user.ID,
                movimientos:movimientos,
                nota:nota,
                ajusteCorte:ajusteCorte,
                totalEmpleados:pagos.totalEmpleados
      });
      console.log("createCorteTicket", response.data);
      let UltimoCorteId = response.data;
      const response2 = await axios.post(apiUrls.createCorteTicketContado, {
        totalEfectivo: pagos.efectivo,
        totalTarjeta: pagos.tarjeta,
        totalTransferencia: pagos.transferencia,
        totalCheque: pagos.cheque,
        totalVale: pagos.vales,
        corteId:UltimoCorteId
      });
      console.log("createCorteTicketContado", response2.data);

      const response3 = await axios.post(apiUrls.asociarTicketsACorte, {
        corteId: UltimoCorteId
      });
      console.log("asociarTicketsACorte", response3.data);
      // Aquí podrías actualizar el estado de tu aplicación según sea necesario
      try {
        const response = await axios.post(apiUrls.listarCortes);
        console.log("listarCortes", response.data)
        // Asegurar que siempre se establezca un arreglo, incluso si la API retorna undefined o null
        setCortes(response.data || []);
      } catch (error) {
        console.error('Error al obtener datos de la API:', error);
        setOrders([]); // En caso de error, también se establece orders a un arreglo vacío
      }

      

      const corteId = UltimoCorteId; // Asegúrate de obtener el ID de la respuesta
      navigate(`/reportes/${corteId}`);

      return "Corte realizado con exito";
    } catch (error) {
      console.error('Error al realizar el corte:', error);
    }
  };

  const calcularTotalesPorMetodo = async () => {
    try {
        const response = await axios.post(apiUrls.calcularTotalesPorMetodo);
        if (response.data) {

            let totalEmpleados=await obtenerTotalPorMesa();

            setTotalesCalculados({
                efectivo: response.data.totalEfectivo,
                tarjeta: response.data.totalTarjeta,
                transferencia: response.data.totalTransferencia,
                vales: response.data.totalVale,
                cheque: response.data.totalCheque,
                totalEmpleados:totalEmpleados,
                movimientos:response.data.totalMovimientos,
                ajusteCorte:0
            });
         
        }
    } catch (error) {
        console.error('Error al realizar calcularTotalesPorMetodo:', error);
    }
};






  const obtenerTotalPorMesa = async () => {
    try {
        const response = await axios.post(apiUrls.obtenerTotalPorMesa, { nombreMesa:"PRV 8" });
        if (response.data) {
        
            return  response.data[0].TotalPorMesa;
          
        }
      
    } catch (error) {
        console.error('Error al realizar obtenerTotalPorMesa:', error);
    }
};

  // Llamar a fetchProducts al montar y actualizar el componente
  useEffect(() => {
    calcularTotalesPorMetodo();
  }, []);

  const cancelTicket = async (ticketId, cancelReason) => {
    try {
        await axios.post(apiUrls.cancelarTicket, { ticketId, cancelReason });
        const response = await axios.get(apiUrls.getAllTickets);
        setOrders(response.data || []);
    } catch (error) {
        console.error('Error al cancelar el ticket:', error);
    }
};

const restoreTicket = async (ticketId) => {
    try {
        await axios.post(apiUrls.restaurarTicket, { ticketId });
        const response = await axios.get(apiUrls.getAllTickets);
        setOrders(response.data || []);
    } catch (error) {
        console.error('Error al restaurar el ticket:', error);
    }
};
  return (
    <TicketsManageView
      allTickets={allTickets}

      ticketStats={ticketStats}
      realizarCorte={realizarCorte}
      fetchTicketDetails={fetchTicketDetails}
      totalesCalculados={totalesCalculados}
      processTransaction={processTransaction}
      fetchTicketStats={fetchTicketStats}
      cortes={cortes}
      cancelTicket={cancelTicket}
      restoreTicket={restoreTicket}
    />
  )
}

export default TicketsManage