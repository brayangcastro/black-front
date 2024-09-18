import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import { UserForm } from './components';
import axios from 'axios';
import apiUrls from '../api';

const CustomerSelect = (props) => {

    const { customers = [], onSelectCustomer, fetchCostumers } = props;

    // Estados centrales para la lógica de usuario
    const [showUserForm, setShowUserForm] = useState(false);
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(''); // Estado para el valor del input

    const handleCreate = async () => {
        try {
            console.log("nuevo user", user);
            const response = await axios.post(apiUrls.nuevoCliente, { userData: user });
            if (response.error) {
                console.log(response.error);
            } else {
                const updatedResponse = await axios.get(apiUrls.getAllUsers);
                setData(updatedResponse.data);
                console.log('Respuesta de la API:', response.data);
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error.message);
        }
    };

    const generateUniqueCode = async () => {
        try {
            const response = await axios.post(apiUrls.generateUniqueCode);
            return response.data; // Asegúrate de devolver solo el código único
        } catch (error) {
            console.error('Error al generar código único:', error);
            throw error;
        }
    };

    const checkCodeUniqueness = async (manualCode) => {
        try {
            const response = await axios.post(apiUrls.checkCodeUniqueness, { manualCode });
            console.log("checkCodeUniqueness exitosamente.", response.data);
            return response.data; // Asegúrate de devolver solo el código único
        } catch (error) {
            console.error('Error al agregar el checkCodeUniqueness:', error);
        }
    };
    const updateUserCode = async (ID, Codigo) => {
        try {
            const response = await axios.post(apiUrls.updateUserCode, { ID, Codigo });
            console.log("updateUserCode exitosamente.", response.data);
            return response.data; // Asegúrate de devolver solo el código único
        } catch (error) {
            console.error('Error al agregar el updateUserCode:', error);
        }
    };
    
    // Función para mostrar el formulario de usuario
    const handleShowUserForm = () => {
        setUser({ ...user, Celular: inputValue }); // Poner el número de celular en el estado del usuario
        setShowUserForm(true);
        setIsEditing(false); // Asegura que no esté en modo edición
    };

    // Opciones para el componente Select
    const options = customers.map(customer => ({
        value: customer.ID,
        label: `${customer.Nombre} - ${customer.Celular}`
    }));

    // Componente personalizado para cuando no hay opciones
    const NoOptionsMessage = (props) => {
        const inputValue = props.selectProps.inputValue || '';

        if (inputValue.length === 10 && !isNaN(inputValue)) {
            return (
                <components.NoOptionsMessage {...props}>
                    <div
                        onClick={() => {
                            setInputValue(inputValue); // Guarda el valor del input
                            handleShowUserForm();
                        }}
                        style={{
                            background: '#007bff',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            width: '100%',
                            textAlign: 'center'
                        }}
                    >
                        Crear Nuevo Cliente
                    </div>
                </components.NoOptionsMessage>
            );
        }

        return <components.NoOptionsMessage {...props}>No options</components.NoOptionsMessage>;
    };

    return (
        <>
            <Select
                options={options}
                onChange={onSelectCustomer}
                onInputChange={(value) => setInputValue(value)} // Actualiza el valor del input
                placeholder="Seleccionar cliente"
                components={{ NoOptionsMessage }}
                showCustomerSelect={false} // O true, dependiendo de si quieres mostrar el componente o no
            />
            {showUserForm && (
                <UserForm
                    showUserForm={showUserForm}
                    setShowUserForm={setShowUserForm}
                    handleCreate={handleCreate}
                    setUser={setUser}
                    user={user}
                    isEditing={false} // Indica que no está en modo de edición
                    generateUniqueCode={generateUniqueCode}
                    checkCodeUniqueness={checkCodeUniqueness}
                    updateUserCode={updateUserCode}
                    fetchCostumers={fetchCostumers} 
                />
            )}
        </>
    );
};

export default CustomerSelect;
