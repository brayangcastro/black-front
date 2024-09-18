import { Container, Row, Col, Card, Button, InputGroup, Form, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom';
import './signin.css'; // Asegúrate de que el archivo CSS está en la misma carpeta y correctamente referenciado

const Signin = (props) => {

  const { user, setUser, clave, handleCreateUser, registrado, error ,errorMessage} = props;


  const handleCreate = () => {
    handleCreateUser();
  }

  return (
    <div className='login-bgnd'>
      <Container className='login d-flex align-items-center justify-content-center vh-100'>
        <Card style={{ width: '25rem' }} className="card-signup">

          {registrado ? (
            <>
              <Alerta clave={clave} />
            </>
          ) : (
            <>
              {error && <Error message={errorMessage} />}
              <Registro user={user} setUser={setUser} handleCreate={handleCreate} />
            </>
          )}

        </Card>
      </Container>
    </div>
  );
};

const Error = ({ message }) => {
  return (
      <Alert variant="danger">
          {message}
      </Alert>
  );
}

const Alerta = (props) => {

  const { clave } = props;

  return (
    <>
      <Card.Body>
        <h5>Registro exitoso</h5>
        <br />
        <Alert variant="success" >
          Se ha registrado exitosamente!
          <br />
          Su contraseña es:
          <br />
          <strong>{clave}</strong>
          <br />
          Guardela antes de continuar.
        </Alert>
        <Button variant="success" className="btn-signup"><Link to="/" className="linkBtn">Volver</Link></Button>
      </Card.Body>
    </>
  );
}

const Registro = (props) => {

  const { user, setUser, handleCreate } = props;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };
  const shopifyUrl = 'https://neerd.org/'; // Cambia esto por la URL real de tu tienda Shopify


  return (
    <>
      <Card.Body>
        <h5>Registro</h5>
        <Card.Text>
          Ingrese sus datos para registrarse
        </Card.Text>

        <InputGroup className="mb-3">
          <Form.Control
            name="Nombre_usuario"
            value={user.Nombre_usuario}
            onChange={handleInputChange}
            placeholder="Nombre"
            aria-label="Nombre"
            aria-describedby="Input-Nombre"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            name="Apellido_usuario"
            value={user.Apellido_usuario}
            onChange={handleInputChange}
            placeholder="Apellido"
            aria-label="Apellido"
            aria-describedby="Input-Apellido"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">✉</InputGroup.Text>
          <Form.Control
            name="Correo_usuario"
            value={user.Correo_usuario}
            onChange={handleInputChange}
            placeholder="Correo@ejemplo.com"
            aria-label="Correo"
            aria-describedby="Input-Correo"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">📱</InputGroup.Text>
          <Form.Control
            name="Telefono_usuario"
            value={user.Telefono_usuario}
            onChange={handleInputChange}
            placeholder="Teléfono"
            aria-label="Telefono"
            aria-describedby="Input-telefono"
          />
        </InputGroup>

        <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">🔒</InputGroup.Text>
        <Form.Control
            name="Codigo_acceso"
            value={user.Codigo_acceso}
            onChange={handleInputChange}
            placeholder="Ingresa tu código de acceso"
            aria-label="codigo-acceso"
            aria-describedby="Input-codigo-acceso"
        />
    </InputGroup>

        <InputGroup className="mb-3" hidden>
          <InputGroup.Text id="basic-addon1">🎓</InputGroup.Text>
          <Form.Control
            name="Donde_estudiar"
            value={user.Donde_estudiar}
            onChange={handleInputChange}
            placeholder="Donde te gustaría estudiar?"
            aria-label="donde-estudiar"
            aria-describedby="Input-donde-estudiar"
          />
        </InputGroup>

        <Row>
          <Col>
            <InputGroup className="mb-3">
              <Form.Control
                name="Estado_usuario"
                value={user.Estado_usuario}
                onChange={handleInputChange}
                placeholder="Estado"
                aria-label="Estado"
                aria-describedby="Input-Estado"
              />
            </InputGroup>
          </Col>

          <Col>
            <InputGroup className="mb-3">
              <Form.Control
                name="Ciudad_usuario"
                value={user.Ciudad_usuario}
                onChange={handleInputChange}
                placeholder="Ciudad"
                aria-label="Ciudad"
                aria-describedby="Input-Ciudad"
              />
            </InputGroup>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col>
            <h6>⚠️ Se le asignará una contraseña aleatoria</h6>
          </Col>
        </Row>
        <br />

        <Button variant="success" className="btn-signup" onClick={handleCreate}>Continuar</Button>
      
        <Button variant="outline-primary" className="btn-shopify my-3" onClick={() => window.location.href = shopifyUrl}>
  ¿Aún no tienes tu código?, CÓMPRALO AQUÍ
</Button>
        <p className="mutedTxt text-start">¿Ya tiene cuenta? <Link to="/" className="linkTxt">Inicie sesión</Link></p>
      </Card.Body>
    </>
  );
}

export default Signin;
