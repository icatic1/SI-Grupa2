import React, { useState, useEffect} from 'react';
import { Container, Spinner, Form, Button, ButtonGroup, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import { useParams } from 'react-router-dom';

const Configuration = () => {
    const [configuration, setConfiguration] = useState(null)
    const [step, setStep] = useState(1)
    const [firstCamera, setFirstCamera] = useState({})
    const [secondCamera, setSecondCamera] = useState({})
    const [thirdCamera, setThirdCamera] = useState({})
    const [currentCamera, setCurrentCamera] = useState(null)
    const [cameraNum, setCameraNum] = useState(1)
    const [displaySynchronizationPeriod, setDisplaySynchronizationPeriod] = useState(null)
    const [synchronizationUnit, setSynchronizationUnit] = useState("seconds")
    const [displayDuration, setDisplayDuration] = useState(null)
    const [durationUnit, setDurationUnit] = useState("seconds")
    const [displayBurst, setDisplayBurst] = useState(null)
    const [burstUnit, setBurstUnit] = useState("seconds")
    const [show, setShow] = useState(false)
    const [modal, setModal] = useState({title:"Information", body:""})

    const { mac } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {



                const response = await fetch("/api/JSONConfiguration/getJSON/" + mac)



                var data = await response.json();
                

                if (data[0] == undefined) {

                    var camera1 = {
                       
                            Type: 0,
                            Id: "",
                            TriggerFilePath: "",
                            Regex: "",
                            OutputFolderPath: "",
                            OutputValidity: 1,
                            CameraNumber: 0,
                            Resolution: 0,
                            ContrastLevel: 0,
                            ImageColor: "Control",
                            MotionDetection: false,
                            ServerIP: "",
                            ServerPort: 0,
                            MediaPath: "",
                            JSONConfigPath: "",
                            SynchronizationPeriod: 60,
                            LatestSynchronizationTicks: 0,
                            ConnectionStatus: false,
                            ImageCapture: true,
                            SingleMode: true,
                            Duration: 0,
                            Period: 0
                    }

                    var camera2 = {

                        Type: 0,
                        Id: "",
                        TriggerFilePath: "",
                        Regex: "",
                        OutputFolderPath: "",
                        OutputValidity: 1,
                        CameraNumber: 1,
                        Resolution: 0,
                        ContrastLevel: 0,
                        ImageColor: "Control",
                        MotionDetection: false,
                        ServerIP: "",
                        ServerPort: 0,
                        MediaPath: "",
                        JSONConfigPath: "",
                        SynchronizationPeriod: 60,
                        LatestSynchronizationTicks: 0,
                        ConnectionStatus: false,
                        ImageCapture: true,
                        SingleMode: true,
                        Duration: 0,
                        Period: 0
                    }

                    var camera3 = {

                        Type: 0,
                        Id: "",
                        TriggerFilePath: "",
                        Regex: "",
                        OutputFolderPath: "",
                        OutputValidity: 1,
                        CameraNumber: 2,
                        Resolution: 0,
                        ContrastLevel: 0,
                        ImageColor: "Control",
                        MotionDetection: false,
                        ServerIP: "",
                        ServerPort: 0,
                        MediaPath: "",
                        JSONConfigPath: "",
                        SynchronizationPeriod: 60,
                        LatestSynchronizationTicks: 0,
                        ConnectionStatus: false,
                        ImageCapture: true,
                        SingleMode: true,
                        Duration: 0,
                        Period: 0
                    }
                    

                    data = [camera1, camera2, camera3]
                    
                }

                setConfiguration(data);

                try {
                    setFirstCamera(data[0])
                    setSecondCamera(data[1])
                    setThirdCamera(data[2])
                    setCurrentCamera(data[0])
                    setDisplaySynchronizationPeriod(data[0].SynchronizationPeriod)
                    setDisplayDuration(data[0].Duration)
                    setDisplayBurst(data[0].Period)
                } catch (e) {
                    handleShow("The configuration file is corrupt!")
                }

        

            } catch (e) {
                console.log(e)

            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        
        hideSpinner()
    }, [firstCamera])

    const handleClose = () => { setShow(false); }
    const handleShow = (title,msg) => {
        setModal({title: title, body: msg})
        setShow(true);
    }


    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';

    }

    function checkPath(path) {
        let reg = /^[A-Z,a-z]{1}:\\.+/
        if (path.match(reg) || path.length == 0) 
            return true

        return false
    }

    function validatePaths(num=0) {
        if (step != 1)
            return
        if (num == 1 || num == 0) {
            if (checkPath(currentCamera.TriggerFilePath) || currentCamera.TriggerFilePath.length == 0)
                document.getElementById("triggerPath").style.backgroundColor = "white";
            else
                document.getElementById("triggerPath").style.backgroundColor = "#c46868";
        }

        if (num == 2 || num == 0) {
            if (checkPath(currentCamera.OutputFolderPath) || currentCamera.OutputFolderPath.length == 0)
                document.getElementById("outputPath").style.backgroundColor = "white";
            else
                document.getElementById("outputPath").style.backgroundColor = "#c46868";
        }
    }

    async function saveConfiguration() {
        
        if (!(checkPath(firstCamera.TriggerFilePath) && checkPath(firstCamera.OutputFolderPath)
            && checkPath(secondCamera.TriggerFilePath) && checkPath(secondCamera.OutputFolderPath)
            && checkPath(thirdCamera.TriggerFilePath) && checkPath(thirdCamera.OutputFolderPath))) {
            handleShow("Error","Make sure you've entered correct trigger file and output paths!")
            return
        }


        let configuration = [firstCamera, secondCamera, thirdCamera]

        try {


            const headers = { 'Accept': 'application/json', 'content-type': 'application/json' }
            const a = JSON.stringify(configuration)
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

    function changeCamera(num) {
        switch (num) {
            case 1:
                document.getElementById("firstCamera").classList.add("active")
                document.getElementById("secondCamera").classList.remove("active")
                document.getElementById("thirdCamera").classList.remove("active")
                setCameraNum(1)
                setDisplaySynchronizationPeriod(firstCamera.SynchronizationPeriod)
                setSynchronizationUnit("seconds")
                setDisplayDuration(firstCamera.Duration)
                setDurationUnit("seconds")
                setDisplayBurst(firstCamera.Period)
                setBurstUnit("seconds")
                setCurrentCamera(firstCamera)

                break;
            case 2:
                document.getElementById("firstCamera").classList.remove("active")
                document.getElementById("secondCamera").classList.add("active")
                document.getElementById("thirdCamera").classList.remove("active")
                setCameraNum(2)
                setDisplaySynchronizationPeriod(secondCamera.SynchronizationPeriod)
                setSynchronizationUnit("seconds")
                setDisplayDuration(secondCamera.Duration)
                setDurationUnit("seconds")
                setDisplayBurst(secondCamera.Period)
                setBurstUnit("seconds")
                setCurrentCamera(secondCamera)
                break;
            case 3:
                document.getElementById("firstCamera").classList.remove("active")
                document.getElementById("secondCamera").classList.remove("active")
                document.getElementById("thirdCamera").classList.add("active")
                setCameraNum(3)
                setDisplaySynchronizationPeriod(thirdCamera.SynchronizationPeriod)
                setSynchronizationUnit("seconds")
                setDisplayDuration(thirdCamera.Duration)
                setDurationUnit("seconds")
                setDisplayBurst(thirdCamera.Period)
                setBurstUnit("seconds")
                setCurrentCamera(thirdCamera)

                break;

        }
        validatePaths()
    }

    function detectCameraType(type) {
        if (type == 0)
            return "USB Camera"
        else
            return "IP Camera"
    }

    function detectResolution(num) {
        switch (num) {
            case 0:
                return "640x480"
                break;
            case 1:
                return "720x480"
                break;
            case 2:
                return "1280x960"
                break;
            case 3:
                return "1280x1024"
                break;
            case 4:
                return "1920x1080"
                break;
            case 5:
                return "2048x1536"
                break;
        }

            
    }

    function changeValues(value, property) {
        switch (property) {
            case "regex":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, Regex: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, Regex: value  })
                else
                    setThirdCamera({ ...thirdCamera, Regex: value } )
                setCurrentCamera({ ...currentCamera, Regex: value })
                break;
            case "triggerFilePath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  TriggerFilePath: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  TriggerFilePath: value } )
                else
                    setThirdCamera({ ...thirdCamera,  TriggerFilePath: value } )
                setCurrentCamera({ ...currentCamera,  TriggerFilePath: value } )
                break;
            case "outputFolderPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  OutputFolderPath: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  OutputFolderPath: value  })
                else
                    setThirdCamera({ ...thirdCamera,  OutputFolderPath: value } )
                setCurrentCamera({ ...currentCamera,  OutputFolderPath: value } )
                break;
            case "outputValidityDays":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  OutputValidity: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  OutputValidity: value  })
                else
                    setThirdCamera({ ...thirdCamera,  OutputValidity: value } )
                setCurrentCamera({ ...currentCamera,  OutputValidity: value } )
                break;
            case "mediaPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  MediaPath: value })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  MediaPath: value })
                else
                    setThirdCamera({ ...thirdCamera,  MediaPath: value } )
                setCurrentCamera({ ...currentCamera,  MediaPath: value } )
                break;
            case "configPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  JSONConfigPath: value })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  JSONConfigPath: value })
                else
                    setThirdCamera({ ...thirdCamera,  JSONConfigPath: value } )
                setCurrentCamera({ ...currentCamera,  JSONConfigPath: value } )
                break;
            case "serverPort":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  ServerPort: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  ServerPort: value } )
                else
                    setThirdCamera({ ...thirdCamera,  ServerPort: value } )
                setCurrentCamera({ ...currentCamera,  ServerPort: value } )
                break;
            case "serverIPAddress":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  ServerIP: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  ServerIP: value  })
                else
                    setThirdCamera({ ...thirdCamera,  ServerIP: value })
                setCurrentCamera({ ...currentCamera,  ServerIP: value  })
                break;
            case "resolution":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  Resolution: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  Resolution: value } )
                else
                    setThirdCamera({ ...thirdCamera,  Resolution: value } )
                setCurrentCamera({ ...currentCamera,  Resolution: value } )
                break;
            case "contrast":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  ContrastLevel: value } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  ContrastLevel: value })
                else
                    setThirdCamera({ ...thirdCamera,  ContrastLevel: value } )
                setCurrentCamera({ ...currentCamera,  ContrastLevel: value } )
                break;
            case "imageColor":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  ImageColor: value.substring(1) } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  ImageColor: value.substring(1) } )
                else
                    setThirdCamera({ ...thirdCamera,  ImageColor: value.substring(1) } )
                setCurrentCamera({ ...currentCamera,  ImageColor: value.substring(1) } )
                break;
            case "motionDetection":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, MotionDetection: !firstCamera.MotionDetection })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, MotionDetection: !secondCamera.MotionDetection })
                else
                    setThirdCamera({ ...thirdCamera, MotionDetection: !thirdCamera.MotionDetection } )
                setCurrentCamera({ ...currentCamera, MotionDetection: !currentCamera.MotionDetection } )
                break;

        }
    }




    function calculateTime(value, type) {
        switch (type) {
            case "synchronizationPeriod":
                var unit = synchronizationUnit


                switch (unit) {
                    case "minutes":
                        var time = value * 60
                        break;
                    case "hours":
                        time = value * 3600
                        break;
                    case "days":
                        time = value * 3600 * 24
                        break;
                    default:
                        time = value
                        break;
                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  SynchronizationPeriod: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  SynchronizationPeriod: time } )
                else
                    setThirdCamera({ ...thirdCamera,  SynchronizationPeriod: time } )
                setCurrentCamera({ ...currentCamera,  SynchronizationPeriod: time } )
                setDisplaySynchronizationPeriod(value)

                break;
            case "duration":
                var unit = durationUnit


                switch (unit) {
                    case "minutes":
                        var time = value * 60
                        break;
                    case "hours":
                        time = value * 3600
                        break;

                    default:
                        time = value
                        break;
                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  Duration: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  Duration: time })
                else
                    setThirdCamera({ ...thirdCamera,  Duration: time } )
                setCurrentCamera({ ...currentCamera,  Duration: time } )
                setDisplayDuration(value)

                break;
            case "burst":
                var unit = burstUnit


                switch (unit) {
                    case "minutes":
                        var time = value * 60
                        break;
                    case "hours":
                        time = value * 3600
                        break;

                    default:
                        time = value
                        break;
                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  Period: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  Period: time } )
                else
                    setThirdCamera({ ...thirdCamera,  Period: time } )
                setCurrentCamera({ ...currentCamera,  Period: time } )
                setDisplayBurst(value)

                break;
        }
    }



    function changeUnit(unit, type) {

        switch (type) {
            case "synchronizationPeriod":
                var time = displaySynchronizationPeriod

                switch (unit) {
                    case "minutes":
                        time *= 60
                        break;
                    case "hours":
                        time *= 3600
                        break;
                    case "days":
                        time = time * 3600 * 24
                        break;

                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  SynchronizationPeriod: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  SynchronizationPeriod: time } )
                else
                    setThirdCamera({ ...thirdCamera,  SynchronizationPeriod: time } )
                setCurrentCamera({ ...currentCamera,  SynchronizationPeriod: time } )
                setSynchronizationUnit(unit)

                break;
            case "duration":
                var time = displayDuration

                switch (unit) {
                    case "minutes":
                        time *= 60
                        break;
                    case "hours":
                        time *= 3600
                        break;


                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  Duration: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  Duration: time } )
                else
                    setThirdCamera({ ...thirdCamera,  Duration: time } )
                setCurrentCamera({ ...currentCamera,  Duration: time } )
                setDurationUnit(unit)

                break;
            case "burst":
                var time = displayBurst

                switch (unit) {
                    case "minutes":
                        time *= 60
                        break;
                    case "hours":
                        time *= 3600
                        break;


                }

                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera,  Period: time } )
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera,  Period: time } )
                else
                    setThirdCamera({ ...thirdCamera,  Period: time } )
                setCurrentCamera({ ...currentCamera,  Period: time } )
                setBurstUnit(unit)

                break;
        }
    }


    function clearImageColor() {
        if (cameraNum == 1)
            setFirstCamera({ ...firstCamera,  ImageColor: "Control" } )
        else if (cameraNum == 2)
            setSecondCamera({ ...secondCamera,  ImageColor: "Control" } )
        else
            setThirdCamera({ ...thirdCamera,  ImageColor: "Control" } )
        setCurrentCamera({ ...currentCamera,  ImageColor: "Control" } )
    }

    function typeCaptureChange(type) {

        if (type == "image") {
            if (cameraNum == 1)
                setFirstCamera({ ...firstCamera,  ImageCapture: true } )
            else if (cameraNum == 2)
                setSecondCamera({ ...secondCamera,  ImageCapture: true } )
            else
                setThirdCamera({ ...thirdCamera,  ImageCapture: true } )
            setCurrentCamera({ ...currentCamera,  ImageCapture: true } )

            document.getElementById("imageCapture").checked = true
            document.getElementById("videoCapture").checked = false
        } else if (type == "video") {
            if (cameraNum == 1) {
                setFirstCamera({ ...firstCamera,  ImageCapture: false, Period: 0 } )

            }
            else if (cameraNum == 2) {
                setSecondCamera({ ...secondCamera,  ImageCapture: false, Period: 0 } )

            }
            else {
                setThirdCamera({ ...thirdCamera,  ImageCapture: false, Period: 0 } )

            }
            setCurrentCamera({ ...currentCamera,  ImageCapture: false, Period: 0 } )

            document.getElementById("imageCapture").checked = false
            document.getElementById("videoCapture").checked = true

        } else if (type == "burst") {

            if (cameraNum == 1)
                setFirstCamera({ ...firstCamera,  SingleMode: false } )
            else if (cameraNum == 2)
                setSecondCamera({ ...secondCamera,  SingleMode: false } )
            else
                setThirdCamera({ ...thirdCamera,  SingleMode: false } )
            setCurrentCamera({ ...currentCamera,  SingleMode: false } )

            document.getElementById("single").checked = false
            document.getElementById("burst").checked = true
        } else if (type == "single") {

            if (cameraNum == 1) {
                setFirstCamera({ ...firstCamera, SingleMode: true, Duration: 0, Period: 0 } )

            }
            else if (cameraNum == 2) {
                setSecondCamera({ ...secondCamera, SingleMode: true, Duration: 0, Period: 0 } )

            }
            else {
                setThirdCamera({ ...thirdCamera, SingleMode: true, Duration: 0, Period: 0 } )

            }
            setCurrentCamera({ ...currentCamera, SingleMode: true, Duration: 0, Period: 0 } )


            document.getElementById("single").checked = true
            document.getElementById("burst").checked = false
        }
    }

    return (
        <Container style={{height:"100%"}}>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            {currentCamera == null ? <></> : <Container id="forma" style={{ height: "100%" }}>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className="nav-link active" href="#" aria-current="page" onClick={() => changeCamera(1)} id="firstCamera">Camera 1</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => changeCamera(2)} id="secondCamera">Camera 2</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#" onClick={() => changeCamera(3)} id="thirdCamera">Camera 3</a>
                    </li>
                </ul>
                <Form style={{ padding: "10px", height: "100%" }}>
                    
                    {step === 1 ?
                        <div style={{height: "100%" }}>
                            <h2 style={{ color: "#0275d8" }}>Device configuration</h2>
                            <hr />
                            <div>
                            <div className="mb-3 row">
                                <label htmlFor="deviceType" className="col-sm-4 col-form-label">Device Type</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="deviceType" value={detectCameraType(currentCamera.Type)} readOnly />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="device" className="col-sm-4 col-form-label">Device</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="device" value={currentCamera.Id} readOnly />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="triggerPath" className="col-sm-4 col-form-label">Trigger file path</label>
                                <div className="col-sm-7">
                                        <input className="form-control" type="text" id="triggerPath"  value={currentCamera.TriggerFilePath} onBlur={() => validatePaths(1)} onChange={(e) => { changeValues(e.target.value, "triggerFilePath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="triggerRegex" className="col-sm-4 col-form-label">Trigger regex</label>
                                <div className="col-sm-7">
                                        <input type="text" className="form-control" id="triggerRegex" value={currentCamera.Regex}  onChange={(e) => { changeValues(e.target.value, "regex") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="outputPath" className="col-sm-4 col-form-label">Output folder path</label>
                                <div className="col-sm-7">
                                        <input type="text" className="form-control" id="outputPath"  value={currentCamera.OutputFolderPath} onBlur={() => validatePaths(2)} onChange={(e) => { changeValues(e.target.value, "outputFolderPath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="outputPath" className="col-sm-4 col-form-label">Keep capture for </label>

                                <div className="d-flex align-items-center col-sm-4">
                                    <input type="number" min="1" value={currentCamera.OutputValidity} onChange={e => changeValues(e.target.value, "outputValidityDays")} />

                                    <span style={{ padding: "10px" }}> days</span>
                                </div>
                            </div>
                            </div>
                            <hr />
                            <ButtonGroup className="float-right pl-0" >
                                <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
                                <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step + 1) }} style={{ width: "100px" }}> Next</Button>

                            </ButtonGroup>

                        </div>

                        : step === 2 ? <>
                            <h2 style={{ color: "#0275d8" }}>Server configuration</h2>
                            <hr />
                            <div style={{ height: "60%" }}>
                            <div className="mb-3 row">
                                <label htmlFor="serverIPAddress" className="col-sm-4 col-form-label">Server IP address</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="serverIPAddress" value={currentCamera.ServerIP} onChange={(e) => { changeValues(e.target.value, "serverIPAddress") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="serverPort" className="col-sm-4 col-form-label">Server Port</label>
                                <div className="col-sm-5">
                                    <input type="number" className="form-control" id="serverPort" value={currentCamera.ServerPort} onChange={(e) => { changeValues(e.target.value, "serverPort") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="mediaPath" className="col-sm-4 col-form-label">Media path</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="mediaPath" value={currentCamera.MediaPath} onChange={(e) => { changeValues(e.target.value, "mediaPath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="configPath" className="col-sm-4 col-form-label">Configuration path</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="configPath" value={currentCamera.JSONConfigPath} onChange={(e) => { changeValues(e.target.value, "configPath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="synchronizationPeriod" className="col-sm-4 col-form-label">Synchronization period</label>
                                <div className="d-flex align-items-center col-sm-4">
                                    <input type="number" id="synchronizationPeriod" min="1" step={1} value={displaySynchronizationPeriod} onChange={(e) => { calculateTime(e.target.value, "synchronizationPeriod") }} />
                                    <DropdownButton id="synchronizationPeriodUnit" title={synchronizationUnit} style={{ marginLeft: "10px" }}>
                                        <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "synchronizationPeriod") }}>seconds</Dropdown.Item>
                                        <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "synchronizationPeriod") }}>minutes</Dropdown.Item>
                                        <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "synchronizationPeriod") }}>hours</Dropdown.Item>
                                        <Dropdown.Item href="#" value="days" onClick={() => { changeUnit("days", "synchronizationPeriod") }}>days</Dropdown.Item>
                                    </DropdownButton>

                                </div>
                                </div>
                             </div>
                            <hr />
                            <ButtonGroup className="float-right pl-0" >
                                <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
                                <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step - 1) }} style={{ width: "100px" }}> Previous</Button>
                                <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step + 1) }} style={{ width: "100px" }}> Next</Button>
                            </ButtonGroup>
                        </>
                            : step === 3 ? <>
                                <h2 style={{ color: "#0275d8" }}>Video configuration</h2>
                                <hr />

                                <div style={{ height: "60%" }}>
                                <div className="mb-3 row">
                                    <label htmlFor="resolution" className="col-sm-2 col-form-label">Resolution</label>
                                    <div className="d-flex align-items-center col-sm-3">

                                        <DropdownButton className="lg" id="resolution" title={detectResolution(currentCamera.Resolution)} >
                                            <Dropdown.Item href="#" value="640x480" onClick={() => { changeValues(0, "resolution") }}>640x480</Dropdown.Item>
                                            <Dropdown.Item href="#" value="720x480" onClick={() => { changeValues(1, "resolution") }}>720x480</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1280x960" onClick={() => { changeValues(2, "resolution") }}>1280x960</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1280x1024" onClick={() => { changeValues(3, "resolution") }}>1280x1024</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1920x1080" onClick={() => { changeValues(4, "resolution") }}>1920x1080</Dropdown.Item>
                                            <Dropdown.Item href="#" value="2048x1536" onClick={() => { changeValues(5, "resolution") }}>2048x1536</Dropdown.Item>
                                        </DropdownButton>


                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="contrast" className="col-sm-2 col-form-label">Contrast</label>
                                    <div className="col-sm-4">
                                        <RangeSlider id="contrast" min={0} max={10} value={currentCamera.ContrastLevel} onChange={(e) => { changeValues(e.target.value, "contrast") }} tooltip="auto" tooltipPlacement="top" />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="imageColor" className="col-sm-2 col-form-label">Image color</label>
                                    <div className="col-sm-4">
                                        <Form.Control type="color" id="imageColor" value={"#" + currentCamera.ImageColor.substring(2)} onChange={(e) => { changeValues(e.target.value, "imageColor") }} />
                                    </div>
                                    <Button className="btn-dark" onClick={() => { clearImageColor() }}>Clear</Button>
                                </div>
                                <div className="mb-3 row d-flex align-items-center">
                                    <div className="col-sm-1">
                                        <input type="checkbox" id="motionDetection" checked={currentCamera.MotionDetection} value={currentCamera.MotionDetection} onChange={(e) => { changeValues(e.target.value, "motionDetection") }} />
                                    </div>
                                    <label htmlFor="motionDetection" className="col-sm-5 col-form-label">Motion detection</label>
                                    </div>
                                </div>
                                <hr />
                                <ButtonGroup className="float-right pl-0" >
                                    <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
                                    <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step - 1) }} style={{ width: "100px" }}> Previous</Button>
                                    <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step + 1) }} style={{ width: "100px" }}> Next</Button>

                                </ButtonGroup>
                            </> : <>
                                <h2 style={{ color: "#0275d8" }}>Capture configuration</h2>
                                <hr />

                                <div style={{ height: "60%" }}>
                                <div className="mb-3 row">
                                    <label htmlFor="typeCapture" className="col-sm-5 col-form-label">Type of capture</label>

                                    <Form.Check inline label="Image capture" name="imageCapture" type={'radio'} id={"imageCapture"} onChange={() => { typeCaptureChange("image") }} checked={currentCamera.ImageCapture == true} />
                                    <Form.Check inline label="Video capture" name="videoCapture" type={'radio'} id={"videoCapture"} onChange={() => { typeCaptureChange("video") }} checked={currentCamera.ImageCapture == false} />

                                </div>
                                {currentCamera.ImageCapture == true ?
                                    <div className="mb-3 row">
                                        <label htmlFor="modeCapture" className="col-sm-5 col-form-label">Mode of capture</label>

                                        <Form.Check inline label="Single mode" name="single" type={'radio'} id={"single"} onChange={() => { typeCaptureChange("single") }} checked={currentCamera.SingleMode == true} />
                                        <Form.Check inline label="Burst mode" name="burst" type={'radio'} id={"burst"} onChange={() => { typeCaptureChange("burst") }} checked={currentCamera.SingleMode == false} />

                                    </div> : <></>}
                                {currentCamera.SingleMode == true && currentCamera.ImageCapture == true ? <></> :
                                    <div className="mb-3 row">
                                        <label htmlFor="duration" className="col-sm-5 col-form-label">Duration</label>
                                        <input type="number" id="duration" min="1" step={1} value={displayDuration} onChange={(e) => { calculateTime(e.target.value, "duration") }} />
                                        <DropdownButton id="durationUnit" title={durationUnit} style={{ marginLeft: "10px" }}>
                                            <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "duration") }}>seconds</Dropdown.Item>
                                            <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "duration") }}>minutes</Dropdown.Item>
                                            <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "duration") }}>hours</Dropdown.Item>

                                        </DropdownButton>
                                    </div>}
                                {currentCamera.SingleMode == false && currentCamera.ImageCapture == true ?
                                    <div className="mb-3 row">
                                        <label htmlFor="burstPeriod" className="col-sm-5 col-form-label">Burst period</label>
                                        <input type="number" id="burstPeriod" min="1" step={1} value={displayBurst} onChange={(e) => { calculateTime(e.target.value, "burst") }} />
                                        <DropdownButton id="burstUnit" title={burstUnit} style={{ marginLeft: "10px" }}>
                                            <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "burst") }}>seconds</Dropdown.Item>
                                            <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "burst") }}>minutes</Dropdown.Item>
                                            <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "burst") }}>hours</Dropdown.Item>

                                        </DropdownButton>
                                    </div> : <></>}
                                </div>
                                <hr />
                                <ButtonGroup className="float-right pl-0" >
                                    <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
                                    <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step - 1) }} style={{ width: "100px" }}> Previous</Button>
                                </ButtonGroup>

                            </>
                    }

                </Form>
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
