import React from 'react';
import { Container, Button, Row, Col, ButtonGroup } from "react-bootstrap";

const DeviceCard = ({ device, editConfiguration, viewCaptures }) => {

    return (
        <Container fluid="sm" className="block-example border-bottom border-info" >

            <Row >
                <Col xs={12} sm={8} md={8}  >
                    <Container className="my-1">
                        <span style={{ fontWeight: "bold" }}>Terminal ID:</span> {device.terminalID}
                    </Container>
                </Col>

            </Row>


            <Row>


                <Container style={{marginBottom:"5px"}}>
                    <ButtonGroup className="float-right pl-0">
                        <Button variant="primary" className=" border btn-primary " style={{ width: "160px" }} onClick={() => { editConfiguration(device) }}> Edit Configuration</Button>
                        <Button variant="primary" className=" border btn-primary" style={{width:"160px"}} onClick={() => { viewCaptures(device) }} > View Captures </Button>
                    </ButtonGroup>
                </Container>


            </Row>

        </Container>

    );
}

export default DeviceCard