import { Container, Row, Col, Button, Table } from "react-bootstrap"

import { useNavigate } from 'react-router-dom';

const DashboardView = (props) => {

    const { user, universidades, carreras } = props

    return (
        <>
            {user.estadoTest === 0 && (
                <Pendiente />
            )}

            {user.estadoTest === 1 && (
                <Iniciado />
            )}

            {user.estadoTest === 2 && (
                
                <Finalizado
                    universidades={universidades}
                    carreras={carreras}
                />
            )}
        </>
    )
}

const Pendiente = () => {
    const navigate = useNavigate();
   

    const onButtonClick = () => {
        navigate('/test'); // Asegúrate de que la ruta esté correctamente escrita
    };
    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        <h6>Aún no has realizado tu test vocacional.</h6>
                        <br />
                        <h6>Complétalo y podrás ver tus resultados aquí mismo</h6>
                    </Col>
                </Row>

                <br />

                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                    <Button variant="success" onClick={onButtonClick}>
                       
                            COMENZAR TEST
                        </Button>
                       
                    </Col>
                </Row>
            </Container>
        </>
    )
}

const Iniciado = () => {
    const navigate = useNavigate();
    const onButtonClick = () => {
        navigate('/test'); // Asegúrate de que la ruta esté correctamente escrita
    };

    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        <h6>Aún no has finalizado tu test vocacional.</h6>
                        <br />
                        <h6>Complétalo y podrás ver tus resultados aquí mismo</h6>
                    </Col>
                </Row>

                <br />

                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                    <Button variant="success" onClick={onButtonClick}>
                            CONTINUAR TEST
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

const Finalizado = (props) => {
    const navigate = useNavigate();
    const { universidades, carreras } = props
    const verResultados = () => {
        navigate('/resultados'); // Asegúrate de que la ruta esté correctamente escrita
    };
    return (
        <>
               <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        <h6>Felicidades, ya tenemos tus resulatos.</h6>
                        <br />
                        <h6>....</h6>
                    </Col>
                </Row>

                <br />

                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                    <Button variant="success" onClick={verResultados}>
                            VER MIS RESULTADOS
                        </Button>
                    </Col>
                </Row>
            </Container>

        </>
    )
}


export default DashboardView
