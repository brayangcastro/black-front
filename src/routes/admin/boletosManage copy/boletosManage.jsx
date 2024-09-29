import React from 'react';
import { useState, useEffect } from 'react';
import UserManageView from "./clientesManage-View";
import axios from 'axios';
import apiUrls from '../../../api';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const BoletosManage = () => {
    
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({
        Nombre: '',
        Apellido: '',
        Email: '',
        Celular: '',
        publicMetadata: {},
    });

    const [editingUser, setEditingUser] = useState({
        Nombre: '',
        Apellido: '',
        Email: '',
        Celular: '',
        publicMetadata: {},
    });

    const [userDetail, setUserDetail] = useState({});
    const [dataUserDelete, setDataUserDelete] = useState({});
    const [clave, setClave] = useState('');

    const apiGetUsers = apiUrls.getAllUsers;
 
 

    useEffect(() => {
        axios.get(apiGetUsers)
            .then(response => {
                const usuarios = response.data;
                setData(usuarios);
            
            })
            .catch(error => {
                console.error('Error al obtener datos de la API:', error);
            });
    }, []);

    

    return (
        <>
            <UserManageView
                users={data} 
                
                setUser={setUser}
                user={user} 
                clave={clave}
               
                userDetail={userDetail} 
                dataUserDelete={dataUserDelete}
                setDataUserDelete={setDataUserDelete}
                
                editingUser={editingUser}
                setEditingUser={setEditingUser}
            />
        </>
    );
};

export default BoletosManage;
