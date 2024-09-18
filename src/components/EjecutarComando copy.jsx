import React, { useState } from 'react';
import axios from 'axios';
import apiUrls from '../api';

const EjecutarComando = () => {
    const [command, setCommand] = useState('');
    const [output, setOutput] = useState('');

    const handleCommandChange = (e) => {
        setCommand(e.target.value);
    };

    const executeCommand = async (commandToExecute) => {
        try {
            const response = await axios.post(apiUrls.ejecutarComando, { command: commandToExecute });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(`Error: ${error.response ? error.response.data.error : error.message}`);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Ejecutar Comando en el Servidor</h2>

            <div style={styles.inputContainer}>
                {/* Entrada de texto para comandos personalizados */}
                <input
                    type="text"
                    value={command}
                    onChange={handleCommandChange}
                    placeholder="Ingresa tu comando"
                    style={styles.input}
                />
                <button onClick={() => executeCommand(command)} style={styles.button}>Ejecutar Comando Personalizado</button>
            </div>

            <hr style={styles.divider} />

            {/* Botones para comandos predefinidos */}
            <div style={styles.buttonContainer}>
                <button onClick={() => executeCommand('sudo systemctl restart cups')} style={styles.button}>Reiniciar CUPS</button>
                <button onClick={() => executeCommand('sudo udevadm trigger --subsystem-match=usb --action=add')} style={styles.button}>Reiniciar USB</button>
                <button onClick={() => executeCommand('sudo systemctl restart nginx')} style={styles.button}>Reiniciar Nginx</button>
                <button onClick={() => executeCommand('sudo systemctl restart apache2')} style={styles.button}>Reiniciar Apache2</button>
            </div>

            <pre style={styles.output}>{output}</pre>
        </div>
    );
};

// Estilos en línea
const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    input: {
        flex: '1',
        padding: '8px',
        marginRight: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '8px 16px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    divider: {
        margin: '20px 0',
    },
    output: {
        backgroundColor: '#e9e9e9',
        padding: '10px',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    },
};

export default EjecutarComando;
