import { useState } from 'react'
import { Modal, Alert, Button } from "react-bootstrap"

const UserDelAlert = (props) => {

    const { showDelete, setShowDelete, handleDeleteUser, dataUserDelete } = props;

    const handleClose = () => setShowDelete(false);

    return (
        <>

            <Modal show={showDelete} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="danger">
                        ¿ Estás seguro que deseas eliminar el usuario <strong>{dataUserDelete.Nombre} </strong>?
                        <br /><br />
                        La elminación de este usuario es irreversible.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default UserDelAlert;
