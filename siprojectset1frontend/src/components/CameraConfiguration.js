import React, { useState, useEffect } from 'react';
import { Container, Spinner, Form, Button, ButtonGroup, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';


const CameraConfiguration = ({data, setData, saveConfiguration}) => {
    const [cameraNum, setCameraNum] = useState(1)
    const [currentCamera, setCurrentCamera] = useState(data.Cameras[0])

    useEffect(() => {
        if (cameraNum == 1) {
            setCurrentCamera(data.Cameras[0])
        } else if (cameraNum == 2) {
            setCurrentCamera(data.Cameras[1])
        } else {
            setCurrentCamera(data.Cameras[2])
        }
    }, [cameraNum])


    function detectCameraType(type) {
        if (type == 0)
            return "USB Camera"
        else
            return "IP Camera"
    }


    function changeValues(value, property) {
        switch (property) {
            case "resolution":
                if (cameraNum == 1)
                    setData({ ...data, Cameras: [{ ...data.Cameras[0], Resolution: value }, data.Cameras[1], data.Cameras[2]] })
                else if (cameraNum == 2)
                    setData({ ...data, Cameras: [data.Cameras[0], { ...data.Cameras[1], Resolution: value }, data.Cameras[2]] })
                else
                    setData({ ...data, Cameras: [data.Cameras[0], data.Cameras[1], { ...data.Cameras[2], Resolution: value }] })
                setCurrentCamera({ ...currentCamera, Resolution: value })
                break;
            case "contrast":
                if (cameraNum == 1)
                    setData({ ...data, Cameras: [{ ...data.Cameras[0], ContrastLevel: value }, data.Cameras[1], data.Cameras[2]] })
                else if (cameraNum == 2)
                    setData({ ...data, Cameras: [data.Cameras[0], { ...data.Cameras[1], ContrastLevel: value }, data.Cameras[2]] })
                else
                    setData({ ...data, Cameras: [data.Cameras[0], data.Cameras[1], { ...data.Cameras[2], ContrastLevel: value }] })
                setCurrentCamera({ ...currentCamera, ContrastLevel: value })
                break;
            case "imageColor":
                if (cameraNum == 1)
                    setData({ ...data, Cameras: [{ ...data.Cameras[0], ImageColor: value.substring(1) }, data.Cameras[1], data.Cameras[2]] })
                else if (cameraNum == 2)
                    setData({ ...data, Cameras: [data.Cameras[0], { ...data.Cameras[1], ImageColor: value.substring(1) }, data.Cameras[2]] })
                else
                    setData({ ...data, Cameras: [data.Cameras[0], data.Cameras[1], { ...data.Cameras[2], ImageColor: value.substring(1) }] })
                setCurrentCamera({ ...currentCamera, ImageColor: value.substring(1) })
                break;
            case "motionDetection":
                if (cameraNum == 1)
                    setData({ ...data, Cameras: [{ ...data.Cameras[0], MotionDetection: !data.Cameras[0].MotionDetection }, data.Cameras[1], data.Cameras[2]] })
                else if (cameraNum == 2)
                    setData({ ...data, Cameras: [data.Cameras[0], { ...data.Cameras[1], MotionDetection: !data.Cameras[1].MotionDetection}, data.Cameras[2]] })
                else
                    setData({ ...data, Cameras: [data.Cameras[0], data.Cameras[1], { ...data.Cameras[2], MotionDetection: !data.Cameras[2].MotionDetection} ] })
                setCurrentCamera({ ...currentCamera, MotionDetection: !currentCamera.MotionDetection })
                break;
        }
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

    function clearImageColor() {

        if (cameraNum == 1)
            setData({ ...data, Cameras: [{ ...data.Cameras[0], ImageColor: "Control" }, data.Cameras[1], data.Cameras[2]] })
        else if (cameraNum == 2)
            setData({ ...data, Cameras: [data.Cameras[0], { ...data.Cameras[1], ImageColor: "Control" }, data.Cameras[2]] })
        else
            setData({ ...data, Cameras: [data.Cameras[0], data.Cameras[1], { ...data.Cameras[2], ImageColor: "Control" }] })
        setCurrentCamera({ ...currentCamera, ImageColor: "Control" })
    }

    return (<Form style={{ padding: "10px", height: "100%"}}>
        <h2 style={{ color: "#0275d8" }}>Camera {cameraNum}</h2>
        <hr />
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
        <ButtonGroup className="float-right pl-0" style={{ paddingBottom: "10px" }}>
            <Button variant="primary" className=" border btn-dark float-left" style={{ width: "80px" }} onClick={saveConfiguration}>Save</Button>
            {cameraNum == 1 ? <></> : <Button variant="primary" className=" border btn-primary " onClick={() => { setCameraNum(cameraNum - 1) }} style={{ width: "100px" }}> Previous</Button>}
            {cameraNum == 3 ? <></> : <Button variant="primary" className=" border btn-primary " onClick={() => { setCameraNum(cameraNum + 1) }} style={{ width: "100px" }}> Next</Button>}

        </ButtonGroup>
    </Form>
    )
}


export default CameraConfiguration