import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

import DeviceCard from "./DeviceCard";


const DeviceList = () => {
    const [devices, setDevices] = useState(null)
    const [show, setShow] = useState(false);
    const [showActivation, setShowActivation] = useState(false);
    const [chosenDevice, setChosenDevice] = useState()
    const [activationKey, setActivationKey] = useState()

    const handleClose = () => { setShow(false); }
    const handleCloseActivation = () => { setShowActivation(false); }
    const handleShow = () => {
        setShow(true);
    }
    const handleShowActivation = () => {
        setShowActivation(true);
    }

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {

                const response = await fetch("api/licence/GetAllDevices")

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

        navigate("/FileList/" + device.macAddress);

    }

    function cameraOptionsPopup(device) {
        setChosenDevice(device)
        handleShow()
    }

    async function activateDevice(device) {
        try {

            const response = await fetch("api/licence/GenerateActivationKey/" + device.macAddress)

            const data = await response.json();
            setActivationKey(data);
            handleShowActivation();

        } catch (e) {
            console.log(e)

        }
    }

    function showCamera(num) {
        navigate("/Live/" + chosenDevice.terminalID + "/" + chosenDevice.macAddress + "/" + num)
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
                            <DeviceCard key={device.terminalID} device={device} editConfiguration={editConfiguration} viewCaptures={viewCaptures} cameraOptionsPopup={cameraOptionsPopup} activateDevice={activateDevice} />
                        ))}
                    </Container>
                </Col>
            </Row>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a camera to preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <div style={{ textAlign: "center" }}>
                        <span style={{ margin: "5px" }}>
                            <Button variant="primary" className="btn-bg" onClick={() => { handleClose(); showCamera(0) }}  >Camera 1</Button>
                        </span>
                        <span style={{ margin: "5px" }}>
                            <Button variant="primary" className="btn-bg" onClick={() => { handleClose(); showCamera(1) }} >Camera 2</Button>
                        </span>
                        <span style={{ margin: "5px" }}>
                            <Button variant="primary" className="btn-bg" onClick={() => { handleClose(); showCamera(2) }} >Camera 3</Button>
                        </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            <Modal show={showActivation} onHide={handleCloseActivation}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter this key into your client app</Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <div style={{ textAlign: "center" }}>
                        <Modal.Title>Your activation key is: {activationKey}</Modal.Title>
                        <span style={{ margin: "5px" }}>
                            <Button variant="primary" className="btn-bg" onClick={() => { navigator.clipboard.writeText(activationKey) }} >Copy to clipboard</Button>
                        </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default DeviceList