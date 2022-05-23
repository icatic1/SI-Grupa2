import React from 'react';
import { Container, Row, Col, Dropdown, DropdownButton, Button } from "react-bootstrap";

const DeviceCard = ({ device, editConfiguration, viewCaptures, cameraOptionsPopup, activateDevice }) => {

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


                <Container style={{ marginBottom: "5px" }}>

                    {device.isActivated ? (
                        <DropdownButton title="Actions" className="float-right pl-0">
                            <Dropdown.Item onClick={() => { editConfiguration(device) }}> Edit configuration </Dropdown.Item>
                            <Dropdown.Item onClick={() => { viewCaptures(device) }}> View captures </Dropdown.Item>
                            <Dropdown.Item onClick={() => { cameraOptionsPopup(device) }}> View cameras </Dropdown.Item>
                        </DropdownButton>
                    ) : (
                        <DropdownButton title="Actions" className="float-right pl-0">
                            <Dropdown.Item onClick={() => { activateDevice(device) }}> Activate Device </Dropdown.Item>
                        </DropdownButton>
                    )}

                </Container>


            </Row>

        </Container >

    );
}

export default DeviceCard