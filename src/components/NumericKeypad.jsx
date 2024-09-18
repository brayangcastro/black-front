function NumericKeypad({ onEnter, onInput }) {
    const handleInput = (value) => {
      onInput(value); // Función para manejar la entrada de cada número
    };
  
    const handleEnter = () => {
      onEnter(); // Función para manejar la acción de entrar
    };
  
    return (
      <div className="numeric-keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button key={number} onClick={() => handleInput(number)}>
            {number}
          </button>
        ))}
        <button onClick={handleEnter}>ENTRAR</button>
      </div>
    );
  }
  

  
export default NumericKeypad;
