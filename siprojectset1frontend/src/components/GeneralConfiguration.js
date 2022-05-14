import React, { useState, useEffect } from 'react';
import {  Form, Button, ButtonGroup, DropdownButton, Dropdown} from "react-bootstrap";


const GeneralConfiguration = ({data, setData, saveConfiguration}) => {
    const [step, setStep] = useState(1)
    const [displayJSONSyncPeriod, setDisplayJSONSyncPeriod] = useState(null)
    const [displayMediaSyncPeriod, setDisplayMediaSyncPeriod] = useState(null)
    const [JSONSyncUnit, setJSONSyncUnit] = useState("seconds")
    const [MediaSyncUnit, setMediaSyncUnit] = useState("seconds")
    const [displayDuration, setDisplayDuration] = useState(null)
    const [durationUnit, setDurationUnit] = useState("seconds")
    const [displayBurst, setDisplayBurst] = useState(null)
    const [burstUnit, setBurstUnit] = useState("seconds")

    useEffect(()=>{
        validatePaths()
        setDisplayJSONSyncPeriod(data.JSONSyncPeriod)
        setDisplayMediaSyncPeriod(data.MediaSyncPeriod)
        setDisplayDuration(data.Duration)
        setDisplayBurst(data.Period)

    }, [])


    function checkPath(path) {
        let reg = /^[A-Z,a-z]{1}:\\.+/
        if (path.match(reg))
            return true

        return false
    }

    function validatePaths(num = 0) {
        if (step != 1)
            return
        if (num == 1 || num == 0) {
            if (checkPath(data.TriggerFilePath) )
                document.getElementById("triggerPath").style.backgroundColor = "white";
            else
                document.getElementById("triggerPath").style.backgroundColor = "#c46868";
        }

        if (num == 2 || num == 0) {
            if (checkPath(data.OutputFolderPath))
                document.getElementById("outputPath").style.backgroundColor = "white";
            else
                document.getElementById("outputPath").style.backgroundColor = "#c46868";
        }
    }

    function changeValues(value, property) {
        switch (property) {
            case "regex":
                setData({...data, Regex: value})
                break;
            case "triggerFilePath":
                setData({...data, TriggerFilePath: value})
                break;
            case "outputFolderPath":
                setData({...data, OutputFolderPath: value})
                break;
            case "outputValidityDays":
                setData({...data, OutputValidity: value})
                break;
            case "mediaPath":
                setData({...data, MediaPath: value})
                break;
            case "exportPath":
                setData({...data, JSONExportLocation: value})
                break;
            case "importPath":
                setData({ ...data, JSONImportLocation: value })
                break;
            case "serverPort":
                setData({...data, ServerPort: value})
                break;
            case "serverIPAddress":
                setData({...data, ServerIP: value})
                break;
            

        }
    }


    function calculateTime(value, type) {
        switch (type) {
            case "JSONSyncPeriod":
                var unit = JSONSyncUnit


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

                setData({...data, JSONSyncPeriod: time})
                setDisplayJSONSyncPeriod(value)
                break;
            case "MediaSyncPeriod":
                var unit = MediaSyncUnit


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

                setData({ ...data, MediaSyncPeriod: time })
                setDisplayMediaSyncPeriod(value)
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

                setData({...data, Duration: time})
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

        
                setData({...data, Period: time})
                setDisplayBurst(value)

                break;
        }
    }


    function changeUnit(unit, type) {

        switch (type) {
            case "JSONSyncPeriod":
                var time = displayJSONSyncPeriod

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

                setData({...data, JSONSyncPeriod: time})
                setJSONSyncUnit(unit)

                break;
            case "MediaSyncPeriod":
                var time = displayMediaSyncPeriod

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

                setData({ ...data, MediaSyncPeriod: time })
                setMediaSyncUnit(unit)

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

          
                setData({...data, Duration: time})
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

                setData({...data,Period: time})
                setBurstUnit(unit)

                break;
        }
    }

    function typeCaptureChange(type) {

        if (type == "image") {
           
            setData({...data, ImageCapture: true})

            document.getElementById("imageCapture").checked = true
            document.getElementById("videoCapture").checked = false
        } else if (type == "video") {
           
            setData({ ...data, ImageCapture: false })

            document.getElementById("imageCapture").checked = false
            document.getElementById("videoCapture").checked = true

        } else if (type == "burst") {

            setData({...data, SingleMode: false})
            document.getElementById("single").checked = false
            document.getElementById("burst").checked = true
        } else if (type == "single") {

            setData({...data, SingleMode: true})


            document.getElementById("single").checked = true
            document.getElementById("burst").checked = false
        }
    }


    return (
        <Form style={{ padding: "10px", height: "100%" }}>

            {step === 1 ?
                <div style={{ height: "100%" }}>
                    <h2 style={{ color: "#0275d8" }}>Device configuration</h2>
                    <hr />
                    <div>
                        <div className="mb-3 row">
                            <label htmlFor="triggerPath" className="col-sm-4 col-form-label">Trigger file path</label>
                            <div className="col-sm-7">
                                <input className="form-control" type="text" id="triggerPath" value={data.TriggerFilePath} onBlur={() => validatePaths(1)} onChange={(e) => { changeValues(e.target.value, "triggerFilePath") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="triggerRegex" className="col-sm-4 col-form-label">Trigger regex</label>
                            <div className="col-sm-7">
                                <input type="text" className="form-control" id="triggerRegex" value={data.Regex} onChange={(e) => { changeValues(e.target.value, "regex") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="outputPath" className="col-sm-4 col-form-label">Output folder path</label>
                            <div className="col-sm-7">
                                <input type="text" className="form-control" id="outputPath" value={data.OutputFolderPath} onBlur={() => validatePaths(2)} onChange={(e) => { changeValues(e.target.value, "outputFolderPath") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="outputPath" className="col-sm-4 col-form-label">Keep capture for </label>

                            <div className="d-flex align-items-center col-sm-4">
                                <input type="number" min="1" value={data.OutputValidity} onChange={e => changeValues(e.target.value, "outputValidityDays")} />

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
                                <input type="text" className="form-control" id="serverIPAddress" value={data.ServerIP} onChange={(e) => { changeValues(e.target.value, "serverIPAddress") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="serverPort" className="col-sm-4 col-form-label">Server Port</label>
                            <div className="col-sm-5">
                                <input type="number" className="form-control" id="serverPort" min={0} value={data.ServerPort} onChange={(e) => { changeValues(e.target.value, "serverPort") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="mediaPath" className="col-sm-4 col-form-label">Media path</label>
                            <div className="col-sm-7">
                                <input type="text" className="form-control" id="mediaPath" value={data.MediaPath} onChange={(e) => { changeValues(e.target.value, "mediaPath") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="configPath" className="col-sm-4 col-form-label">Configuration import path</label>
                            <div className="col-sm-7">
                                <input type="text" className="form-control" id="importPath" value={data.JSONImportLocation} onChange={(e) => { changeValues(e.target.value, "importPath") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="configPath" className="col-sm-4 col-form-label">Configuration export path</label>
                            <div className="col-sm-7">
                                <input type="text" className="form-control" id="exportPath" value={data.JSONExportLocation} onChange={(e) => { changeValues(e.target.value, "exportPath") }} />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="JSONSyncPeriod" className="col-sm-4 col-form-label">Configuration synchronization period</label>
                            <div className="d-flex align-items-center col-sm-4">
                                <input type="number" id="JSONSyncPeriod" min="1" step={1} value={displayJSONSyncPeriod} onChange={(e) => { calculateTime(e.target.value, "JSONSyncPeriod") }} />
                                <DropdownButton id="JSONSyncPeriodUnit" title={JSONSyncUnit} style={{ marginLeft: "10px" }}>
                                    <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "JSONSyncPeriod") }}>seconds</Dropdown.Item>
                                    <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "JSONSyncPeriod") }}>minutes</Dropdown.Item>
                                    <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "JSONSyncPeriod") }}>hours</Dropdown.Item>
                                    <Dropdown.Item href="#" value="days" onClick={() => { changeUnit("days", "JSONSyncPeriod") }}>days</Dropdown.Item>
                                </DropdownButton>

                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="MediaSyncPeriod" className="col-sm-4 col-form-label">Media synchronization period</label>
                            <div className="d-flex align-items-center col-sm-4">
                                <input type="number" id="MediaSyncPeriod" min="1" step={1} value={displayMediaSyncPeriod} onChange={(e) => { calculateTime(e.target.value, "MediaSyncPeriod") }} />
                                <DropdownButton id="MediaSyncPeriodUnit" title={MediaSyncUnit} style={{ marginLeft: "10px" }}>
                                    <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "MediaSyncPeriod") }}>seconds</Dropdown.Item>
                                    <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "MediaSyncPeriod") }}>minutes</Dropdown.Item>
                                    <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "MediaSyncPeriod") }}>hours</Dropdown.Item>
                                    <Dropdown.Item href="#" value="days" onClick={() => { changeUnit("days", "MediaSyncPeriod") }}>days</Dropdown.Item>
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
                </> : <>
                    <h2 style={{ color: "#0275d8" }}>Capture configuration</h2>
                    <hr />

                    <div style={{ height: "60%" }}>
                        <div className="mb-3 row">
                            <label htmlFor="typeCapture" className="col-sm-5 col-form-label">Type of capture</label>

                                <Form.Check inline label="Image capture" name="imageCapture" type={'radio'} id={"imageCapture"} onChange={() => { typeCaptureChange("image") }} checked={data.ImageCapture == true} />
                                <Form.Check inline label="Video capture" name="videoCapture" type={'radio'} id={"videoCapture"} onChange={() => { typeCaptureChange("video") }} checked={data.ImageCapture == false} />

                        </div>
                            {data.ImageCapture == true ?
                            <div className="mb-3 row">
                                <label htmlFor="modeCapture" className="col-sm-5 col-form-label">Mode of capture</label>

                                    <Form.Check inline label="Single mode" name="single" type={'radio'} id={"single"} onChange={() => { typeCaptureChange("single") }} checked={data.SingleMode == true} />
                                    <Form.Check inline label="Burst mode" name="burst" type={'radio'} id={"burst"} onChange={() => { typeCaptureChange("burst") }} checked={data.SingleMode == false} />

                            </div> : <></>}
                            {data.SingleMode == true && data.ImageCapture == true ? <></> :
                            <div className="mb-3 row">
                                <label htmlFor="duration" className="col-sm-5 col-form-label">Duration</label>
                                <input type="number" id="duration" min="1" step={1} value={displayDuration} onChange={(e) => { calculateTime(e.target.value, "duration") }} />
                                <DropdownButton id="durationUnit" title={durationUnit} style={{ marginLeft: "10px" }}>
                                    <Dropdown.Item href="#" value="seconds" onClick={() => { changeUnit("seconds", "duration") }}>seconds</Dropdown.Item>
                                    <Dropdown.Item href="#" value="minutes" onClick={() => { changeUnit("minutes", "duration") }}>minutes</Dropdown.Item>
                                    <Dropdown.Item href="#" value="hours" onClick={() => { changeUnit("hours", "duration") }}>hours</Dropdown.Item>

                                </DropdownButton>
                            </div>}
                            {data.SingleMode == false && data.ImageCapture == true ?
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
        )
}

export default GeneralConfiguration