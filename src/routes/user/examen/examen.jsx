import { useState, useEffect,useRef } from 'react';
import ExamenView from './examen-view';
import axios from 'axios';
import apiUrls from '../../../api';

import { useNavigate } from 'react-router-dom';

 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarouselStyles.css';
import './CarouselStyles.css';
import ubicaciones from './ubicaciones.json';  

// Importa los íconos de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faChevronLeft, faChevronRight  ,faDownload, faRedo, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { useUser } from "@clerk/clerk-react";
 
const TextAreaComponent0 = ({ questionId, value, onChange, onButtonClick }) => {
  
  return (
    <>
      <textarea
        className="text-answer-area"
        value={value || ''}
        onChange={e => onChange(questionId, e.target.value)}
        placeholder="Escribe tu respuesta aquí"
      />
      <button
        onClick={() => onButtonClick(value)}
        className="button prev-button"
        disabled={!value || value.trim() === ''} // Deshabilita el botón si value es vacío o solo espacios
      >
        <FontAwesomeIcon icon={faChevronRight} /> Continuar
      </button>
    </>
  );
};

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
        <FontAwesomeIcon icon={faChevronRight} /> Continuar
      </button>
    </>
  );
};

 
const SelectorUbicacion = ({ pais, estado, ciudad, onPaisChange, onEstadoChange, onCiudadChange , onButtonClick}) => {
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    setEstados(Object.keys(ubicaciones[pais] || {}));
  }, [pais]);

  useEffect(() => {
    setCiudades(ubicaciones[pais]?.[estado] || []);
  }, [pais, estado]);

  return (
<div className="selects-wrapper">
  
<div className="selectors-container">
  {/* Selector de país */}
  <div className="select-container">
    <label htmlFor="pais">País</label>
    <select id="pais" value={pais} onChange={e => onPaisChange(e.target.value)}>
      {Object.keys(ubicaciones).map(pais => (
        <option key={pais} value={pais}>{pais}</option>
      ))}
    </select>
  </div>

  {/* Selector de estado */}
  <div className="select-container">
    <label htmlFor="estado">Estado</label>
    <select id="estado" value={estado} onChange={e => onEstadoChange(e.target.value)}>
      {estados.map(estado => (
        <option key={estado} value={estado}>{estado}</option>
      ))}
    </select>
  </div>

  {/* Selector de ciudad */}
  <div className="select-container">
    <label htmlFor="ciudad">Ciudad</label>
    <select id="ciudad" value={ciudad} onChange={e => onCiudadChange(e.target.value)}>
      {ciudades.map(ciudad => (
        <option key={ciudad} value={ciudad}>{ciudad}</option>
      ))}
    </select>
  </div>
  </div>
  <div className="select-container">
  <button
  onClick={() => onButtonClick(ciudad + ", " + estado + ", " + pais)}
  className="button"
  disabled={!pais || !estado || !ciudad} // El botón se deshabilita si falta alguna selección
>
  <FontAwesomeIcon icon={faChevronRight} /> Continuar
</button>

</div>
</div>

  );
};

 
const Questions = ({ user }) => {
  console.log("asdasd",user.id )
  const userinfo    = 1
  const sliderRef = useRef(null);
  
const thumbnailSliderRef = useRef(null);

  const [contexts, setContexts] = useState([]);
  const [general, setGeneral] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  
  const [answers_general, setAnswersGeneral] = useState({});
  
  const [answers_contexto, setAnswersContexto] = useState({});
  
  const [answers_pregunta, setAnswersPregunta] = useState({});

 
  const [currentSlide, setCurrentSlide] = useState(0);
  // Agregamos el manejador de cambio de slide a la configuración de react-slick
 
  const navigate = useNavigate(); // Hook para la navegación
// Dentro de tu componente Questions
const { isSignedIn } = useUser();

useEffect(() => {


  if (!isSignedIn) {
    navigate('/login');
  }
  else
  {
    const id = localStorage.getItem('ID_cliente');
    const id_local = localStorage.getItem('ID_local');
      console.log("IDDD",id)
      if (id) {
        setIDCliente(id);
        
        setIDLocal(id_local);
      } else {
        navigate('/'); // Si no hay ID_cliente, redirige a /main
      }
  }

}, [isSignedIn, navigate]);
// Estados para país, estado y ciudad
const [pais, setPais] = useState(''); // Valor inicial
const [estado, setEstado] = useState('');
const [ciudad, setCiudad] = useState('');

const [ID_cliente, setIDCliente] = useState('');
const [ID_local, setIDLocal] = useState('');

useEffect(() => {
  // Cargar el ID del cliente cuando el componente se monte
  console.log("userInfo",userinfo)
  const id = localStorage.getItem('ID_cliente');
  const id_local = localStorage.getItem('ID_local');
    console.log("IDDD",id)
    if (id) {
      setIDCliente(id);
      
      setIDLocal(id_local);
    } else {
      navigate('/'); // Si no hay ID_cliente, redirige a /main
    }
  }, [ID_cliente]);
  


  useEffect(() => {
    axios.get(apiUrls.getContexts)
      .then(response => {
         setContexts(response.data);
         // Es mejor registrar la respuesta directamente
      })
      .catch(error => {
        console.error('Hubo un error al obtener contexts', error);
      });
  }, []); // Dependencias vacías, se ejecuta solo al montar el componente
  
  useEffect(() => {
    axios.get(apiUrls.getGeneral)
      .then(response => {
         setGeneral(response.data);
         // Es mejor registrar la respuesta directamente
      })
      .catch(error => {
        console.error('Hubo un error al obtener general', error);
      });
  }, []); // Dependencias vacías, se ejecuta solo al montar el componente
  
  // Función para navegar a la última diapositiva
  const goResults = () => {
    navigate('/Resultados'); // Si no hay ID_cliente, redirige a /main
  };
   
 
  // Función para navegar a la última diapositiva
  const goToLastSlide = () => {
    const lastIndex = questions.length - 1;
    sliderRef.current.slickGoTo(lastIndex+24+12);
  };

  const allQuestionsAnswered = Object.values(answers).every(answer => answer !== null);
  const generald = {};
  const contexto = {};
  const pregunta = {};
  useEffect(() => {
    // Obtener preguntas+¿}{ 
      //apiUrls.getQuestions  apiUrls.resultados
    axios.get(apiUrls.getQuestions)
      .then(response => {
        setQuestions(response.data);
        const allAnswered = questions.length > 0 && 
        Object.keys(answers).length === questions.length && 
        Object.values(answers).every(answer => answer !== null);
if (allAnswered) {
goToLastSlide();
}
        // Una vez que las preguntas se han cargado, verifica las respuestas del usuario
        return axios.post(apiUrls.userResponses, { ID_cliente });
      })
      .then(response => {
        // Procesar las respuestas del usuario y actualizar el estado
        const userResponses = response.data[0]; // Access the first element which is the array of responses
        const responsesMap = userResponses.reduce((acc, current) => {
          acc[current.ID_pregunta] = parseInt(current.Respuesta, 10); // Make sure to parse the response as an integer

 
          return acc;
        }, {});
        setAnswers(responsesMap);

        userResponses.forEach(response => {
          const { ID_pregunta, Respuesta, ID_tema } = response;
      
          switch(ID_tema) {
            case 'General':
              generald[ID_pregunta] = Respuesta;
             
              break;
            case 'Contextos':
              contexto[ID_pregunta] = Respuesta;
              break;
            case 'Preguntas':
             
              const parsedRespuesta = parseInt(Respuesta, 10);
      
              // Comprueba si la respuesta es un número entero y actualiza el acumulador
        
            
              pregunta[ID_pregunta] = parsedRespuesta;
              break;
            default:
              // Manejar cualquier otro caso
          }
        });
      
        // Establecer los estados con las respuestas procesadas
        setAnswersGeneral(generald);
        setAnswersContexto(contexto);
        setAnswersPregunta(pregunta);
        
     
      })
      .catch(error => {
        console.error('Hubo un error al obtener las preguntas o las respuestas del usuario', error);
      });
  }, [ID_cliente, allQuestionsAnswered]);
 
  // Este useEffect se ejecutará cada vez que el estado de 'answers' cambie.
useEffect(() => {
    const checkAllQuestionsAnswered = () => {
      const allAnswered = questions.length > 0 && 
                          Object.keys(answers).length === questions.length && 
                          Object.values(answers).every(answer => answer !== null);
      if (allAnswered) {
        goToLastSlide();
      }
    };
  
    // Llama a la función de verificación cada vez que el estado de 'answers' cambia
    checkAllQuestionsAnswered();
  }, [answers, questions.length]); // Dependencias del useEffect

  
 
  const settings = {
    dots: false,
    infinite: false,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false, // Desactiva el deslizamiento con el mouse
    arrows: false, // Oculta los botones laterales
    asNavFor: thumbnailSliderRef.current,
    beforeChange: (current, next) => setCurrentSlide(next),
    // ... otras configuraciones que necesites
  };
  const settingsThumbnails = {
    slidesToShow: 10, // Ajusta este número según el espacio disponible o la cantidad de diapositivas
    slidesToScroll: 5,
    focusOnSelect: true,
    centerMode: true, // Esto ayuda a centrar la miniatura seleccionada
    asNavFor: sliderRef.current, // Esto enlaza el slider secundario con el principal
    // ... otras configuraciones que necesites
  };
 
  const handlePause = () => {
    // Aquí iría cualquier lógica para guardar el estado del examen
    navigate('/'); // Redirige al usuario a '/main'
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] != null).length;
    return (answeredQuestions / questions.length) * 100;
  };
  
  const progressPercentage = calculateProgress();
  const handleAnswerChange = async (questionId, option) => {
    // Actualiza las respuestas con la nueva selección
    const updatedAnswers = {
      ...answers_pregunta,
      [questionId]: option
    };
  
    setAnswers(updatedAnswers);
    setAnswersPregunta(updatedAnswers);
    
   
    // Envía la actualización al backend
    try {
      const response = await axios.post(apiUrls.updateAnswer, {
        ID_pregunta: questionId,
        ID_cliente: ID_cliente,
        Respuesta: option
      }); 
     
      console.log(response.data.total)
      console.log("console.log(response.data.total)",response.data.ID_local)
       
      goToNext();
      const response2 = await axios.post(apiUrls.cambiarDato, {
        renglon:response.data.ID_local ,
        columna: 9,
        dato: response.data.total
      }); 
    } catch (error) {
      console.error('Error updating the response:', error);
    }
  
   };
  
   const handleAnswerChange2 = async (questionId, option) => {
    // Actualiza las respuestas con la nueva selección
    const updatedAnswers = {
      ...answers_contexto,
      [questionId]: option
    };
  
    //setAnswers(updatedAnswers);
    setAnswersContexto(updatedAnswers);
    // Envía la actualización al backend
    try {
      const response = await axios.post(apiUrls.updateAnswer2, {
        ID_pregunta: questionId,
        ID_cliente: ID_cliente,
        Respuesta: option
      });
      console.log(response.data);
      goToNext();
    } catch (error) {
      console.error('Error updating the response:', error);
    }
  
   };
  

   const handleAnswerChange3 = async (questionId, option) => {
    // Actualiza las respuestas con la nueva selección
    const updatedAnswers = {
      ...answers_general,
      [questionId]: option
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
  
   };

   const findFirstAnswered = () => {
    // Busca la primera pregunta que ha sido respondida
    for (let i = 0; i < questions.length; i++) {
      if (typeof answers[questions[i].ID] !== 'undefined') {
        return i; // Retorna el índice de la primera pregunta respondida
      }
    }
    return -1; // Retorna -1 si ninguna pregunta ha sido respondida
  };
  
  // Luego puedes usar esta función para navegar a la primera pregunta respondida
  const goToFirstAnswered = () => {
    const index = findFirstAnswered();
    if (index !== -1) {
      sliderRef.current.slickGoTo(index);
    } else {
      // Manejar el caso donde ninguna pregunta ha sido respondida
      console.log("No hay preguntas respondidas aún");
    }
  };
  

  // Funciones para navegar entre las diapositivas
  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const findFirstUnanswered = () => {
    const unansweredIndex = questions.findIndex(
      (question) => answers[question.ID] == null
    );
    return unansweredIndex >= 0 ? unansweredIndex : 0;
  };


  
const findNextUnanswered = () => {
    const currentSlide = sliderRef.current?.innerSlider?.currentSlide || 0;

    for (let i = currentSlide + 1; i < questions.length; i++) {
        if (typeof answers[questions[i].ID] === 'undefined') {
            return i;
        }
    }

    return -1; // Retornar -1 si todas las preguntas han sido respondidas
};
 
  

  const goToFirstUnanswered = () => {
    const index = findFirstUnanswered();
    sliderRef.current.slickGoTo(index);
  };

  const goToNextUnanswered = () => {
 
        const allAnswered = questions.length > 0 && 
                            Object.keys(answers).length === questions.length && 
                            Object.values(answers).every(answer => answer !== null);
        if (allAnswered) {
          goToLastSlide();
        }

      else {
        console.log("index")
      const index = findNextUnanswered();
      console.log(index)
      if (index >= 0) {
        sliderRef.current.slickGoTo(index+1);
      }
    }
  };

  const handleDownloadResults = () => {
    console.log("Descargando resultados...");
    // Aquí iría la lógica para generar y descargar los resultados
  };

  // Función para reiniciar el test
  const handleResetTest = () => {
    console.log("Reiniciando test...");
    // Aquí iría la lógica para reiniciar el test, por ejemplo, limpiar el estado 'answers'
    setAnswers({});
    // Y regresar a la primera pregunta
    sliderRef.current.slickGoTo(0);
  };

  // Función para enviar los resultados
  const handleSubmitResults = () => {
    console.log("Enviando resultados...");
    // Aquí iría la lógica para enviar los resultados a un servidor o realizar otra acción
  };
  
 
  useEffect(() => {
    // Esta función verifica si todas las preguntas han sido respondidas
    const checkAllQuestionsAnswered = () => {
      const allAnswered = questions.length > 0 
        && Object.keys(answers).length === questions.length 
        && Object.values(answers).every(answer => answer != null);

      if (allAnswered) {
        goToLastSlide();
      }
    };

    // Llama a la función de verificación cada vez que el estado de 'answers' cambia
    checkAllQuestionsAnswered();
  }, [answers, questions.length]); // Dependencias del useEffect

  
  const handleTextChange = (questionId, text) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: text
    };
  
     setAnswers(updatedAnswers);
  
    // Llama a cualquier otra función que necesites ejecutar cuando cambie el texto
    // Por ejemplo, podrías querer enviar la respuesta al backend
    // updateResponseOnServer(questionId, text);
  };
  
  const handleKeyPress = (e, questionId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Previene el comportamiento por defecto de Enter, que es insertar una nueva línea
  
      // Llama a la función que deseas ejecutar cuando Enter es presionado
      handleAnswerChange2(questionId, e.target.value);
      
      // Si quieres resetear el área de texto después de presionar Enter, puedes hacerlo aquí
      // e.target.value = ''; (No lo hagas si estás controlando el valor con el estado)
    }
  };

  const handleTextChange3 = (questionId, text) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: text
    }));
  
    // Llama a cualquier otra función que necesites ejecutar cuando cambie el texto
    // Por ejemplo, podrías querer enviar la respuesta al backend
    // updateResponseOnServer(questionId, text);
  };
  const handleKeyPress3 = (e, questionId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Previene el comportamiento por defecto de Enter, que es insertar una nueva línea
  
      // Llama a la función que deseas ejecutar cuando Enter es presionado
      handleAnswerChange3(questionId, e.target.value);
      
      // Si quieres resetear el área de texto después de presionar Enter, puedes hacerlo aquí
      // e.target.value = ''; (No lo hagas si estás controlando el valor con el estado)
    }
  };


  const handleUbicacionChange = (questionId, ubicacion) => {
    // Actualizar el estado de las respuestas con la nueva ubicación
    const updatedAnswers = {
      ...answers,
      [questionId]: ubicacion
    };
    setAnswers(updatedAnswers);
  };
  
  const Ir_ultimo = () => {
   
 
  const valores = Object.values(pregunta);
 
  const contexts_c = Object.keys(contexts).length;
  const general_c = Object.keys(general).length;
  const questions_c = Object.keys(questions).length;
  
  const general_respuestas = Object.keys(answers_general).length;
  const contexto_respuestas = Object.keys(answers_contexto).length;
  const pregunta_respuestas = Object.keys(answers_pregunta).length;

  
 let claves = Object.keys(answers_general);
const ultimoGeneral = parseInt(claves[claves.length - 1])-2; 
claves = Object.keys(answers_contexto);
const ultimoContexto = parseInt(claves[claves.length - 1])+12-3; 
claves = Object.keys(answers_pregunta);
const ultimoPregunta = parseInt(claves[claves.length - 1])+12-4+24+10; 


console.log("ultimoGeneral",ultimoGeneral)
console.log("ultimoContexto",ultimoContexto)
console.log("ultimoPregunta",ultimoPregunta)

const currentSlide = sliderRef.current?.innerSlider?.currentSlide || 0;
 
if(ultimoGeneral<14)
sliderRef.current.slickGoTo(ultimoGeneral);

if(ultimoContexto<(24+14))
sliderRef.current.slickGoTo(ultimoContexto);

if(ultimoPregunta<(250+24+14+10))
sliderRef.current.slickGoTo(ultimoPregunta);


if(!ultimoGeneral)
sliderRef.current.slickGoTo(1);
  
};
  return (
 
<div className="carousel-container">
{
    currentSlide !== 0 && currentSlide !== questions.length - 1 && (
  // No muestra estos botones en la primera diapositiva
    <div className="navigation-buttons-top">
      <button onClick={goToPrev} className="button prev-button-top">
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>
      <button onClick={goToNext} className="button next-button-top">
        <FontAwesomeIcon icon={faChevronRight} />
      </button>
      <button onClick={handlePause} className="button continue-later-button">
        Continuar después... <FontAwesomeIcon icon={faSignOutAlt} />
      </button>
    </div>
  )}


      <Slider ref={sliderRef} {...settings}>
        {/* Pantalla de introducción */}
        
        <div key="intro" className="intro-container">
        <h3>  Cuestionario 1</h3>
        <h1>  Tu información General</h1>
          <p> 

          En el siguiente cuestionario registrarás tu información 
          personal. Deberás responder tan detallado como lo desees 
          (recuerda que mientras más te expliques, mejor podremos 
          utilizar esta información para determinar tus resultados
          del Test). 
          ¡Comencemos!😄</p>
          
          <button onClick={Ir_ultimo} className="button next-button">
            Comenzar <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

  
      {/* Preguntas */}
      {general.map((question, index) => {
  // Validar si la pregunta debe mostrarse

  const padreIndex = question.Padre !== "0" ? parseInt(question.Padre, 10) : "0";


  const shouldShowQuestion = 
  question.Padre === "0" || 
  (answers_general[padreIndex] && answers_general[padreIndex] === question.Opcion_padre);
  
   
  if (shouldShowQuestion) {
    return (
      <div key={question.ID}>
        <h1 className="question-indicador">
          {`  Información General:  ${index+1}/${general.length}`}
        </h1>
        <h3 className="question-title">
          {` ${question.Pregunta}`}
        </h3>
        <div className="options-container">
          {
            question.Opciones && question.Opciones.split(";").length > 1 ? (
              question.Opciones.split(";").map((option, index) => {
                const trimmedOption = option.trim();
                const isSelected = answers_general[question.ID] === trimmedOption;
                return (
                  <button
                    key={index}
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange3(question.ID, trimmedOption)}
                  >
                    {trimmedOption}
                  </button>
                );
              })
              ) : 
             question.Opciones === "selector_ciudad" ? (
              <SelectorUbicacion 
              pais={pais} 
              estado={estado} 
              ciudad={ciudad}
              onPaisChange={setPais}
              onEstadoChange={setEstado}
              onCiudadChange={setCiudad}
              onButtonClick={(value) => handleAnswerChange3(question.ID, value)}
             
            />
              ) : (
            
   
           
              <div className="text-answer-area">
                
       
              <TextAreaComponent
                questionId={question.ID}
                value= {` ${answers_general[question.ID] || ""}`}
                onChange={handleTextChange3}
                onButtonClick={(value) => handleAnswerChange3(question.ID, value)}
              />
            </div>
            
            )
            
          }
        </div>

        <div className="options-botones" hidden>
          <button onClick={goToFirstAnswered} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
          <button onClick={goToPrev} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
          <button onClick={goToNext} className="button next-button">
            Siguiente <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button onClick={goToNextUnanswered} className="button next-button">
            Siguiente sin respuesta <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    );
  }
  return null; // No mostrar la pregunta si no cumple con las condiciones
})}

    {/* Pantalla de introducción */}
        
    <div key="intro" className="intro-container">
        <h3>  Cuestionario 2</h3>
        <h1>  Información de contexto</h1>
          <p> 
          Hemos capturado tus datos correctamente. 
          Esto apenas va iniciando 😁
          </p>
          
          <button onClick={goToNext} className="button next-button">
            Continuar <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

          
      {/* Preguntas */}
{contexts.map((question, index) => {
  // Validar si la pregunta debe mostrarse

  const padreIndex = question.Padre !== "0" ? parseInt(question.Padre, 10) : "0";


  const shouldShowQuestion = 
  question.Padre === "0" || 
  (answers_contexto[padreIndex] && answers_contexto[padreIndex] === question.Opcion_padre);
  
   
  if (shouldShowQuestion) {
    return (
      <div key={question.ID}>
           <h1 className="question-indicador">
          {` Información de Contexto: ${index+1}/${contexts.length}`}
        </h1>
  
        <h3 className="question-title">
          {`    ${question.Pregunta}`}
        </h3>
        <div className="options-container">
          {
            question.Opciones && question.Opciones.split(";").length > 1 ? (
              question.Opciones.split(";").map((option, index) => {
                const trimmedOption = option.trim();
                const isSelected = answers_contexto[question.ID] === trimmedOption;
                return (
                  <button
                    key={index}
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange2(question.ID, trimmedOption)}
                  >
                    {trimmedOption}
                  </button>
                );
              })
            ) : (
              
              <TextAreaComponent
              questionId={question.ID}
              value= {` ${answers_contexto[question.ID] || ""}`}
              onChange={ handleTextChange}
              onButtonClick={(value) => handleAnswerChange2(question.ID, value)}
            />
            )
          }
        </div>

        <div className="options-botones" hidden>
          <button onClick={goToFirstAnswered} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
          <button onClick={goToPrev} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
          <button onClick={goToNext} className="button next-button">
            Siguiente <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <button onClick={goToNextUnanswered} className="button next-button">
            Siguiente sin respuesta <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    );
  }
  return null; // No mostrar la pregunta si no cumple con las condiciones
})}
   {/* Pantalla de introducción */}
        
   <div key="intro" className="intro-container">
        <h3>  Cuestionario de aptitudes e interéses</h3>
        <h1>  Test Vocacional</h1>
          <p> 
          La idea de la siguiente serie de actividades es que la clasifiques según tus gustos, es decir, el interés que tienes por realizarlas. Lo único que debes hacer, es seleccionar la respuesta que más se acerque a tu interés, donde:
          <p>   1 = Me desagrada totalmente</p>
          <p>  2 = Me desagrada</p>
          <p>  3 = Me es indiferente</p>
          <p>  4 = Me gusta</p>
          <p>  5 = Me gusta mucho</p>
          </p>
          
          <button onClick={goToNext} className="button next-button">
            Continuar <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
  
        {questions.map((question, index) => (
            
          <div key={question.ID}>
                        <h1 className="question-indicador">
          {` Pregunta: ${index+1}/${questions.length}`}
        </h1>
            <h3 className="question-title">
              {`  ${question.Pregunta}`}
            </h3>
            <div className="options-container">
              {[1, 2, 3, 4, 5].map(option => {
                const isSelected = answers_pregunta[question.ID] === option;
                return (
                  <button
                    key={option}
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswerChange(question.ID, option)}
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

            <div className="options-botones" hidden>
            <button onClick={goToFirstAnswered} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
            <button onClick={goToPrev} className="button prev-button">
            <FontAwesomeIcon icon={faChevronLeft} /> Atrás
          </button>
            <button onClick={goToNext} className="button next-button">
              Siguiente <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <button onClick={goToNextUnanswered} className="button next-button">
            Siguiente sin respuesta <FontAwesomeIcon icon={faChevronRight} />
          </button>
          </div>
          </div>
        ))}
        {/* Pantalla de resultados */}
        <div key="results">
  <h3>¡Has terminado!</h3>
  <p>Estamos procesando tu información, tus resultados serán enviados a tu celular y correo electrónico...</p>
  
  {/* Botón para descargar resultados */}
  <button onClick={goResults} className="button download-button">
    <FontAwesomeIcon icon={faDownload} /> Ver resultados
  </button>
 
 
 
</div>

      </Slider>

 

    </div>
  );
};

export default Questions;