import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import DeviceCard from "./DeviceCard";


const DeviceList = () => {
    const [devices, setDevices] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {

                const response = await fetch("api/licence/GetAllLicences")

                const data = await response.json();
                setDevices(data);
                hideSpinner();


            } catch (e) {
                console.log(e)

            }
        };

        fetchDevices();
    }, []);

    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';
    }

    function editConfiguration(device) {

        navigate("/Configuration/" + device.macAddress)

    }

    function viewCaptures(device) {
        console.log("View Captures!")
    }

    return (
        <Container>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            <Row>
                <Col>
                    <Container className="my-2">
                        {devices?.map((device) => (
                            <DeviceCard key={device.terminalID} device={device} editConfiguration={editConfiguration} viewCaptures={viewCaptures} />
                        ))}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

export default DeviceList