import React, { useEffect, useState } from 'react';
import './SplashScreen.css'; // Asegúrate de crear este archivo CSS y colocar los estilos correspondientes

const SplashScreen = ({ onFinished }) => {
  const [animationPhase, setAnimationPhase] = useState('logo');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationPhase === 'logo') {
        setAnimationPhase('title');
      } else if (animationPhase === 'title') {
        onFinished(); // Llama a esta función para terminar la animación y mostrar el menú principal
      }
    }, 3000); // Cambia al título después de 3 segundos y luego finaliza

    return () => clearTimeout(timer);
  }, [animationPhase, onFinished]);

  return (
    <div className="splash-screen">
      {animationPhase === 'logo' && <div className="logo-animation"></div>}
      {animationPhase === 'title' && <h1 className="title-animation">NEERD - Test Vocacional</h1>}
    </div>
  );
};

export default SplashScreen;
