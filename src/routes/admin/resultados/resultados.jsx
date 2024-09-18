// Resultados.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faChevronLeft, faChevronRight, faBan, faRobot, faDownload, faRedo, faPaperPlane, faMobileAlt, faEnvelope, faCheck, faPrint } from '@fortawesome/free-solid-svg-icons';
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
  const [showPopup, setShowPopup] = useState(false);
  const [telefono, setTelefono] = useState(null);
  const [mensaje, setMensaje] = useState(`*¡Hola!*

Tus resultados personalizados del *Test Vocacional Neerd* ya están listos y te esperan. *Hemos analizado cuidadosamente tus respuestas y con la ayuda de la inteligencia artificial, hemos preparado un informe que te ayudará a descubrir las carreras que mejor se alinean con tus intereses y habilidades.*
  
Visita el siguiente enlace:  http://neerdvocacional.org
  
Queremos acompañarte en este paso importante hacia tu desarrollo profesional y personal.

Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.

  - *Equipo Neerd Vocacional*`);


  const enviarTestCelular = (id) => {
    // Lógica para enviar test por celular
    // Lógica para enviar test por celular
    setShowPopup(true); // Muestra el popup
  };


  function isValidJson(jsonString) {
    try {
      JSON.parse(jsonString);
    } catch (e) {
      return false;
    }
    return true;
  }
  const confirmarEnvio = async (Destino, Info) => {

    setShowPopup(false); // Muestra el popup
    try {
      const response = await axios.post(apiUrls.insertarMensaje, {
        Destino: Destino,
        Info: Info
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


  const cambiar_contexto = async (tipo, value, prompt) => {

    if (tipo == "intereses") {
      resultadosChatgpt.intereses = value;
    }
    if (tipo == "aptitudes") {
      resultadosChatgpt.aptitudes = value;
    }
    if (tipo == "general") {
      resultadosChatgpt.general = value;
    }
    if (tipo == "carrera") {
      if ((value.startsWith('{') || value.startsWith('[')) && (tipo === "carrera" || tipo === "otroTipoQuePuedeSerJSON")) {
        try {
          // Intenta analizar 'value' como JSON
          const parsedValue = JSON.parse(value);
          resultadosChatgpt.carrera = parsedValue;
        } catch (error) {
          console.error("JSON inválido:", error);
          return; // Detiene la ejecución si el JSON no es válido
        }
      } else {
        // Si no parece ser un JSON o no es del tipo que se espera que sea JSON, maneja como texto normal
        resultadosChatgpt.carrera = value;
      }

    }
    if (tipo == "introduccion") {
      resultadosChatgpt.introduccion = value;
    }
    if (tipo == "conclusion") {
      resultadosChatgpt.consejo = value;
    }

    setResultadosChatgpt(resultadosChatgpt)
    try {
      const response = await axios.post(apiUrls.actualizarConsulta, {
        Info: resultadosChatgpt,
        ID_cliente: ID_cliente,
        Prompt: prompt

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




  ID_cliente = localStorage.getItem('ID_results');

  useEffect(() => {
    if (general && general.length > 0) {
      console.log("general actualizado", general[0].Pregunta);
    }
  }, [general]); // Dependencia de 'general'

  useEffect(() => {
    const fetchResultados = async () => {
      try {



        const usuarioInfo = await axios.post(apiUrls.infoUser, { ID_cliente });

        console.log("usuarioInfo", usuarioInfo.clerkInfo)
        const estadoTest = usuarioInfo.data.clerkInfo.publicMetadata.estadoTest;
        setEstadoTest(estadoTest)
        setTelefono(usuarioInfo.data[0].Telefono_usuario)
        setUsuario(usuarioInfo);


        const preguntasGeneral = await axios.get(apiUrls.getGeneral);


        setGeneral(preguntasGeneral.data);

        const preguntasContexto = await axios.get(apiUrls.getContexts);


        setContexts(preguntasContexto.data);

        const preguntasIntereses = await axios.get(apiUrls.getQuestions);


        setQuestions(preguntasIntereses.data);
        // Consulta para obtener resultados de ChatGPT
        const responseChatgpt = await axios.post(apiUrls.getUserChatgpt, { ID_cliente });
        if (responseChatgpt.data && responseChatgpt.data[0] && responseChatgpt.data[0].length > 0) {
          const lastEntry = responseChatgpt.data[0][0];
          if (isValidJson(lastEntry.Respuesta)) {
            try {
              const respuestaData = JSON.parse(lastEntry.Respuesta);
              const intro_fijo = "Se aplicaron los inventarios de intereses y aptitudes para la identificación de las áreas de mayor interés ocupacional y la correspondencia entre ambos."
              respuestaData.introduccion = intro_fijo


              setResultadosChatgpt(respuestaData);

            } catch (error) {
              console.error("Error al parsear la respuesta de ChatGPT:", error);
              // Puedes establecer un valor por defecto o manejar el error de otra manera aquí
            }

            setPregunta(lastEntry.Pregunta);
          }
        }
        // Consulta para obtener resultados generales
        const response = await axios.post(apiUrls.resultados, { ID_cliente });


        setResultados(response.data);

        const responseContext = await axios.post(apiUrls.getuserResponsesContext, { ID_cliente });

        setResultadosContext(responseContext.data[0]);

        const responseGeneral = await axios.post(apiUrls.getuserResponsesGeneral, { ID_cliente });


        setResultadosGeneral(responseGeneral.data[0]);

        const responseQuestions = await axios.post(apiUrls.getuserResponsesQuestions, { ID_cliente });

        setResultadosQuestions(responseQuestions.data[0]);




      } catch (error) {
        console.error('Error al obtener los resultados', error);
      }
    };

    fetchResultados();
  }, [ID_cliente, isLoading]);



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
  // Opciones para los gráficos (opcional, para personalizar la apariencia de los gráficos)
  const options2 = {
    plugins: {
      title: {
        display: true,
        text: 'Grafico de aptitudes',
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

  const renderCarreras = () => {
    // Intenta convertir 'carrera' a un objeto/array si es un string que parece un JSON
    let carreraData = resultadosChatgpt.carrera;
    if (typeof carreraData === 'string' && (carreraData.startsWith('[') || carreraData.startsWith('{'))) {
      try {
        carreraData = JSON.parse(carreraData);
      } catch (error) {
        // Si hay un error en la conversión, puedes manejarlo aquí
        console.error("Error al analizar 'carrera':", error);
        return <p>Error al procesar el formato de carreras.</p>;
      }
    }

    // Procesa carreraData que ahora es un objeto/array o un string
    if (Array.isArray(carreraData) && carreraData.every(item => item.hasOwnProperty('nombre') && item.hasOwnProperty('tendencias'))) {
      return (
        <ul>
          {carreraData.map((carrera, index) => (
            <li key={index}>
              <strong>{carrera.nombre}</strong>
              <ul>
                {carrera.tendencias.map((tendencia, idx) => (
                  <li key={idx}>{tendencia}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    } else if (typeof carreraData === 'string') {
      // Manejar como un string simple o con comas
      if (carreraData.includes(',')) {
        return (
          <ul>
            {carreraData.split(',').map((carrera, index) => (
              <li key={index}>{carrera.trim()}</li>
            ))}
          </ul>
        );
      } else {
        return <p>{carreraData}</p>;
      }
    } else {
      // Si carreraData no es ni un array de objetos ni un string
      return <p>Formato de carreras no reconocido.</p>;
    }
  };




  return (
    <div>


      <div className="questions-container">
        <h2>Resultados del test vocacional</h2>


        {/* Botones de control */}
        <div className="control-buttons">
          {/* Botones para navegar, enviar respuestas, etc. */}
        </div>
      </div>




      {resultadosContext && resultadosContext.data && resultadosContext.data[0] && resultadosContext.data[0][0] && <p>{resultadosContext.data[0][0].Respuesta} </p>}


      <h3>Resultados de Intereses</h3>
      <Bar data={dataIntereses} options={options} />
      <h3>Resultados de Aptitudes</h3>
      <Bar data={dataAptitudes} options={options} />

      {/* Párrafo después del segundo gráfico */}

      <button
        onClick={() => consultaGPT(ID_cliente)}
        className="button gpt-consulta-button"
        disabled={isLoading}
      >
        <FontAwesomeIcon icon={faRobot} /> Consulta GPT-4
      </button>


      {isLoading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p className="loading-text">Procesando la información del alumno y generando recomendaciones de carrera. Este proceso puede llevar varios
            segundos, ya que estamos analizando cuidadosamente las respuestas del alumno para proporcionar la mejor orientación profesional posible.
            ¡Gracias por tu paciencia y por ayudar a nuestros estudiantes a tomar decisiones informadas sobre su futuro!</p>
        </div>
      ) : (
        // Render the result when it's available
        <div>


        </div>
      )}
      <h2>Prompt:</h2>
      <div className="text-answer-area">
        <TextAreaComponentPrompt
          seccion="intereses"
          value={` ${pregunta || ""}`}
          onButtonClick={(value) => cambiar_contexto("prompt", value, pregunta)}
        />
      </div>

      {/* Párrafo después del segundo gráfico */}
      {resultadosChatgpt && (
        <>

          {/* Sección de Resultados de Introduccion */}
          <div className="result-section">
            <h2>Introduccion</h2>
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="introduccion"
                value={` ${resultadosChatgpt.introduccion || ""}`}
                onButtonClick={(value) => cambiar_contexto("introduccion", value, pregunta)}
              />
            </div>
          </div>

          {/* Sección de Resultados de Intereses */}
          <div className="result-section">
            <h2>Resultados de Intereses</h2>
            <Bar data={dataIntereses} options={options} />
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="intereses"
                value={` ${resultadosChatgpt.intereses || ""}`}
                onButtonClick={(value) => cambiar_contexto("intereses", value, pregunta)}
              />
            </div>
          </div>

          {/* Espacio entre secciones */}
          <div className="section-space"></div>

          {/* Sección de Resultados de Aptitudes */}
          <div className="result-section">
            <h2>Resultados de Aptitudes</h2>
            <Bar data={dataAptitudes} options={options} />
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="aptitudes"
                value={` ${resultadosChatgpt.aptitudes || ""}`}
                onButtonClick={(value) => cambiar_contexto("aptitudes", value, pregunta)}
              />
            </div>
          </div>

          {/* Espacio entre secciones */}
          <div className="section-space"></div>

          {/* Sección de Resultados Generales */}
          <div className="result-section">
            <h2>Resultados General</h2>
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="general"
                value={` ${resultadosChatgpt.general || ""}`}
                onButtonClick={(value) => cambiar_contexto("general", value, pregunta)}
              />
            </div>
          </div>


          {/* Sección de Carreras Recomendadas */}
          <div className="result-section">
            <h2>Conclusion</h2>
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="consejo"
                value={` ${resultadosChatgpt.consejo || ""}`}
                onButtonClick={(value) => cambiar_contexto("conclusion", value, pregunta)}
              />
            </div>
          </div>

          {/* Espacio entre secciones */}
          <div className="section-space"></div>

          {/* Sección de Carreras Recomendadas */}
          <div className="result-section">
            <h2>Carreras Recomendadas</h2>
            <div className="text-answer-area">
              <TextAreaComponent
                seccion="carrera"
                value={JSON.stringify(resultadosChatgpt.carrera, null, 2)} // Formatea con una sangría de 2 espacios
                onButtonClick={(value) => cambiar_contexto("carrera", value, pregunta)}
              />

            </div>
          </div>

          <div>

            <button onClick={() => handleImprimirPDF()} className="button print-button" disabled={isLoading}>
              <FontAwesomeIcon icon={faPrint} /> Imprimir PDF
            </button>

            {estadoTest === 2 ? (

              <>

                <button onClick={() => validarTest(0)} className="button invalidate-button" disabled={isLoading}>
                  <FontAwesomeIcon icon={faBan} /> Invalidar test
                </button>

                <button onClick={() => enviarTestCelular()} className="button phone-button" disabled={isLoading}>
                  <FontAwesomeIcon icon={faMobileAlt} /> Enviar al Celular
                </button>

              </>
            ) : (
              <button onClick={() => validarTest(2)} className="button validate-button" disabled={isLoading}>
                <FontAwesomeIcon icon={faCheck} /> Validar Test
              </button>


            )}


            <button onClick={() => enviarTestCorreo(ID_cliente)} className="button email-button" disabled={isLoading} hidden>
              <FontAwesomeIcon icon={faEnvelope} /> Enviar al Correo
            </button>





            {showPopup && (
              <div className={`popup ${showPopup ? 'active' : ''}`}>

                <div className="popup-inner">

                  <button className="btn-cerrar-popup" onClick={() => setShowPopup(false)}>×</button>
                  <h3>Enviar Test al Celular</h3>
                  <label htmlFor="telefono">Celular:</label>
                  <input
                    type="text"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="input-popup"
                  />

                  <textarea className="textarea-popup" defaultValue=""
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                  ></textarea>

                  <button onClick={() => confirmarEnvio(telefono, mensaje)}>Confirmar Envío</button>
                </div>
              </div>
            )}


          </div>

          <p hidden className="negrita">Estado: </p><p class="subrayado">{usuario.data.clerkInfo.publicMetadata.estadoTest}  </p>


          {estadoTest === 1 || estadoTest === 2 || estadoTest === 0 ? (
            <>
              <h2>Informe para el alumno:</h2>
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
                    <p className="lugar-fecha-carta">
                      Hermosillo, Sonora, De la Rivera 21 colonia Praderas del Valle, {new Date().toLocaleDateString()}
                    </p>
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
                  <Bar data={dataAptitudes} options={options2} />
                </div>
                <p>{resultadosChatgpt.general} </p> {/* Párrafo después del segundo gráfico */}

                <p>{resultadosChatgpt.consejo} </p> {/* Párrafo después del segundo gráfico */}
                <h4>Carreras Recomendadas</h4>
                {/* Verifica que resultadosChatgpt y resultadosChatgpt.carrera no sean nulos o indefinidos */}
                {resultadosChatgpt && resultadosChatgpt.carrera && renderCarreras()}

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


      <div className="general-questions">
        <h2>Información general:</h2>
        {resultadosGeneral && general && resultadosGeneral.map((question) => (
          <div key={question.ID_pregunta} className="question-item">
            <h1 className="question-indicador">
              {`#${parseInt(question.ID_pregunta)}`}
            </h1>
            <h3 className="question-title">
              {general[question.ID_pregunta - 1] ? general[question.ID_pregunta - 1].Pregunta : 'Cargando...'}
            </h3>
            <h3 className="question-title">
              {question.Respuesta}
            </h3>
          </div>
        ))}
      </div>

      <div className="general-questions">

        <h2>Contexto del usuario:</h2>
        {resultadosContext && contexts && resultadosContext.map((question) => (
          <div key={question.ID_pregunta} className="question-item">
            <h1 className="question-indicador">
              {`#${parseInt(question.ID_pregunta)}`}
            </h1>
            <h3 className="question-title">
              {contexts[question.ID_pregunta - 1] ? contexts[question.ID_pregunta - 1].Pregunta : 'Cargando...'}
            </h3>
            <h3 className="question-title">
              {question.Respuesta}
            </h3>
          </div>
        ))}
      </div>

      <div className="general-questions">

        <h2>Cuestionario de intereses y aptitudes:</h2>
        {resultadosQuestions && questions && resultadosQuestions.map((question) => (
          <div key={question.ID_pregunta} className="question-item">
            <h1 className="question-indicador">
              {`#${parseInt(question.ID_pregunta)}   ${nombresIntereses[parseInt(questions[question.ID_pregunta - 1].Intereses)]}  ${nombresAptitudes[parseInt(questions[question.ID_pregunta - 1].Aptitudes)]}`}
            </h1>
            <h3 className="question-title">
              {questions[question.ID_pregunta - 1] ? questions[question.ID_pregunta - 1].Pregunta : 'Cargando...'}
            </h3>
            <h3 className="question-title" hidden>
              {question.Respuesta}
            </h3>
            <div className="options-container">
              {[1, 2, 3, 4, 5].map(option => {
                const isSelected = question.Respuesta == option;
                return (
                  <button
                    key={option}
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange(question.ID_pregunta, option)}
                  >
                    {option === 1 ? 'Nada' :
                      option === 2 ? 'Un poco' :
                        option === 3 ? 'Neutral' :
                          option === 4 ? 'Algo' :
                            'Mucho'}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )

};
export default Resultados;
