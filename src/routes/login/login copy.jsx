import { SignIn } from '@clerk/clerk-react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import logoNeerd from '../../assets/img/logo.jpg';

function LoginPage() {
    return (
        <div className='login-bgnd'>
            <Container className='login d-flex align-items-center justify-content-center vh-100 d-md-none'>
                <Row>
                    <Col>
                        <Card className="card-login-mobile">
                            <Card.Body>
                                {/* Logo */}
                                <img src={logoNeerd} alt="logo neerd" className='logo' />

                                {/* Headings */}
                                <h5 className='text-center login-titulo'>Aquí podrás realizar nuestro</h5>
                                <h5 className='text-center bold login-titulo'>Test Vocacional</h5>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        {/* Sign-in component */}
                        <SignIn
                            signUpUrl='/registro'
                            appearance={{
                                variables: { colorPrimary: '#1AB1DE' },
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            
            <Container className='login d-flex align-items-center justify-content-center vh-100 d-none d-md-flex'>
                <Card className="card-login">
                    <Card.Body>
                        <Row>
                            <Col>
                                {/* Logo */}
                                <img src={logoNeerd} alt="logo neerd" className='logo' />

                                {/* Headings */}
                                <h5 className='text-center login-titulo'>Aquí podrás realizar nuestro</h5>
                                <h5 className='text-center bold login-titulo'>Test Vocacional</h5>

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* Sign-in component */}
                                <SignIn
                                    signUpUrl='/registro'
                                    appearance={{
                                        variables: { colorPrimary: '#1AB1DE' },
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container>

        </div>
    );
}

export default LoginPage;