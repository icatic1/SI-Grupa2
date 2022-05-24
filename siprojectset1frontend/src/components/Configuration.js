import React, { useState, useEffect} from 'react';
import { Container, Spinner, Form, Button, ButtonGroup, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import GeneralConfiguration from './GeneralConfiguration'
import CameraConfiguration from './CameraConfiguration'


const Configuration = () => {
    const [configuration, setConfiguration] = useState(null)
    const [step, setStep] = useState(0)
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState({title:"Information", body:""})

    const { mac } = useParams();

    function checkPath(path) {
        let reg = /^[A-Z,a-z]{1}:\\.+/
        if (path.match(reg))
            return true

        return false
    }

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await fetch("/api/JSONConfiguration/getJSON/" + mac)


                var data = await response.json();
                

                if (data.Cameras == undefined) {

                    data = {
                        TriggerFilePath: "",
                        FaceDetectionTrigger: false,
                        Regex: "",
                        OutputFolderPath: "",
                        OutputValidity: 1,
                        ServerIP: "",
                        ServerPort: 0,
                        MediaPath: "",
                        JSONImportLocation: "",
                        JSONExportLocation: "",
                        JSONSyncPeriod: 60,
                        JSONTime: "00:00:00",
                        JSONTicks: 0,
                        MediaSyncPeriod: 300,
                        MediaTime: "00:00:00",
                        MediaTicks: 0,
                        ConnectionStatus: false,
                        ImageCapture: true,
                        SingleMode: true,
                        Duration: 0,
                        Period: 0
                    }

                    var camera1 = {

                        Type: 0,
                        Id: "",
                        CameraNumber: 0,
                        Resolution: 0,
                        ContrastLevel: 0,
                        ImageColor: "Control",
                        MotionDetection: false
                        
                    }

                    var camera2 = {

                        Type: 0,
                        Id: "",
                        CameraNumber: 1,
                        Resolution: 0,
                        ContrastLevel: 0,
                        ImageColor: "Control",
                        MotionDetection: false
                    }

                    var camera3 = {

                        Type: 0,
                        Id: "",
                        CameraNumber: 2,
                        Resolution: 0,
                        ContrastLevel: 0,
                        ImageColor: "Control",
                        MotionDetection: false

                    }


                    data.Cameras = [camera1, camera2, camera3]

                } else {
                    data.TriggerFilePath = data.TriggerFilePath.replaceAll('/', '\\')
                    data.OutputFolderPath = data.OutputFolderPath.replaceAll('/', '\\')

                }

                setConfiguration(data);

                setStep(1)
                    
                

        

            } catch (e) {
                console.log(e)

            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (step == 1) {
            document.getElementById("general").classList.add("active")
            document.getElementById("cameras").classList.remove("active")
        } else if (step == 2) {
            document.getElementById("cameras").classList.add("active")
            document.getElementById("general").classList.remove("active")
        }

    }, [step])

    useEffect(() => {
        hideSpinner()
    }, [configuration])

    const handleClose = () => { setShow(false); }
    const handleShow = (title,msg) => {
        setModal({title: title, body: msg})
        setShow(true);
    }


    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';

    }

    

    async function saveConfiguration() {
        
        if (!(checkPath(configuration.TriggerFilePath) && checkPath(configuration.OutputFolderPath))) {
            handleShow("Error","Make sure you've entered correct trigger file and output paths!")
            return
        }

        if (configuration.ServerPort.length == 0) 
            configuration.ServerPort = 0
   
        

        let sendData = {...configuration}
        sendData.TriggerFilePath = sendData.TriggerFilePath.replaceAll('\\', '/')
        sendData.OutputFolderPath = sendData.OutputFolderPath.replaceAll('\\', '/')
        sendData.ConnectionStatus = true

        

        try {


            const headers = { 'Accept': 'application/json', 'content-type': 'application/json' }
            const a = JSON.stringify(sendData)
            const options = {
                method: 'POST',
                headers: headers,
                body: a
            }

            let response = await fetch('/api/JSONConfiguration/setJSON/?MACAddress=' + mac, options)

            if (response) {
                handleShow("Information","Configuration saved successfully!")
            }
        } catch (e) {
            console.log(e);
        }
    }

    

    

   
    return (
        <Container style={{height:"100%"}}>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            {configuration == null ? <></> : <Container id="forma" style={{ height: "100%" }}>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" href="#" aria-current="page" onClick={() => setStep(1)} id="general">General settings</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#" aria-current="page" onClick={() => setStep(2)} id="cameras">Camera settings</a>
                    </li>
                </ul>


                {step == 1 ? <GeneralConfiguration data={configuration} setData={setConfiguration} saveConfiguration={saveConfiguration}/>
                    : <CameraConfiguration data={configuration} setData={setConfiguration} saveConfiguration={saveConfiguration}/>}
            </Container>}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modal.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )

}

export default Configuration
