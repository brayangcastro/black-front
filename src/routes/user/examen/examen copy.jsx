import { useState, useEffect } from 'react';
import ExamenView from './examen-view';
import axios from 'axios';
import apiUrls from '../../../api';
 

const Examen = () => {
    const [data, setData] = useState([]);
    const apiGetQuestions = apiUrls.getQuestions;

    useEffect(() => {
        // Realizar la solicitud a la API
        axios.get(apiGetQuestions)
            .then(response => {
                // Guardar los datos en el estado
                setData(response.data);
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error al obtener datos de la API:', error);
            });
    }, []); // El segundo argumento del useEffect asegura que la solicitud se realice solo una vez al cargar el componente

     
 
    return (
        <>
            {/* Pasar los datos al componente UserManageView */}
            <ExamenView
                users={data} 
                 
            />
        </>
    );
};

export default Examen;
