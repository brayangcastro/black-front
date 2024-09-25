import { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter, Routes, Route, Outlet  } from 'react-router-dom';
import { Dashboard, NoAcceso, Examen, CambioContrasena } from './user/userRoutes';
import { UsuariosManage, UserManage, TicketsManage, ProductsManage, ConversManage, ClientesManage,
    TorneosManage,OrdenesManage,VentasManage,MesasManage, CalendarioManage,
    InventarioManage,IngresoManage,CuentasManage
    , Dashboard as DasboardAdmin } from './admin/adminRoutes'

import Layout from '../Layout';
import Login from './login/login';
import Signin from './login/signin';
import LockScreen from '../components/LockScreen';
import ReportManage from '../components/ReportManage';
import ReportManageRango from '../components/ReportManageRango'; 
import EjecutarComando from '../components/EjecutarComando'; 
import ListaTicketsSoporte from '../components/ListaTicketsSoporte';
import AccessScreen from '../components/AccessScreen';
import IngresosView from '../components/IngresosView';
import OrderDetails from '../components/OrderDetails';

const initialState = {
    tipoUsuario: 1,
    accesoTest: 1,
    estadoTest: 0,
    id_usuario: "",
};



const baseRouter = import.meta.env.VITE_BASENAME;

function useAuth() {
    const getToken = () => localStorage.getItem('userToken') ? true : false;
    const [isAuthenticated, setIsAuthenticated] = useState(getToken());

    useEffect(() => {
        // Esta función se llama cada vez que el evento 'storage' se dispara
        const onStorageChange = () => {
            setIsAuthenticated(getToken());
        };

        // Agrega un escuchador al evento 'storage'
        window.addEventListener('storage', onStorageChange);

        // Limpia el evento al desmontar el componente
        return () => {
            window.removeEventListener('storage', onStorageChange);
        };
    }, []);

    return { isAuthenticated };
}
function AppRouter() {
    const [usuario, setUsuario] = useState(initialState);
    const { isAuthenticated } = useAuth();


    return (
         
          <BrowserRouter basename={baseRouter} >
             {/* <BrowserRouter basename="/estacion" > */}
            <Routes>
            <Route path="/lockscreen" element={<LockScreen />} /> {/* Ruta agregada para LockScreen */}
            <Route path="/order/:orderId" element={ <OrderDetails /> } />
                    
                {isAuthenticated ? (
                    <Route element={<Outlet />}>
                        <Route path="/" element={<Layout><VentasManage /></Layout>} />
 
                        
                         
                        <Route path="/cuentas" element={<Layout><CuentasManage /></Layout>} />
                        <Route path="/ejecutar" element={<Layout><EjecutarComando /></Layout>} />
                        <Route path="/soporte" element={<Layout><ListaTicketsSoporte /></Layout>} />

                        <Route path="/acceso" element={<Layout><AccessScreen /></Layout>} />

                        <Route path="/inventario" element={<Layout><InventarioManage /></Layout>} />
                        <Route path="/ingreso" element={<Layout><IngresoManage /></Layout>} />
                        <Route path="/compras" element={<Layout><IngresosView /></Layout>} />

                        
                        
                        <Route path="/dashboard" element={<Layout><DasboardAdmin /></Layout>} />
                        <Route path="/ordenes" element={<Layout><OrdenesManage /></Layout>} />
                        <Route path="/ventas" element={<Layout><VentasManage /></Layout>} />
                        <Route path="/mesas" element={<Layout><MesasManage /></Layout>} />
                        <Route path="/lockscreen" element={<LockScreen />} /> {/* Ruta agregada para LockScreen */}
                        <Route path="/login" element={<Login />} /> {/* Ruta agregada para LockScreen */}
                        <Route path="/calendario" element={<Layout><CalendarioManage /></Layout>} />
                        <Route path="/reporteRango/:start_date/:end_date" element={<Layout><ReportManageRango /></Layout>} />
                       
                        
          
                          {/* Ruta para manejar una orden específica con su ID */}
                          <Route path="/ordenes/:ordenId" element={<Layout><OrdenesManage /></Layout>} />
                          <Route path="/ventas/:mesaId" element={<Layout><VentasManage /></Layout>} />
                          <Route path="/mesas/:mesaId" element={<Layout><MesasManage /></Layout>} />

                        
                        <Route path="/tickets" element={<Layout><TicketsManage /></Layout>} />
                        <Route path="/products" element={<Layout><ProductsManage /></Layout>} />
                        <Route path="/convers" element={<Layout><ConversManage /></Layout>} />
                        <Route path="/clientes" element={<Layout><ClientesManage /></Layout>} />
                        <Route path="/usuarios" element={<Layout><UsuariosManage /></Layout>} />
                        <Route path="/torneos" element={<Layout><TorneosManage /></Layout>} />
                        <Route path="/reportes/:corte_id" element={<Layout><ReportManage /></Layout>} />
                        
                        <Route path="/reportes" element={<Layout><ReportManage /></Layout>} />
                        <Route path="/reporteRango/:start_date/:end_date" element={<Layout><ReportManageRango /></Layout>} />
                      
                        

                    </Route>
                ) : (
                    <Route element={<Outlet />}>
                        <Route path="/" element={<Login />} />
                        <Route path="/registro" element={<Signin />} />
                    </Route>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;