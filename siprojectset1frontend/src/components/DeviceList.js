import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Modal, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { BsXLg } from "react-icons/bs";

import DeviceCard from "./DeviceCard";
import Pagination from "./Pagination"

const DeviceList = () => {
    const [devices, setDevices] = useState(null)
    const [show, setShow] = useState(false);
    const [showActivation, setShowActivation] = useState(false);
    const [chosenDevice, setChosenDevice] = useState()
    const [activationKey, setActivationKey] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [items, setItems] = useState(null)

    useEffect(() => {
        if (devices != null) {
            if (devices.length >= currentPage * 5) {
                setItems(devices.slice((currentPage - 1) * 5, currentPage * 5))
            }
            else {
                setItems(devices.slice((currentPage - 1) * 5, devices.length + 1))
            }
        }

    }, [currentPage])

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
                if (data.length > 6)
                    setItems(data.slice(0, 5))
                else
                    setItems(data.slice(0, data.length - 1))
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
            {items!=null ? <><h1 style={{ color: "#0275d8" }}>Available devices</h1><hr/></> : <></>}
            <Row>
                <Col>
                    <Container className="my-2">
                        {items?.map((device) => (
                            <DeviceCard key={device.macAddress} device={device} editConfiguration={editConfiguration} viewCaptures={viewCaptures} cameraOptionsPopup={cameraOptionsPopup} activateDevice={activateDevice} />
                        ))}
                    </Container>
                </Col>
            </Row>
            <Row className={"justify-content-center"} style={{ marginTop: "10px" }}>
                {devices != null && devices.length != 0 && devices.length != undefined ? <Pagination itemsCount={devices.length} itemsPerPage={5} currentPage={currentPage} setCurrentPage={setCurrentPage} /> : <>{ }</>}
            </Row>
            <Modal show={show} >
                <Modal.Header closeButton={false}>
                    <Modal.Title>Choose a camera to preview</Modal.Title>
                    <BsXLg onClick={handleClose} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
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
            <Modal show={showActivation}>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Activation key</Modal.Title>
                    <BsXLg onClick={handleCloseActivation} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                </Modal.Header>
                <Modal.Body>


                    <div style={{ textAlign: "center" }}>
                        <p>Enter this key into your client app: <span style={{fontWeight: "bold"}}>{activationKey}</span></p>
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