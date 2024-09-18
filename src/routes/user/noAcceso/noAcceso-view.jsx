import { useState,useEffect } from "react";
import { InputGroup, Form, Container, Row, Col, Button, Alert } from "react-bootstrap";

const NoAccesoView = (props) => {
    const { handleValidarCodigo, showError, setShowError } = props;

    // Estado local para el valor del campo de texto
    const [codigo, setCodigo] = useState("");

    const handleChange = (event) => {
        // Actualizar el estado del código cuando cambie el valor del campo de texto
        setCodigo(event.target.value);
    };

    const handleClick = () => {
        // Llamar a la función handleValidarCodigo con el valor actual del código como parámetro
        handleValidarCodigo(codigo);
    };

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
            document.head.appendChild(script);
            script.onload = ShopifyBuyInit;
        };

        const ShopifyBuyInit = () => {
            const existingButton = document.getElementById('product-component-1701407241738');
            if (existingButton) {
              existingButton.innerHTML = ''; // Esto elimina cualquier contenido previo, incluido el botón de Shopify
            }
            const client = ShopifyBuy.buildClient({
                domain: '479319-2.myshopify.com',
                storefrontAccessToken: 'b8bc12d68c1dbf442787341686cd647c',
            });

            ShopifyBuy.UI.onReady(client).then((ui) => {
                ui.createComponent('product', {
                    id: '8964280385828',
                    node: document.getElementById('product-component-1701407241738'),
                    moneyFormat: '%24%20%7B%7Bamount%7D%7D',
                    // ... Resto de tu configuración ...
                });
            });
        };

        if (window.ShopifyBuy) {
            if (window.ShopifyBuy.UI) {
                ShopifyBuyInit();
            } else {
                loadScript();
            }
        } else {
            loadScript();
        }
    }, []);


    return (
        <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        <h6>Para continuar al servicio de Test Vocacional,
                            es necesario ingresar el código que puedes encontrar en
                            el interior de tu libro anteriormente adquirido.</h6>
                    </Col>
                </Row>

                <br />

                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        <InputGroup className="mb-3">
                            <Form.Control
                                className="text-center"
                                placeholder="XXXXXXXXXXXXXX-XXXXXXXXXXXXXXX-XXXXXXXXX"
                                aria-label="codigo"
                                aria-describedby="input-codigo"
                                value={codigo}
                                onChange={handleChange} // Agregar el evento onChange para actualizar el estado del código
                            />
                        </InputGroup>
                    </Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col xs lg="8">
                        {/* Agregar el evento onClick para ejecutar la función con el valor actual del código */}
                        <Button variant="success" onClick={handleClick}>Validar código</Button>
                    </Col>
                </Row>

                <Row className="justify-content-md-center">
  <Col xs={12} lg={8}>
    {/* Este div contiene el botón de compra de Shopify */}
    <div id='product-component-1701407241738' style={{ display: 'flex', justifyContent: 'center' }}></div>
  </Col>
</Row>

                
                <br />
                {/* Mostrar la alerta si showError es true */}
                {showError && (
                    <Row className="justify-content-md-center">
                        <Col xs lg="8">
                            <Alert variant="danger">
                                Su código no es válido, por favor verifique que el código ingresado sea correcto.
                            </Alert>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
};

export default NoAccesoView;