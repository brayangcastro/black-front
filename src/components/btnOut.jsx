import Iconlogout from '../assets/icons/logout.svg'
import { SignOutButton } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
const btnOut = () => {
    const navigate = useNavigate(); // Correctamente invocado dentro del componente

    //función cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('ID_cliente');
        // O si usaste sessionStorage
        // sessionStorage.removeItem('ID_cliente');
        
        navigate('/');
    }


    return (
        <>
            <SignOutButton>
                <img src={Iconlogout}
                    onClick={
                        handleLogout
                    }
                    height={'30px'}
                />
            </SignOutButton>
        </>
    )
}

export default btnOut