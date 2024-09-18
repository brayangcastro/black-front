import React from 'react';
import { Modal, Button, Table,Form } from 'react-bootstrap';

const urlClientes = import.meta.env.VITE_APP_URL_CLIENTES;

const UserDetailsView = ({users, showModal, setShowUserDetails, userDetail }) => {
    // Esta función intenta parsear la descripción como JSON y devuelve un objeto.
    const parseDescription = (description) => {
        try {
            return JSON.parse(description);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return {}; // Retorna un objeto vacío si hay un error.
        }
    };

    // Parsea los metadatos del usuario desde la descripción.
    const userDetails = parseDescription(userDetail?.Descripcion || '{}');
console.log("userDetail ID",userDetail.ID)
    const userFullDetails = users.find(user => user.ID === userDetail.Id_usuario);
console.log("userFullDetails",userFullDetails)

    return (
        <Modal show={showModal} onHide={() => setShowUserDetails(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <tbody>
                        <tr hidden >
                            <th>Nombre Completo</th>
                            <td>{userDetail?.NombreCompleto}</td>
                        </tr>
                        {/* Aquí puedes agregar más filas para los detalles básicos del usuario si los hay. */}
                        {/* Itera sobre las propiedades de los detalles del usuario para mostrarlos. */}
                        {Object.entries(userDetails).map(([key, value]) => (
                            <tr key={key}>
                                <th>{key}</th>
                                <td>{value.toString()}</td>
                            </tr>
                        ))}
 <tr   >
<Form.Group className="mb-3">
                        <Form.Label>Imagen Actual del Cliente</Form.Label>
                        <div>
                            <img
                                src={`${urlClientes}sku-${userDetail.ID}.jpg`}
                                onError={(e) => e.target.src = `${urlClientes}sku-default.jpg`}

                                style={{ width: '300px'  }}
                                alt="Cliente"
                            />
                        </div>
                    </Form.Group>
                    </tr>

                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowUserDetails(false)}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetailsView;
