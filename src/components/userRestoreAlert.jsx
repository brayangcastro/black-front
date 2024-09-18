import { Modal, Alert, Button } from "react-bootstrap"

const UserRestoreAlert = (props) => {

    const { showRestore, setShowRestore, handleRestoreTest, dataUser, setShowUserRestoreFeedback } = props;

    const handleClose = () => setShowRestore(false);

    const handleRestore = () => {
        setShowUserRestoreFeedback(handleRestoreTest());
        setShowRestore(false);
    }

    return (
        <>

            <Modal show={showRestore} onHide={handleClose}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="warning">
                        Estás seguro que deseas restaurar el test del usuario <strong>{dataUser.Nombre_usuario} {dataUser.Apellido_usuario}</strong>?
                        <br /><br />
                        La restauración de este test es irreversible.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleRestore}>
                        Restaurar
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default UserRestoreAlert;
