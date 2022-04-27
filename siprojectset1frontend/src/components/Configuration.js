import React, { useState, useEffect } from 'react';
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
    const [modal, setModal] = useState("")

    const { mac } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {



                const response = await fetch("/api/JSONConfiguration/getJSON/" + mac)



                const data = await response.json();


                if (data.cameras == undefined) {

                    var camera = {
                        device_configuration: {
                            device_type: "USBCamera",
                            id: "",
                            trigger_file_path: "",
                            regex: "",
                            output_folder_path: "",
                            output_validity_days: "1",
                            camera_number: "0"
                        },
                        video_configuration: {
                            resolution: "Resolution640x480",
                            contrast_level: "0",
                            image_color: "Control",
                            motion_detection: "False"
                        },
                        network_configuration: {
                            server_IP_address: "",
                            server_port: "",
                            server_media_path: "",
                            server_JSON_configuration_path: "",
                            synchronization_period: "60",
                            latest_synchronization_ticks: "",
                            connection_status: "False"
                        },
                        capture_configuration: {
                            image_capture: "True",
                            single_mode: "True",
                            duration: "0",
                            burst_period: "0"
                        }
                    }

                    data.cameras = [camera, camera, camera]
                    data.cameras[1].device_configuration.camera_number = "1"
                    data.cameras[2].device_configuration.camera_number = "2"
                }

                setConfiguration(data);

                try {
                    setFirstCamera(data.cameras[0])
                    setSecondCamera(data.cameras[1])
                    setThirdCamera(data.cameras[2])
                    setCurrentCamera(data.cameras[0])
                    setDisplaySynchronizationPeriod(data.cameras[0].network_configuration.synchronization_period)
                    setDisplayDuration(data.cameras[0].capture_configuration.duration)
                    setDisplayBurst(data.cameras[0].capture_configuration.burst_period)
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
    const handleShow = (msg) => {
        setModal(msg)
        setShow(true);
    }


    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';

    }

    async function saveConfiguration() {
        configuration.cameras = [firstCamera, secondCamera, thirdCamera]

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
                handleShow("Configuration saved successfully!")
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
                setDisplaySynchronizationPeriod(firstCamera.network_configuration.synchronization_period)
                setSynchronizationUnit("seconds")
                setDisplayDuration(firstCamera.capture_configuration.duration)
                setDurationUnit("seconds")
                setDisplayBurst(firstCamera.capture_configuration.burst_period)
                setBurstUnit("seconds")
                setCurrentCamera(firstCamera)

                break;
            case 2:
                document.getElementById("firstCamera").classList.remove("active")
                document.getElementById("secondCamera").classList.add("active")
                document.getElementById("thirdCamera").classList.remove("active")
                setCameraNum(2)
                setDisplaySynchronizationPeriod(secondCamera.network_configuration.synchronization_period)
                setSynchronizationUnit("seconds")
                setDisplayDuration(secondCamera.capture_configuration.duration)
                setDurationUnit("seconds")
                setDisplayBurst(secondCamera.capture_configuration.burst_period)
                setBurstUnit("seconds")
                setCurrentCamera(secondCamera)
                break;
            case 3:
                document.getElementById("firstCamera").classList.remove("active")
                document.getElementById("secondCamera").classList.remove("active")
                document.getElementById("thirdCamera").classList.add("active")
                setCameraNum(3)
                setDisplaySynchronizationPeriod(thirdCamera.network_configuration.synchronization_period)
                setSynchronizationUnit("seconds")
                setDisplayDuration(thirdCamera.capture_configuration.duration)
                setDurationUnit("seconds")
                setDisplayBurst(thirdCamera.capture_configuration.burst_period)
                setBurstUnit("seconds")
                setCurrentCamera(thirdCamera)

                break;

        }
    }

    function changeValues(value, property) {
        switch (property) {
            case "regex":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, device_configuration: { ...firstCamera.device_configuration, regex: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, device_configuration: { ...secondCamera.device_configuration, regex: value } })
                else
                    setThirdCamera({ ...thirdCamera, device_configuration: { ...thirdCamera.device_configuration, regex: value } })
                setCurrentCamera({ ...currentCamera, device_configuration: { ...currentCamera.device_configuration, regex: value } })
                break;
            case "triggerFilePath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, device_configuration: { ...firstCamera.device_configuration, trigger_file_path: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, device_configuration: { ...secondCamera.device_configuration, trigger_file_path: value } })
                else
                    setThirdCamera({ ...thirdCamera, device_configuration: { ...thirdCamera.device_configuration, trigger_file_path: value } })
                setCurrentCamera({ ...currentCamera, device_configuration: { ...currentCamera.device_configuration, trigger_file_path: value } })
                break;
            case "outputFolderPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, device_configuration: { ...firstCamera.device_configuration, output_folder_path: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, device_configuration: { ...secondCamera.device_configuration, output_folder_path: value } })
                else
                    setThirdCamera({ ...thirdCamera, device_configuration: { ...thirdCamera.device_configuration, output_folder_path: value } })
                setCurrentCamera({ ...currentCamera, device_configuration: { ...currentCamera.device_configuration, output_folder_path: value } })
                break;
            case "outputValidityDays":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, device_configuration: { ...firstCamera.device_configuration, output_validity_days: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, device_configuration: { ...secondCamera.device_configuration, output_validity_days: value } })
                else
                    setThirdCamera({ ...thirdCamera, device_configuration: { ...thirdCamera.device_configuration, output_validity_days: value } })
                setCurrentCamera({ ...currentCamera, device_configuration: { ...currentCamera.device_configuration, output_validity_days: value } })
                break;
            case "mediaPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, server_media_path: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, server_media_path: value } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, server_media_path: value } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, server_media_path: value } })
                break;
            case "configPath":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, server_JSON_configuration_path: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, server_JSON_configuration_path: value } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, server_JSON_configuration_path: value } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, server_JSON_configuration_path: value } })
                break;
            case "serverPort":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, server_port: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, server_port: value } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, server_port: value } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, server_port: value } })
                break;
            case "serverIPAddress":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, server_IP_address: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, server_IP_address: value } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, server_IP_address: value } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, server_IP_address: value } })
                break;
            case "resolution":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, video_configuration: { ...firstCamera.video_configuration, resolution: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, video_configuration: { ...secondCamera.video_configuration, resolution: value } })
                else
                    setThirdCamera({ ...thirdCamera, video_configuration: { ...thirdCamera.video_configuration, resolution: value } })
                setCurrentCamera({ ...currentCamera, video_configuration: { ...currentCamera.video_configuration, resolution: value } })
                break;
            case "contrast":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, video_configuration: { ...firstCamera.video_configuration, contrast_level: value } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, video_configuration: { ...secondCamera.video_configuration, contrast_level: value } })
                else
                    setThirdCamera({ ...thirdCamera, video_configuration: { ...thirdCamera.video_configuration, contrast_level: value } })
                setCurrentCamera({ ...currentCamera, video_configuration: { ...currentCamera.video_configuration, contrast_level: value } })
                break;
            case "imageColor":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, video_configuration: { ...firstCamera.video_configuration, image_color: "ff" + value.substring(1) } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, video_configuration: { ...secondCamera.video_configuration, image_color: "ff" + value.substring(1) } })
                else
                    setThirdCamera({ ...thirdCamera, video_configuration: { ...thirdCamera.video_configuration, image_color: "ff" + value.substring(1) } })
                setCurrentCamera({ ...currentCamera, video_configuration: { ...currentCamera.video_configuration, image_color: "ff" + value.substring(1) } })
                break;
            case "motionDetection":
                if (cameraNum == 1)
                    setFirstCamera({ ...firstCamera, video_configuration: { ...firstCamera.video_configuration, motion_detection: value === "False" ? "True" : "False" } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, video_configuration: { ...secondCamera.video_configuration, motion_detection: value === "False" ? "True" : "False" } })
                else
                    setThirdCamera({ ...thirdCamera, video_configuration: { ...thirdCamera.video_configuration, motion_detection: value === "False" ? "True" : "False" } })
                setCurrentCamera({ ...currentCamera, video_configuration: { ...currentCamera.video_configuration, motion_detection: value === "False" ? "True" : "False" } })
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
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, synchronization_period: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, synchronization_period: time } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, synchronization_period: time } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, synchronization_period: time } })
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
                    setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, duration: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, duration: time } })
                else
                    setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, duration: time } })
                setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, duration: time } })
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
                    setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, burst_period: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, burst_period: time } })
                else
                    setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, burst_period: time } })
                setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, burst_period: time } })
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
                    setFirstCamera({ ...firstCamera, network_configuration: { ...firstCamera.network_configuration, synchronization_period: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, network_configuration: { ...secondCamera.network_configuration, synchronization_period: time } })
                else
                    setThirdCamera({ ...thirdCamera, network_configuration: { ...thirdCamera.network_configuration, synchronization_period: time } })
                setCurrentCamera({ ...currentCamera, network_configuration: { ...currentCamera.network_configuration, synchronization_period: time } })
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
                    setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, duration: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, duration: time } })
                else
                    setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, duration: time } })
                setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, duration: time } })
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
                    setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, burst_period: time } })
                else if (cameraNum == 2)
                    setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, burst_period: time } })
                else
                    setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, burst_period: time } })
                setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, burst_period: time } })
                setBurstUnit(unit)

                break;
        }
    }


    function clearImageColor() {
        if (cameraNum == 1)
            setFirstCamera({ ...firstCamera, video_configuration: { ...firstCamera.video_configuration, image_color: "Control" } })
        else if (cameraNum == 2)
            setSecondCamera({ ...secondCamera, video_configuration: { ...secondCamera.video_configuration, image_color: "Control" } })
        else
            setThirdCamera({ ...thirdCamera, video_configuration: { ...thirdCamera.video_configuration, image_color: "Control" } })
        setCurrentCamera({ ...currentCamera, video_configuration: { ...currentCamera.video_configuration, image_color: "Control" } })
    }

    function typeCaptureChange(type) {

        if (type == "image") {
            if (cameraNum == 1)
                setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, image_capture: "True" } })
            else if (cameraNum == 2)
                setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, image_capture: "True" } })
            else
                setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, image_capture: "True" } })
            setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, image_capture: "True" } })

            document.getElementById("imageCapture").checked = true
            document.getElementById("videoCapture").checked = false
        } else if (type == "video") {
            if (cameraNum == 1) {
                setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, image_capture: "False", burst_period: 0 } })

            }
            else if (cameraNum == 2) {
                setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, image_capture: "False", burst_period: 0 } })

            }
            else {
                setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, image_capture: "False", burst_period: 0 } })

            }
            setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, image_capture: "False", burst_period: 0 } })

            document.getElementById("imageCapture").checked = false
            document.getElementById("videoCapture").checked = true

        } else if (type == "burst") {

            if (cameraNum == 1)
                setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, single_mode: "False" } })
            else if (cameraNum == 2)
                setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, single_mode: "False" } })
            else
                setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, single_mode: "False" } })
            setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, single_mode: "False" } })

            document.getElementById("single").checked = false
            document.getElementById("burst").checked = true
        } else if (type == "single") {

            if (cameraNum == 1) {
                setFirstCamera({ ...firstCamera, capture_configuration: { ...firstCamera.capture_configuration, single_mode: "True", duration: 0, burst_period: 0 } })

            }
            else if (cameraNum == 2) {
                setSecondCamera({ ...secondCamera, capture_configuration: { ...secondCamera.capture_configuration, single_mode: "True", duration: 0, burst_period: 0 } })

            }
            else {
                setThirdCamera({ ...thirdCamera, capture_configuration: { ...thirdCamera.capture_configuration, single_mode: "True", duration: 0, burst_period: 0 } })

            }
            setCurrentCamera({ ...currentCamera, capture_configuration: { ...currentCamera.capture_configuration, single_mode: "True", duration: 0, burst_period: 0 } })


            document.getElementById("single").checked = true
            document.getElementById("burst").checked = false
        }
    }

    return (
        <Container>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            {currentCamera == null ? <></> : <Container id="forma">
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
                <Form style={{ padding: "10px" }}>

                    {step === 1 ?
                        <>
                            <h2 style={{ color: "#0275d8" }}>Device configuration</h2>
                            <hr />
                            <div className="mb-3 row">
                                <label htmlFor="deviceType" className="col-sm-4 col-form-label">Device Type</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="deviceType" value={currentCamera.device_configuration.device_type} readOnly />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="device" className="col-sm-4 col-form-label">Device</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="device" value={currentCamera.device_configuration.id} readOnly />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="triggerPath" className="col-sm-4 col-form-label">Trigger file path</label>
                                <div className="col-sm-7">
                                    <input className="form-control" type="text" id="formFile" value={currentCamera.device_configuration.trigger_file_path} onChange={(e) => { changeValues(e.target.value, "triggerFilePath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="triggerRegex" className="col-sm-4 col-form-label">Trigger regex</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="triggerRegex" value={currentCamera.device_configuration.regex} onChange={(e) => { changeValues(e.target.value, "regex") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="outputPath" className="col-sm-4 col-form-label">Output folder path</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="outputPath" value={currentCamera.device_configuration.output_folder_path} onChange={(e) => { changeValues(e.target.value, "outputFolderPath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="outputPath" className="col-sm-4 col-form-label">Keep capture for </label>

                                <div className="d-flex align-items-center col-sm-4">
                                    <input type="number" min="1" value={currentCamera.device_configuration.output_validity_days} onChange={e => changeValues(e.target.value, "outputValidityDays")} />

                                    <span style={{ padding: "10px" }}> days</span>
                                </div>
                            </div>

                            <hr />
                            <ButtonGroup className="float-right pl-0" >
                                <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
                                <Button variant="primary" className=" border btn-primary " onClick={() => { setStep(step + 1) }} style={{ width: "100px" }}> Next</Button>

                            </ButtonGroup>

                        </>

                        : step === 2 ? <>
                            <h2 style={{ color: "#0275d8" }}>Server configuration</h2>
                            <hr />
                            
                            <div className="mb-3 row">
                                <label htmlFor="serverIPAddress" className="col-sm-4 col-form-label">Server IP address</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="serverIPAddress" value={currentCamera.network_configuration.server_IP_address} onChange={(e) => { changeValues(e.target.value, "serverIPAddress") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="serverPort" className="col-sm-4 col-form-label">Server Port</label>
                                <div className="col-sm-5">
                                    <input type="text" className="form-control" id="serverPort" value={currentCamera.network_configuration.server_port} onChange={(e) => { changeValues(e.target.value, "serverPort") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="mediaPath" className="col-sm-4 col-form-label">Media path</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="mediaPath" value={currentCamera.network_configuration.server_media_path} onChange={(e) => { changeValues(e.target.value, "mediaPath") }} />
                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="configPath" className="col-sm-4 col-form-label">Configuration path</label>
                                <div className="col-sm-7">
                                    <input type="text" className="form-control" id="configPath" value={currentCamera.network_configuration.server_JSON_configuration_path} onChange={(e) => { changeValues(e.target.value, "configPath") }} />
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

                                <div className="mb-3 row">
                                    <label htmlFor="resolution" className="col-sm-2 col-form-label">Resolution</label>
                                    <div className="d-flex align-items-center col-sm-3">

                                        <DropdownButton className="lg" id="resolution" title={currentCamera.video_configuration.resolution.substring(10)} >
                                            <Dropdown.Item href="#" value="640x480" onClick={() => { changeValues("Resolution640x480", "resolution") }}>640x480</Dropdown.Item>
                                            <Dropdown.Item href="#" value="720x480" onClick={() => { changeValues("Resolution720x480", "resolution") }}>720x480</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1280x960" onClick={() => { changeValues("Resolution1280x960", "resolution") }}>1280x960</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1280x1024" onClick={() => { changeValues("Resolution1280x1024", "resolution") }}>1280x1024</Dropdown.Item>
                                            <Dropdown.Item href="#" value="1920x1080" onClick={() => { changeValues("Resolution1920x1080", "resolution") }}>1920x1080</Dropdown.Item>
                                            <Dropdown.Item href="#" value="2048x1536" onClick={() => { changeValues("Resolution2048x1536", "resolution") }}>2048x1536</Dropdown.Item>
                                        </DropdownButton>


                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="contrast" className="col-sm-2 col-form-label">Contrast</label>
                                    <div className="col-sm-4">
                                        <RangeSlider id="contrast" min={0} max={10} value={currentCamera.video_configuration.contrast_level} onChange={(e) => { changeValues(e.target.value, "contrast") }} tooltip="auto" tooltipPlacement="top" />
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="imageColor" className="col-sm-2 col-form-label">Image color</label>
                                    <div className="col-sm-4">
                                        <Form.Control type="color" id="imageColor" value={"#" + currentCamera.video_configuration.image_color.substring(2)} onChange={(e) => { changeValues(e.target.value, "imageColor") }} />
                                    </div>
                                    <Button className="btn-dark" onClick={() => { clearImageColor() }}>Clear</Button>
                                </div>
                                <div className="mb-3 row d-flex align-items-center">
                                    <div className="col-sm-1">
                                        <input type="checkbox" id="motionDetection" checked={currentCamera.video_configuration.motion_detection == "True" ? true : false} value={currentCamera.video_configuration.motion_detection} onChange={(e) => { console.log(e.target.value); changeValues(e.target.value, "motionDetection") }} />
                                    </div>
                                    <label htmlFor="motionDetection" className="col-sm-5 col-form-label">Motion detection</label>
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
                                <div className="mb-3 row">
                                    <label htmlFor="typeCapture" className="col-sm-5 col-form-label">Type of capture</label>

                                    <Form.Check inline label="Image capture" name="imageCapture" type={'radio'} id={"imageCapture"} onChange={() => { typeCaptureChange("image") }} checked={currentCamera.capture_configuration.image_capture == "True"} />
                                    <Form.Check inline label="Video capture" name="videoCapture" type={'radio'} id={"videoCapture"} onChange={() => { typeCaptureChange("video") }} checked={currentCamera.capture_configuration.image_capture == "False"} />

                                </div>
                                {currentCamera.capture_configuration.image_capture == "True" ?
                                    <div className="mb-3 row">
                                        <label htmlFor="modeCapture" className="col-sm-5 col-form-label">Mode of capture</label>

                                        <Form.Check inline label="Single mode" name="single" type={'radio'} id={"single"} onChange={() => { typeCaptureChange("single") }} checked={currentCamera.capture_configuration.single_mode == "True"} />
                                        <Form.Check inline label="Burst mode" name="burst" type={'radio'} id={"burst"} onChange={() => { typeCaptureChange("burst") }} checked={currentCamera.capture_configuration.single_mode == "False"} />

                                    </div> : <></>}
                                {currentCamera.capture_configuration.single_mode == "True" && currentCamera.capture_configuration.image_capture == "True" ? <></> :
                                    <div className="mb-3 row">
                                        <label htmlFor="duration" className="col-sm-5 col-form-label">Duration</label>
                                        <input type="number" id="duration" min="1" step={1} value={displayDuration} onChange={(e) => { calculateTime(e.target.value, "duration") }} />
                                        <DropdownButton id="durationUnit" title={durationUnit} style={{ marginLeft: "10px" }}>
                                            <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "duration") }}>seconds</Dropdown.Item>
                                            <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "duration") }}>minutes</Dropdown.Item>
                                            <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "duration") }}>hours</Dropdown.Item>

                                        </DropdownButton>
                                    </div>}
                                {currentCamera.capture_configuration.single_mode == "False" && currentCamera.capture_configuration.image_capture == "True" ?
                                    <div className="mb-3 row">
                                        <label htmlFor="burstPeriod" className="col-sm-5 col-form-label">Burst period</label>
                                        <input type="number" id="burstPeriod" min="1" step={1} value={displayBurst} onChange={(e) => { calculateTime(e.target.value, "burst") }} />
                                        <DropdownButton id="burstUnit" title={burstUnit} style={{ marginLeft: "10px" }}>
                                            <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "burst") }}>seconds</Dropdown.Item>
                                            <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "burst") }}>minutes</Dropdown.Item>
                                            <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "burst") }}>hours</Dropdown.Item>

                                        </DropdownButton>
                                    </div> : <></>}

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
                    <Modal.Title>Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modal}</Modal.Body>
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
