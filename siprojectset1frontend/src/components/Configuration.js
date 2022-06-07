import React, { useState, useEffect} from 'react';
import { Container, Spinner, Form, Button, ButtonGroup, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import { useParams, useNavigate, Link } from 'react-router-dom';
import GeneralConfiguration from './GeneralConfiguration'
import CameraConfiguration from './CameraConfiguration'
import { BsXLg } from "react-icons/bs";


const Configuration = () => {
    const [configuration, setConfiguration] = useState(null)
    const [oldConfiguration, setOldConfiguration] = useState(null)
    const [step, setStep] = useState(0)
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState({ title: "Information", body: "" })
    const [noConfig, setNoConfig] = useState("false")
    const [terminalID, setTerminalID] = useState()
    const navigate = useNavigate()

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
                
                
                if (!data.hasOwnProperty("Cameras")) {
                    hideSpinner()
                    setNoConfig("true")
                    handleShow('Error', "")
                    return
                } else {
                    const info = await fetch("/api/Licence/GetDeviceByMAC?MacAddress=" + mac)
                    var infodata = await info.json()
                    
                    setTerminalID(infodata.terminalID)
                    data.TriggerFilePath = data.TriggerFilePath.replaceAll('/', '\\')
                    data.OutputFolderPath = data.OutputFolderPath.replaceAll('/', '\\')



                    setConfiguration(data);
                    setOldConfiguration(data);
                    setStep(1)
                }
                    
                

        

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
        if (configuration!=null)
            hideSpinner()
    }, [configuration])

    const handleClose = () => { setShow(false); }
    
    const handleShow = (title,msg) => {
        setModal({title: title, body: msg})
        setShow(true);
    }

    const goBack = () => {navigate("/Devices")}


    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';

    }

    

    async function saveConfiguration(triggerCheck=null) {
        
        if (!((checkPath(configuration.TriggerFilePath) || configuration.TriggerFilePath.length==0) && checkPath(configuration.OutputFolderPath))) {
            handleShow("Error","Make sure you've entered correct trigger file and output paths!")
            return
        }

        if (triggerCheck != null) {
            if (configuration.FaceDetectionTrigger == false && triggerCheck == false) {
                handleShow("Error", "You must set up at least one trigger!")
                return
            }

            if (triggerCheck == true && (configuration.Regex.length == 0 || configuration.TriggerFilePath.length == 0)) {
                handleShow("Error", "You must set trigger file path and regex!")
                return
            }
        }

        if (configuration.ServerPort.length == 0) 
            configuration.ServerPort = 0
   
        

        let sendData = {...configuration}
        sendData.TriggerFilePath = sendData.TriggerFilePath.replaceAll('\\', '/')
        sendData.OutputFolderPath = sendData.OutputFolderPath.replaceAll('\\', '/')
        

        setOldConfiguration(configuration)

        try {


            const headers = { 'Accept': 'application/json', 'content-type': 'application/json' }
            const a = JSON.stringify(sendData)
            const options = {
                method: 'POST',
                headers: headers,
                body: a
            }

            let response1 = await fetch('/api/JSONConfiguration/setJSON/?MACAddress=' + mac, options)

          
            if (response1.ok) {
                handleShow("Information","Configuration saved successfully!")
            }
        } catch (e) {
            console.log(e);
        }
    }

    

    

   
    return (
        <Container style={{ paddingBottom:"10px" }}>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            {configuration == null ? <></> : <Container id="forma" style={{ height: "100%" }}>
                <Link to="/Devices" style={{fontSize : "18px"}}>See all devices</Link>
                <h2 style={{ backgroundColor:"#0275d8", borderRadius:"20px", color:"white", marginTop:"20px", padding:"5px", width:"30%", textAlign:"center"}}>{terminalID}</h2>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" href="#" aria-current="page" onClick={() => setStep(1)} id="general">General settings</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href="#" aria-current="page" onClick={() => setStep(2)} id="cameras">Camera settings</a>
                    </li>
                </ul>


                {step == 1 ? <GeneralConfiguration data={configuration} setData={setConfiguration} saveConfiguration={saveConfiguration} oldConfiguration={oldConfiguration} />
                    : <CameraConfiguration data={configuration} setData={setConfiguration} saveConfiguration={saveConfiguration} oldConfiguration={oldConfiguration}/>}
            </Container>}
            {noConfig == "true" ?
                <Modal show={show}>
                    <Modal.Header closeButton={ false }>
                        <Modal.Title>{modal.title}</Modal.Title>
                        <BsXLg onClick={goBack} style={{ float: "right", size: "50px", cursor:"pointer" }}></BsXLg>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>
                            <p>There is no configuration file for this device on the server.</p>
                            <p>Please use the client app to upload one.</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                            <Button variant="primary" onClick={goBack}>
                                Go back
                            </Button>
                    </Modal.Footer>
                </Modal>
                : <Modal show={show}>
                    <Modal.Header closeButton={false}>
                        <Modal.Title>{modal.title}</Modal.Title>
                        <BsXLg onClick={handleClose} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ textAlign: "center" }}>
                            {modal.body}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}>
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
                }
        </Container>
    )

}

export default Configuration
