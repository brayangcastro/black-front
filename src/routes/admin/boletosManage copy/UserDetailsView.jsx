import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const UserDetailsView = ({ showModal, setShowUserDetails, userDetail }) => {
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

    return (
        <Modal show={showModal} onHide={() => setShowUserDetails(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered>
                    <tbody>
                        <tr>
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
