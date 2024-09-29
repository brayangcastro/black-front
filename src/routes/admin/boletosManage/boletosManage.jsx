import React, { useState, useEffect } from 'react';
import BoletosManageView from './boletosManage-View';
import axios from 'axios';
import apiUrls from '../../../api'; // Importa las URLs dinámicas desde apiUrls.js
import { useNavigate } from 'react-router-dom';

const BoletosManage = () => {
    const navigate = useNavigate();
    const [boletos, setBoletos] = useState([]);
    const [eventos, setEventos] = useState([]); // Para almacenar la lista de eventos
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null); // Evento seleccionado

    const [boleto, setBoleto] = useState({
        Numero: '',
        Nombre: '',
        Apellido: '',
        Estado: '',
        Celular: '',
        Total: 0,
    });

    const [editingBoleto, setEditingBoleto] = useState({
        Numero: '',
        Nombre: '',
        Apellido: '',
        Estado: '',
        Celular: '',
        Total: 0,
    });

    const [boletoDetail, setBoletoDetail] = useState({});
    const [dataBoletoDelete, setDataBoletoDelete] = useState({});
    const [clave, setClave] = useState('');

    // Método para obtener boletos de un evento específico utilizando apiUrls
    const obtenerBoletosPorEvento = async (eventoID) => {
        try {
            const response = await axios.get(apiUrls.getBoletosPorEvento(eventoID));
            return response.data; // Retorna los boletos obtenidos
        } catch (error) {
            console.error("Error al obtener los boletos:", error);
            return [];
        }
    };

    // Método para obtener la lista de eventos
    const obtenerEventos = async () => {
        try {
            const response = await axios.get(apiUrls.getEventos); // URL para obtener los eventos
            setEventos(response.data); // Guardar los eventos obtenidos
            if (response.data.length > 0) {
                setEventoSeleccionado(response.data[0].ID); // Seleccionar el primer evento por defecto
            }
        } catch (error) {
            console.error("Error al obtener los eventos:", error);
        }
    };

    // Cargar boletos al seleccionar un evento
    useEffect(() => {
        if (eventoSeleccionado) {
            const cargarBoletos = async () => {
                const boletosData = await obtenerBoletosPorEvento(eventoSeleccionado);
                setBoletos(boletosData);
            };
            cargarBoletos();
        }
    }, [eventoSeleccionado]); // Volver a cargar boletos cada vez que cambie el evento seleccionado

    // Cargar la lista de eventos cuando el componente se monta
    useEffect(() => {
        obtenerEventos();
    }, []);

    return (
        <>
            <BoletosManageView
                boletos={boletos}
                setBoleto={setBoleto}
                boleto={boleto}
                clave={clave}
                boletoDetail={boletoDetail}
                dataBoletoDelete={dataBoletoDelete}
                setDataBoletoDelete={setDataBoletoDelete}
                editingBoleto={editingBoleto}
                setEditingBoleto={setEditingBoleto}
                eventos={eventos} // Pasamos la lista de eventos a la vista
                setEventoSeleccionado={setEventoSeleccionado} // Pasamos el método para seleccionar evento
                eventoSeleccionado={eventoSeleccionado} // Evento seleccionado actualmente
            />
        </>
    );
};

export default BoletosManage;
