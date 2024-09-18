import { SignIn } from '@clerk/clerk-react';

import { Container, Row, Col } from 'react-bootstrap';

function LoginPage() {
    return (
        <div className='login-bgnd'>
            <Container className='login'>
                <Row className='no-margen'>
                    <Col>
                        <SignIn />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;
