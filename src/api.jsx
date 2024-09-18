
//const baseUrl = process.env.REACT_APP_URL_LOCAL;
// ...

//const baseUrl = 'http://localhost:3001';
//const baseUrl = 'http://3.20.112.197:3001';
const baseUrl = import.meta.env.VITE_APP_LOCAL_IP;
const usersUrl = `${baseUrl}/users`;
const questionsUrl = `${baseUrl}/questions`;
const chatbotUrl = `${baseUrl}/chatbot`;
const excelUrl = `${baseUrl}/sheets`;
const ticketsUrl = `${baseUrl}/tickets`;
const ingebotUrl = `${baseUrl}/ingebot`;
const productsUrl = `${baseUrl}/products`; 

const sheetstUrl = `${baseUrl}/sheets`;

const canchasUrl = `${baseUrl}/canchas`;

const calendarioUrl = `${baseUrl}/calendario`;
const soporteUrl = `${baseUrl}/soporte`;
const insumosUrl = `${baseUrl}/insumos`;

const sincroUrl = `${baseUrl}/sincro`;

const cuentasUrl = `${baseUrl}/cuentas`;




// apiUrls.js
const apiUrls = {
    getAllUsers: `${usersUrl}/getAllUsers`,
    addUser: `${usersUrl}/addvalidated`, 
    addUserMerged: `${usersUrl}/addmerged`, 
    deleteUser: `${usersUrl}/deleteUser`,
    infoUser: `${usersUrl}/infoUser`,
    crearUsuario: `${excelUrl}/crearUsuario`,
    enviarUsuario: `${excelUrl}/enviarUsuario`,
    
    validateCode: `${usersUrl}/validate`,
    changeTestState: `${usersUrl}/testState`,
    iniciarSesion: `${usersUrl}/iniciarSesion`,
    actualizarContrasena: `${usersUrl}/updatepassword`,

    
    validarTest: `${usersUrl}/validarTest`,
    
    generateUniqueCode: `${usersUrl}/generateUniqueCode`,

    getQuestions: `${questionsUrl}/all`,
    getUserChatgpt: `${questionsUrl}/getUserChatgpt`,
    resultados: `${questionsUrl}/resultados`,
    updateAnswer: `${questionsUrl}/addOrUpdateResponse`,
    updateAnswer2: `${questionsUrl}/addOrUpdateResponse2`,
    updateAnswer3: `${questionsUrl}/addOrUpdateResponse3`,
    userResponses: `${questionsUrl}/userResponses`,
    getuserResponsesContext: `${questionsUrl}/getuserResponsesContext`,
    getuserResponsesGeneral: `${questionsUrl}/getuserResponsesGeneral`,
    getuserResponsesQuestions: `${questionsUrl}/getuserResponsesQuestions`,
    cambiarDato: `${questionsUrl}/cambiarDato`,

    
    getContexts: `${questionsUrl}/getContexts`,
    getGeneral: `${questionsUrl}/getGeneral`,
    consultaGPT: `${chatbotUrl}/consultaGPT`,
    actualizarConsulta: `${chatbotUrl}/actualizarConsulta`,
   // insertarMensaje: `${chatbotUrl}/insertarMensaje`,

   getOrderListShopify: `${ticketsUrl}/getOrderListShopify`,
   getOrderListShopifySolo: `${ticketsUrl}/getOrderListShopifySolo`,
   confirmarOrden: `${ticketsUrl}/confirmarOrden`,

    getShopifyOrders: `${ticketsUrl}/getShopifyOrders`,
    getAllTickets: `${ticketsUrl}/getTicketWithDetails`,

    obtenerConversaciones: `${ingebotUrl}/obtenerConversaciones`,
    obtenerResumenDeConversaciones: `${ingebotUrl}/obtenerResumenDeConversaciones`,
    insertarMensaje: `${ingebotUrl}/insertarMensaje`,
    
    getAllProducts: `${productsUrl}/getAllProducts`,
    obtenerProveedores: `${productsUrl}/obtenerProveedores`,

    revisarConversaciones: `${ingebotUrl}/revisarConversaciones`,
    revisarEstadoChatbot: `${ingebotUrl}/revisarEstadoChatbot`,
    cambiarEstadoChatbot: `${ingebotUrl}/cambiarEstadoChatbot`,
    getTablaTareasUsuario: `${sheetstUrl}/getTablaTareasUsuario`,
    obtenerConversacionesEstado:`${ingebotUrl}/obtenerConversacionesEstado`,
    obtenerConversacionesUsuario:`${ingebotUrl}/obtenerConversacionesUsuario`,
    obtenerEstadisticasConversacion:`${ingebotUrl}/obtenerEstadisticasConversacion`,
    analizaConversacion:`${ingebotUrl}/analizaConversacion`,

 
    
    generarTorneo:`${canchasUrl}/generarTorneo`,
    generarTorneoJornadas:`${canchasUrl}/generarTorneoJornadas`,
    consultaListaTorneos:`${canchasUrl}/consultaListaTorneos`,
    consultaPartidos:`${canchasUrl}/consultaPartidos`,
    actualizarPartido:`${canchasUrl}/actualizarPartido`,
    actualizarGoles:`${canchasUrl}/actualizarGoles`,
    finalizarPartido:`${canchasUrl}/finalizarPartido`,
    generarRonda:`${canchasUrl}/generarRonda`,
    consultaEstadisticasEquipos:`${canchasUrl}/consultaEstadisticasEquipos`,

    nuevoCliente:`${usersUrl}/createUser`,
    updateUser:`${usersUrl}/updateUser`,
    updateUserCode:`${usersUrl}/updateUserCode`,
    checkCodeUniqueness:`${usersUrl}/checkCodeUniqueness`,

    
    createTicket: `${ticketsUrl}/createTicket`,
    addTicketDetails: `${ticketsUrl}/addTicketDetails`,
    finalizeTicket: `${ticketsUrl}/finalizeTicket`,
    getTicketsStats: `${ticketsUrl}/getTicketsStats`,


    listMemberships: `${productsUrl}/listMemberships`,
    actualizarProducto: `${productsUrl}/actualizarProducto`,
    agregarProducto: `${productsUrl}/agregarProducto`,
    agregarProveedor: `${productsUrl}/agregarProveedor`,
    agregarDesechable: `${productsUrl}/agregarDesechable`,
    editarProducto: `${productsUrl}/editarProducto`,
    eliminarProducto: `${productsUrl}/eliminarProducto`,
    listCategories: `${productsUrl}/listCategories`,
    registrarIngreso: `${productsUrl}/registrarIngreso`,
    getAllIngresos: `${productsUrl}/getAllIngresos`,

    

    getTicketDetailsById: `${ticketsUrl}/getTicketDetailsById`,
   
    login: `${usersUrl}/login`,

    getOrdersForFrontend: `${ticketsUrl}/getOrdersForFrontend`,
    listaMesas: `${ticketsUrl}/listaMesas`,
    getMeseroAndTicketByMesaId: `${ticketsUrl}/getMeseroAndTicketByMesaId`,
    gestionarNuevaOrden: `${ticketsUrl}/gestionarNuevaOrden`,
    accesoCodigo: `${usersUrl}/accesoCodigo`,
    pagarTicket: `${ticketsUrl}/pagarTicket`,
    limpiarMesa: `${ticketsUrl}/limpiarMesa`,
    imprimirCuenta: "http://localhost/KISSI-admin_3/Imprimir_cuenta_pos.php",
    generarFaseEliminatoria:`${canchasUrl}/generarFaseEliminatoria`,
    finalizarTorneo:`${canchasUrl}/finalizarTorneo`,
    eliminarTorneo:`${canchasUrl}/eliminarTorneo`,
    cancelarTorneo:`${canchasUrl}/cancelarTorneo`,
    calcularTotalesPorMetodo: `${ticketsUrl}/calcularTotalesPorMetodo`,
    createCorteTicket: `${ticketsUrl}/createCorteTicket`,
    createCorteTicketContado: `${ticketsUrl}/createCorteTicketContado`,
    asociarTicketsACorte: `${ticketsUrl}/asociarTicketsACorte`,

    createMovimientoTicket: `${ticketsUrl}/createMovimientoTicket`,

    cancelarItem: `${ticketsUrl}/cancelarItem`,

    restaurarItem: `${ticketsUrl}/restaurarItem`,

    cancelarTicket: `${ticketsUrl}/cancelarTicket`,

    restaurarTicket: `${ticketsUrl}/restaurarTicket`,

     
    getrecibo:`${canchasUrl}/getrecibo`,
    reporteCorte:`${ticketsUrl}/reporteCorte`,
    listarCortes:`${ticketsUrl}/listarCortes`,
    ticketPDF:`${ticketsUrl}/ticketPDF`,
    

    getCorteDetails:`${ticketsUrl}/getCorteDetails`,
    getTicketsStatsCorte:`${ticketsUrl}/getTicketsStatsCorte`,
    movimientosCorte:`${ticketsUrl}/movimientosCorte`,
    productosCorte:`${ticketsUrl}/productosCorte`,
    cancelacionesCorte:`${ticketsUrl}/cancelacionesCorte`,
    getFechaCorte:`${ticketsUrl}/getFechaCorte`,
    getTicketsPorCorte:`${ticketsUrl}/getTicketsPorCorte`,
    getVendedoresStatsPorCorte:`${ticketsUrl}/getVendedoresStatsPorCorte`,

    getCorteDetailsByDateRange:`${ticketsUrl}/getCorteDetailsByDateRange`,
    getTicketsStatsPorRango:`${ticketsUrl}/getTicketsStatsPorRango`,
    movimientosCortePorRango:`${ticketsUrl}/movimientosCortePorRango`,

    productosCortePorRango:`${ticketsUrl}/productosCortePorRango`,
    cancelacionesCortePorRango:`${ticketsUrl}/cancelacionesCortePorRango`,
    getCortesPorRango:`${ticketsUrl}/getCortesPorRango`,
    getCountCortesPorRango:`${ticketsUrl}/getCountCortesPorRango`,
    getVendedoresStatsPorRango:`${ticketsUrl}/getVendedoresStatsPorRango`,

    desagruparItem:`${ticketsUrl}/desagruparItem`,

    obtenerEventos:`${calendarioUrl}/obtenerEventos`,

    obtenerDisponibilidad:`${calendarioUrl}/obtenerDisponibilidadPorFecha`,
    obtenerTodaLaDisponibilidad:`${calendarioUrl}/obtenerTodaLaDisponibilidad`,

    cambiarEstadoCita:`${calendarioUrl}/cambiarEstadoCita`,
    agregarEvento:`${calendarioUrl}/agregarEvento`,
    obtenerServicios:`${calendarioUrl}/obtenerServicios`,  
    obtenerDisponibilidadReal:`${calendarioUrl}/obtenerDisponibilidadReal`,    
    obtenerDisponibilidadRealPorFecha:`${calendarioUrl}/obtenerDisponibilidadRealPorFecha`,    
    obtenerHorarios:`${calendarioUrl}/obtenerHorarios`,    
    agregarDisponibilidad:`${calendarioUrl}/agregarDisponibilidad`,   
    editarDisponibilidad :`${calendarioUrl}/editarDisponibilidad`,   
    editarAgregarDisponibilidad:`${calendarioUrl}/editarAgregarDisponibilidad`, 
    eliminarEvento:`${calendarioUrl}/eliminarEvento`, 
    editarEvento:`${calendarioUrl}/editarEvento`, 

    getReporte:`${canchasUrl}/getreportmembresias`,
    getReporteTorneo:`${canchasUrl}/getreport`,

    etiquetaPDF: `${productsUrl}/etiquetaPDF`,
    ejecutarComando: `${soporteUrl}/ejecutarComando`,

    crearTicketSoporte: `${soporteUrl}/crearTicketSoporte`,
    obtenerTicketsSoporte: `${soporteUrl}/obtenerTicketsSoporte`,
    
    accesoGeneral: `${usersUrl}/accesoGeneral`,

    
    obtenerTotalPorMesa: `${ticketsUrl}/obtenerTotalPorMesa`,
 

    getAllInsumos: `${insumosUrl}/getAllProducts`,


    cambiarColorLED: `${sincroUrl}/cambiarColorLED`,
    controlarGPIO: `${sincroUrl}/controlarGPIO`,

    listarCuentas: `${cuentasUrl}/listarCuentas`,
    agregarCuenta: `${cuentasUrl}/agregarCuenta`,
    actualizarCuenta: `${cuentasUrl}/actualizarCuenta`,
    eliminarCuenta: `${cuentasUrl}/eliminarCuenta`,
 
};

export default apiUrls;
