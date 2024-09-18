import React, { useState } from 'react';
import { Container, ProgressBar, Button, ButtonGroup } from 'react-bootstrap';
import './ExamenView.css'; // Asegúrate de crear este archivo CSS en el mismo directorio

const Question = ({ text, onChange, selectedOption, options }) => {
  return (
    <div className="question">
      <h6>{text}</h6>
      <ButtonGroup>
        {options.map(option => (
          <Button 
            key={option} 
            variant={selectedOption === option ? "success" : "outline-primary"}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

const ExamenView = ({ pregunta, progress, onNext }) => {
  return (
      <Container className="examen-view-container">
          <ProgressBar now={progress} label={`${progress.toFixed(2)}% Completado`} variant="info" />
          {pregunta && (
              <Question
                  text={pregunta.Pregunta}
                  onChange={(answer) => console.log(`Respuesta: ${answer}`)} // Aquí manejas la respuesta
                  options={["Nada", "Un poco", "Neutral", "Algo", "Mucho"]}
              />
          )}
          <Button variant="primary" onClick={onNext}>Siguiente pregunta</Button>
      </Container>
  );
};


export default ExamenView;
