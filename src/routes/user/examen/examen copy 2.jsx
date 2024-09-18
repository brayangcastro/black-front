import { useState, useEffect,useRef } from 'react';
import ExamenView from './examen-view';
import axios from 'axios';
import apiUrls from '../../../api';

import { useNavigate } from 'react-router-dom';

 
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CarouselStyles.css';

// Importa los íconos de FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSignOutAlt, faChevronLeft, faChevronRight  ,faDownload, faRedo, faPaperPlane} from '@fortawesome/free-solid-svg-icons';

// Declara la URL de la API como una constante
const API_URL = 'http://localhost:3001';

 
const Questions = () => {
  const sliderRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const ID_cliente = '1'; // Reemplazar con el ID real del cliente
  const [currentSlide, setCurrentSlide] = useState(0);
  // Agregamos el manejador de cambio de slide a la configuración de react-slick

  const navigate = useNavigate(); // Hook para la navegación
  
  // Verifica si todas las preguntas han sido respondidas
  const allQuestionsAnswered = Object.values(answers).every(answer => answer !== null);

  // Función para navegar a la última diapositiva
  const goToLastSlide = () => {
    const lastIndex = questions.length - 1;
    sliderRef.current.slickGoTo(lastIndex);
  };


  useEffect(() => {
    // Obtener preguntas+¿}{
      console.log(API_URL)
      //apiUrls.getQuestions
    axios.get(`${API_URL}/questions/all`)
      .then(response => {
        setQuestions(response.data);
        if (allQuestionsAnswered) {
          // Si todas las preguntas están respondidas, navega a la última diapositiva
          goToLastSlide();
        }
        // Una vez que las preguntas se han cargado, verifica las respuestas del usuario
        return axios.post(`${API_URL}/questions/userResponses`, { ID_cliente });
      })
      .then(response => {
        // Procesar las respuestas del usuario y actualizar el estado
        const userResponses = response.data[0]; // Access the first element which is the array of responses
        const responsesMap = userResponses.reduce((acc, current) => {
          acc[current.ID_pregunta] = parseInt(current.Respuesta, 10); // Make sure to parse the response as an integer
          return acc;
        }, {});
        setAnswers(responsesMap);
      })
      .catch(error => {
        console.error('Hubo un error al obtener las preguntas o las respuestas del usuario', error);
      });
  }, [ID_cliente, allQuestionsAnswered]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1 ,
    beforeChange: (current, next) => setCurrentSlide(next)
 
  };
 
  const handlePause = () => {
    // Aquí iría cualquier lógica para guardar el estado del examen
    navigate('/main'); // Redirige al usuario a '/main'
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(answers).filter(key => answers[key] != null).length;
    return (answeredQuestions / questions.length) * 100;
  };
  const handleAnswerChange = async (questionId, option) => {
    // Actualiza las respuestas con la nueva selección
    const updatedAnswers = {
      ...answers,
      [questionId]: option
    };
  
    setAnswers(updatedAnswers);
  
    // Envía la actualización al backend
    try {
      const response = await axios.post(`${API_URL}/questions/addOrUpdateResponse`, {
        ID_pregunta: questionId,
        ID_cliente: ID_cliente,
        Respuesta: option
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error updating the response:', error);
    }
  
    // Comprueba si es la última pregunta después de la actualización de la respuesta
     
    // No avances automáticamente a la última diapositiva aquí
    // Deja que el useEffect maneje el cambio de diapositiva basado en el estado actualizado
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
    const currentSlide = sliderRef.current.innerSlider.currentSlide;
    const nextUnansweredIndex = questions.slice(currentSlide + 1).findIndex(
      (question) => answers[question.ID] == null
    );
    return nextUnansweredIndex >= 0 ? currentSlide + 1 + nextUnansweredIndex : -1;
  };

  const goToFirstUnanswered = () => {
    const index = findFirstUnanswered();
    sliderRef.current.slickGoTo(index);
  };

  const goToNextUnanswered = () => {
    if (allQuestionsAnswered) {
      goToLastSlide(); // Si todas las preguntas están respondidas, ve a la última diapositiva
    } else {
      const index = findNextUnanswered();
      if (index >= 0) {
        sliderRef.current.slickGoTo(index);
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
         
          <h3>Bienvenido</h3>
          <p>Sigue las instrucciones para comenzar.</p>
          <button onClick={goToNext} className="button next-button">
            Siguiente <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
        {/* Preguntas */}
        {questions.map((question, index) => (
          <div key={question.ID}>
            <h3 className="question-title">
              {`Pregunta ${index + 1} de ${questions.length}: ${question.Pregunta}`}
            </h3>
            <div className="options-container">
              {[1, 2, 3, 4, 5].map(option => {
                const isSelected = answers[question.ID] === option;
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

            <div className="options-botones">
            <button onClick={goToFirstUnanswered} className="button prev-button">
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
  <p>Aquí están tus resultados.</p>
  
  {/* Botón para descargar resultados */}
  <button onClick={handleDownloadResults} className="button download-button">
    <FontAwesomeIcon icon={faDownload} /> Descargar Resultados
  </button>

  {/* Botón para reiniciar el test */}
  <button onClick={handleResetTest} className="button reset-button">
    <FontAwesomeIcon icon={faRedo} /> Reiniciar Test
  </button>

  {/* Botón para enviar resultados */}
  <button onClick={handleSubmitResults} className="button submit-button">
    <FontAwesomeIcon icon={faPaperPlane} /> Enviar Resultados
  </button>
 
</div>

      </Slider>
    </div>
  );
};

export default Questions;