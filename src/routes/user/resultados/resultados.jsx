// Resultados.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faChevronLeft, faChevronRight  ,faDownload, faRedo, faPaperPlane,faMobileAlt,faEnvelope,faCheck,faPrint} from '@fortawesome/free-solid-svg-icons';
import logoNeerd from './logo2.png';
import firma from './firma_neerd.png';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Importación necesaria para Chart.js 3+
 
import apiUrls from '../../../api';
 
import './LoadingSpinner.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

import './resultados.css';
import html2pdf from 'html2pdf.js';



const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p className="loading-text">Estamos procesando tu información, tus resultados serán enviados a tu correo y celular...</p>
  </div>
);

//export default LoadingSpinner;

 
// Arreglos con los nombres de los intereses y aptitudes
const nombresIntereses = [
  "",
    "Artístico plástico",
    "Biológicos",
    "Cálculo",
    "Campestres",
    "Científicos",
    "Contabilidad",
    "Geofísico",
    "Literarios",
    "Mecánicos",
    "Musical",
    "Organización",
    "Persuasivo",
    "Servicio social"
  ];
  
  const nombresAptitudes = [
    "",
    "Abstracta o científica",
    "Artístico-plástica",
    "Coordinación visomotriz",
    "Directiva",
    "Espacial",
    "Mecánica",
    "Musical",
    "Numérica",
    "Organizacional",
    "Persuasiva",
    "Social",
    "Verbal",
    "" // Para el índice 13 que está vacío
  ];
  
    
  
const TextAreaComponent = ({ questionId, onButtonClick, value }) => {
  const [localValue, setLocalValue] = useState(value || ""); // Usa "" si value es undefined
   
  const isDisabled = !localValue || localValue.trim() === '';

  useEffect(() => {
    setLocalValue(value || ""); // Nuevamente, usa "" si value es undefined
  }, [value]);

  return (
    <>
      <textarea
        className="text-answer-area"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Escribe tu respuesta aquí"
      />
      <button
        onClick={() => onButtonClick(localValue)}
        className="button prev-button"
        disabled={isDisabled}
      >
        <FontAwesomeIcon icon={faChevronRight} /> Actualizar 
      </button>
    </>
  );
};
 
  
const TextAreaComponentPrompt = ({ questionId, onButtonClick, value }) => {
  const [localValue, setLocalValue] = useState(value || ""); // Usa "" si value es undefined
   
  const isDisabled = !localValue || localValue.trim() === '';

  useEffect(() => {
    setLocalValue(value || ""); // Nuevamente, usa "" si value es undefined
  }, [value]);

  return (
    <>
      <textarea
        className="text-answer-prompt"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Escribe tu respuesta aquí"
      />
      <button
        onClick={() => onButtonClick(localValue)}
        className="button prev-button"
        disabled={isDisabled}
      >
        <FontAwesomeIcon icon={faChevronRight} /> Actualizar 
      </button>
    </>
  );
};

const Resultados = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [gptResult, setGptResult] = useState(null);
  const [resultadosChatgpt, setResultadosChatgpt] = useState({
    intereses: "",
    aptitudes: "",
    general: "",
    carrera: "",
    introduccion: "",
    consejo: ""
  });
  
  const [resultados, setResultados] = useState(null);
  const [resultadosContext, setResultadosContext] = useState(null);
  const [resultadosGeneral, setResultadosGeneral] = useState(null);
  const [resultadosQuestions, setResultadosQuestions] = useState(null);
  const [pregunta, setPregunta] = useState(null);

  const [contexts, setContexts] = useState([]);
  const [general, setGeneral] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [estadoTest, setEstadoTest] = useState(null);

  let ID_cliente;

  const handleImprimirPDF = () => {
    console.log("Iniciando la generación del PDF...");
    const elementoAConvertir = document.getElementById('contenido-informe');
  
    if (!elementoAConvertir) {
      console.error("No se encontró el elemento con el ID 'contenido-informe'.");
      return;
    }
  
    const opciones = {
      margin: 10,
      filename: 'informe.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
  
    html2pdf().from(elementoAConvertir).set(opciones).toPdf().get('pdf').then(function (pdf) {
      window.open(pdf.output('bloburl'), '_blank'); // Abrir en nueva pestaña (opcional)
      pdf.save('informe.pdf'); // Guardar el archivo
    }).catch((error) => {
      console.error("Error al generar el PDF:", error);
    });
  };
  
  
  const cambiar_contexto = async (tipo, value,prompt) => {

          if(tipo=="intereses") {
          resultadosChatgpt.intereses=value;
          }
          if(tipo=="aptitudes") {
          resultadosChatgpt.aptitudes=value;
          }
          if(tipo=="general") {
          resultadosChatgpt.general=value;
          } 
          if(tipo=="carrera") {
          resultadosChatgpt.carrera=value;
          }
          if(tipo=="introduccion") {
          resultadosChatgpt.introduccion=value;
          }
          if(tipo=="conclusion") {
          resultadosChatgpt.consejo=value;
          }
      
      setResultadosChatgpt(resultadosChatgpt)
      try {
        const response = await axios.post(apiUrls.actualizarConsulta, {
          Info: resultadosChatgpt,
          ID_cliente: ID_cliente,
          Prompt:prompt
          
        });
        console.log(response.data);
         
      } catch (error) {
        console.error('Error updating the response:', error);
      }
    
    // Actualiza las respuestas con la nueva selección
    /*
    const updatedAnswers = {
      ...answers_general,
      [questionId]: value
    };
  
    //setAnswers(updatedAnswers);
    setAnswersGeneral(updatedAnswers);
 
    // Envía la actualización al backend
    try {
      const response = await axios.post(apiUrls.updateAnswer3, {
        ID_pregunta: questionId,
        ID_cliente: ID_cliente,
        Respuesta: option
      });
      console.log(response.data);
      goToNext();
    } catch (error) {
      console.error('Error updating the response:', error);
    }
    */
  
   };
  const consultaGPT = async (ID_cliente) => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(apiUrls.consultaGPT, {
        ID_cliente: ID_cliente,
      });
      console.log(response.data);
      setGptResult(response.data);
    } catch (error) {
      console.error('Error updating the response:', error);
    } finally {
      setIsLoading(false);
     // window.location.reload(); // Reload the page
    }
  };

  
 

  const validarTest = async (estadoTest) => {
    setIsLoading(true);
    alert('ID_cliente  ', ID_cliente);
    try {
      const response = await axios.post(apiUrls.changeTestState, {
        id_usuario: ID_cliente,
        estadoTest: estadoTest
      });
      alert('Validación completada:', response.data);
      console.log('Validación completada:', response.data);
      // Manejar la respuesta de la validación
    } catch (error) {
      console.error('Error en la validación del test:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const enviarTestCorreo = async (ID_cliente) => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(apiUrls.enviarTestCorreo, {
        ID_cliente: ID_cliente,
      });
      console.log('Test enviado al correo:', response.data);
      // Manejar la confirmación del envío
    } catch (error) {
      console.error('Error al enviar test al correo:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const enviarTestCelular = async (ID_cliente) => {
    setIsLoading(true);
  
    try {
      const response = await axios.post(apiUrls.enviarTestCelular, {
        ID_cliente: ID_cliente,
      });
      console.log('Test enviado al celular:', response.data);
      // Manejar la confirmación del envío
    } catch (error) {
      console.error('Error al enviar test al celular:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  function isValidJson(jsonString) {
    try {
      JSON.parse(jsonString);
    } catch (e) {
      return false;
    }
    return true;
  }
  ID_cliente = localStorage.getItem('ID_cliente');
  
  useEffect(() => {
    if (general && general.length > 0) {
      console.log("general actualizado", general[0].Pregunta);
    }
  }, [general]); // Dependencia de 'general'
  
  useEffect(() => {
    const fetchResultados = async () => {
      try {


        
        const usuarioInfo = await axios.post(apiUrls.infoUser, { ID_cliente });  
      
        console.log("usuarioInfo",usuarioInfo.data.clerkInfo)
        const estadoTest = usuarioInfo.data.clerkInfo.publicMetadata.estadoTest;
       console.log("estadoTest",estadoTest)
        setEstadoTest(estadoTest)
        setUsuario(usuarioInfo);    
        

        const preguntasGeneral = await axios.get(apiUrls.getGeneral);
      
        
        setGeneral(preguntasGeneral.data);    
        
        const preguntasContexto = await axios.get(apiUrls.getContexts);
     
        
        setContexts(preguntasContexto.data);
      
        const preguntasIntereses = await axios.get(apiUrls.getQuestions);
      

        
        
        setQuestions(preguntasIntereses.data);
        // Consulta para obtener resultados de ChatGPT
        try {
          const responseChatgpt = await axios.post(apiUrls.getUserChatgpt, { ID_cliente });
          console.log("responseChatgpt",responseChatgpt.data)
          console.log("ID_cliente",ID_cliente)
          if (responseChatgpt.data && responseChatgpt.data[0] && responseChatgpt.data[0].length > 0) {
            const lastEntry = responseChatgpt.data[0][0];
            console.log("lastEntry",lastEntry)
            if (isValidJson(lastEntry.Respuesta)) {
              console.log("isValidJson",lastEntry.Respuesta)
           
            const respuestaData = JSON.parse(lastEntry.Respuesta);
            const intro_fijo = "Se aplicaron los inventarios de intereses y aptitudes para la identificación de las áreas de mayor interés ocupacional y la correspondencia entre ambos."
            respuestaData.introduccion = intro_fijo;
            setResultadosChatgpt(respuestaData);
      
            setPregunta(lastEntry.Pregunta);
          } else {
            console.error("Respuesta no es un JSON válido");
            // Manejo de caso de no JSON válido
          }
      
          // Consulta para obtener resultados generales
          const response = await axios.post(apiUrls.resultados, { ID_cliente });
          console.log("response", response);
          setResultados(response.data);
       
        const responseContext = await axios.post(apiUrls.getuserResponsesContext, { ID_cliente });
 
        setResultadosContext(responseContext.data[0]);
        
        const responseGeneral = await axios.post(apiUrls.getuserResponsesGeneral, { ID_cliente });
 
       
        setResultadosGeneral(responseGeneral.data[0]);

        const responseQuestions = await axios.post(apiUrls.getuserResponsesQuestions, { ID_cliente });
        
        setResultadosQuestions(responseQuestions.data[0]);
      
    }
    } catch (error) {
        console.error("Error durante la operación:", error);
        // Manejo del error: establece valores predeterminados, muestra un mensaje al usuario, etc.
    }
   

     
     
      } catch (error) {
        console.error('Error al obtener los resultados', error);
      }
    };

    fetchResultados();
  }, [ID_cliente,isLoading,estadoTest]);

  
 
  // Verifica si resultados está cargado antes de intentar mostrar los gráficos
  if (!resultados) {
    return <div>Cargando resultados...</div>;
  }

// Datos para el gráfico de barras de Intereses

  

  // Opciones para los gráficos (opcional, para personalizar la apariencia de los gráficos)
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Grafico de intereses',
        // Aquí eliminarías o comentarías la línea que aplica estilos al borde
        // Por ejemplo, si hay una línea que dice borderColor: 'red', la eliminarías o comentarías.
      },
      legend: {
        display: false // Esto ocultará la leyenda del gráfico
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const obtenerFechaFormateada = () => {
    const fecha = new Date();
    return fecha.toLocaleDateString(); // Formatea la fecha como 'mm/dd/yyyy'. Puedes ajustar el formato según tus necesidades
  };
  function calcularDesviacionEstandar(datos) {
    const n = datos.length;
    const mean = datos.reduce((a, b) => a + b) / n;
    return Math.sqrt(datos.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  }
  
  function getColor(valor, maximo, desviacionEstandar) {
    const umbralVerde = maximo - desviacionEstandar;
    const umbralAmarillo = maximo - 2 * desviacionEstandar;
  
    if (valor >= umbralVerde) {
      return 'green'; // Colorea de verde
    } else if (valor < umbralVerde && valor >= umbralAmarillo) {
      return 'yellow'; // Colorea de amarillo
    } else {
      return 'red'; // Colorea de rojo (o cualquier otro color para valores por debajo de la segunda desviación estándar)
    }
  }
 
  
  const maxIntereses = Math.max(...resultados.arrayIntereses);
  const maxAptitudes = Math.max(...resultados.arrayAptitudes);
  
  const desviacionEstandarIntereses = calcularDesviacionEstandar(resultados.arrayIntereses);
  const desviacionEstandarAptitudes = calcularDesviacionEstandar(resultados.arrayAptitudes);
  
  // Utiliza las funciones para calcular los colores
  const coloresIntereses = resultados.arrayIntereses.map(valor => getColor(valor, maxIntereses, desviacionEstandarIntereses));
  const coloresAptitudes = resultados.arrayAptitudes.map(valor => getColor(valor, maxAptitudes, desviacionEstandarAptitudes));
  
 

// Modifica tu dataIntereses para incluir colores dinámicos
const dataIntereses = {
  labels: nombresIntereses.slice(1), // Usa slice para quitar el primer elemento "N/A"
  datasets: [{
    label: 'Puntaje de Intereses',
    data: resultados.arrayIntereses,
    backgroundColor: coloresIntereses.map(color => {
      // Asumiendo que coloresIntereses ya contiene los colores 'verde', 'amarillo', 'rojo'
      if (color === 'green') {
        return 'rgba(0, 128, 0, 0.75)'; // verde con opacidad
      } else if (color === 'yellow') {
        return 'rgba(255, 255, 0, 0.75)'; // amarillo con opacidad
      } else {
        return 'rgba(255, 0, 0, 0.75)'; // rojo con opacidad
      }
    }),
    borderColor: coloresIntereses.map(color => {
      // Colores sólidos para el borde
      if (color === 'green') {
        return 'rgba(0, 128, 0, 1)';
      } else if (color === 'yellow') {
        return 'rgba(255, 255, 0, 1)';
      } else {
        return 'rgba(255, 0, 0, 1)';
      }
    }),
    borderWidth: 1, // Grosor del borde de las barras
    borderRadius: 4, // Bordes redondeados de las barras
  }],
};

const dataAptitudes = {
  labels: nombresAptitudes.slice(1), // Usa slice para quitar el primer elemento "N/A"
  datasets: [
    {
      label: 'Puntaje de Aptitudes',
      data: resultados.arrayAptitudes,
      backgroundColor: coloresAptitudes.map(color => {
        // Asumiendo que coloresAptitudes ya contiene los colores 'verde', 'amarillo', 'rojo'
        if (color === 'green') {
          return 'rgba(0, 128, 0, 0.75)'; // verde con opacidad
        } else if (color === 'yellow') {
          return 'rgba(255, 255, 0, 0.75)'; // amarillo con opacidad
        } else {
          return 'rgba(255, 0, 0, 0.75)'; // rojo con opacidad
        }
      }),
      borderColor: coloresAptitudes.map(color => {
        // Colores sólidos para el borde
        if (color === 'green') {
          return 'rgba(0, 128, 0, 1)';
        } else if (color === 'yellow') {
          return 'rgba(255, 255, 0, 1)';
        } else {
          return 'rgba(255, 0, 0, 1)';
        }
      }),
      borderWidth: 1, // Grosor del borde de las barras
      borderRadius: 4, // Bordes redondeados de las barras
    },
  ],
};

  return (
    <div>

 


    {resultadosContext && resultadosContext.data && resultadosContext.data[0] && resultadosContext.data[0][0] && <p>{resultadosContext.data[0][0].Respuesta} </p>}
 
 
    
      {/* Párrafo después del segundo gráfico */}
      {resultadosChatgpt && (
  <>

 
    <div>
      
  

</div>

 
{estadoTest === 2 ? (
        <> 
      
          <div id="contenido-informe" className="contenido-informe">
            <header className="encabezado-carta">
              <div className="logo-container">
                {/* Asegúrate de que `logoNeerd` esté definido y sea la ruta correcta al logo */}
                <img src={logoNeerd} alt="Logo Neerd" className="logo-carta" />
              </div>
              <div className="titulo-slogan-container">
                <h1 className="titulo-carta">NEERD</h1>
                <p className="slogan-carta">Centro E-learning</p>
              </div>
              <div className="lugar-fecha-container">
                <p className="lugar-carta">Hermosillo, Sonora, De la Rivera 21 colonia Praderas del Valle</p>
                <p className="fecha-carta">{new Date().toLocaleDateString()}</p>
              </div>
            </header>
            {/* Aquí iría el resto del contenido de tu informe */}
              {/* Espacio entre secciones */}
    <div className="section-space"></div>
    <h5 class="titulo_reporte">Resultados del test vocacional</h5>


    <p className="negrita">Estudiante: </p><p class="subrayado">{usuario.data[0].Nombre_usuario} {usuario.data[0].Apellido_usuario}</p>
 
   
    <p>{resultadosChatgpt.introduccion} </p> {/* Párrafo después del segundo gráfico */}
    <h5>Resultados de Intereses</h5>
    <div className="grafico-contenedor">
  <Bar data={dataIntereses} options={options} />
</div>
    <p>{resultadosChatgpt.intereses} </p> {/* Párrafo después del segundo gráfico */}
    <h5>Resultados de Aptitudes</h5>

<p>{resultadosChatgpt.aptitudes} </p> {/* Párrafo después del primer gráfico */}

    <div className="grafico-contenedor">
  <Bar data={dataAptitudes} options={options} />
</div>
  <p>{resultadosChatgpt.general} </p> {/* Párrafo después del segundo gráfico */}

  <p>{resultadosChatgpt.consejo} </p> {/* Párrafo después del segundo gráfico */}
  <h4>Carreras Recomendadas</h4>
{/* Verifica que resultadosChatgpt y resultadosChatgpt.carrera no sean nulos o indefinidos */}
{resultadosChatgpt && resultadosChatgpt.carrera && (
  // Verifica si es un string y contiene comas
  typeof resultadosChatgpt.carrera === 'string' && resultadosChatgpt.carrera.includes(',') ? (
    <ul>
      {resultadosChatgpt.carrera.split(',').map((carrera, index) => (
        <li key={index}>{carrera.trim()}</li>
      ))}
    </ul>
  ) : (
    // Verifica si es un string y no contiene comas
    typeof resultadosChatgpt.carrera === 'string' ? (
      <p>{resultadosChatgpt.carrera}</p>
    ) : (
      // Procesa el objeto y muestra sus valores
      <ul>
        {Object.values(resultadosChatgpt.carrera).map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
    )
  )
)}


<div className="contenedor_final">
    <footer className="footer">
    <div className="firma-contenedor">
    <img src={firma} alt="Firma" className="firma-imagen" />
        <div className="firma-línea"></div> 
      </div>
      <p className="footer-title">Psic. G. Isabel Tirado Gómez</p>
      <p className="footer-subtitle">Neerd Centro E-Learning</p>
      <p className="footer-info">Céd. Prof. 12308873</p>
      <p className="footer-contact">Contacto: isabel.tiradog@gmail.com </p>
    

    </footer>
    </div>
    
          </div>
          <button onClick={() => handleImprimirPDF()} className="button print-button" disabled={isLoading}>
    <FontAwesomeIcon icon={faPrint} /> Descargar reporte PDF
  </button>
        </>
      ) : (
        // Aquí va el código de tu loader (componente de carga)
        <div className="spinner-container">
    <div className="spinner"></div>
    <p className="loading-text">Estamos procesando tu información, tus resultados serán enviados a tu correo y celular...</p>
  </div>
      )}

  
  </>
)}



    </div>
  )
  
  };
 export default Resultados;
