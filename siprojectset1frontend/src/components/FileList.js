import React, { useEffect, useState, useRef } from 'react';
import { Container, Modal, CloseButton, ButtonGroup, Button, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import ReactPlayer from 'react-player'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { BsArrowCounterclockwise } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";


const FileList = () => {

    var { state } = useLocation();
    const navigate = useNavigate();
    const { mac } = useParams();
    const fileDownload = require('js-file-download');
    const [count, setCount] = useState(0);
    


    const [filesAndFolders, setFilesAndFolders] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [crumbs, setCrumbs] = useState([]);
    const [lastCrumb, setLastCrumb] = useState({});
    const [terminalId, setTerminalId] = useState();
    const [testImage, setTestImage] = useState();
    

    useEffect(async () => {
        const response2 = await fetch("/api/Licence/GetDeviceByMAC?MacAddress=" + mac)
        var data2 = await response2.json();
        setTerminalId(data2.terminalID)
    }, [])


    useEffect(() => {

        fetchMain();

    }, [state]);

    useEffect(() => {
        hideSpinner();
    }, [filesAndFolders]);

    const fetchMain = async () => {
        try {
            if (state == null)
                state = "/" + mac;

            const response1 = await fetch('/api/FileUpload/GetFilesByPathSortedNew' + state + '?MacAddress=' + mac,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response1.ok) {
                    setFilesAndFolders([])
                    return
                }

            
                var data1 = await response1.json();

                await setFilesAndFolders(data1);



                var crumbsHelper = await state.substr(1).split('%5C');



                var pathHelper = "";
                var crumbsHelperArray = [];

                for (let i = 0; i < crumbsHelper.length; i++) {
                    if (i == 0)
                        pathHelper = "/" + crumbsHelper[i];
                    else
                        pathHelper = pathHelper + '%5C' + crumbsHelper[i];
                    crumbsHelperArray.push({
                        'name': crumbsHelper[i],
                        'path': pathHelper
                    })
                }

               
               

                await setCrumbs(crumbsHelperArray);
                await setLastCrumb(crumbsHelperArray[crumbsHelperArray.length - 1]);
          
        } catch (e) {
            console.log(e)
        }
    };

    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';

    }

    function showSpinner() {
        document.getElementById('spinner').style.display = 'block';
    }

    async function getStaticFile(file) {
        file = file.replaceAll('%5C', '\\');
        
        setTestImage("/api/FileUpload/GetStaticContent?MacAddress=" + mac + "&path=" + file);
        
        return "haha";
    }

    const handleOnSelect = (row, isSelect) => {
        if (isSelect == true) {
            setSelectedFiles([...selectedFiles, row.path])
        }
        else {
            setSelectedFiles(selectedFiles.filter((it) => it != row.path))
        }


        return true; // return true or dont return to approve current select action
    }

    const handleOnSelectAll = (isSelect, rows, e) => {
        if (isSelect) {
            setSelectedFiles(rows.map((r) => r.path))
        } else {
            setSelectedFiles([])
        }

    }

    const handleDownload = async () => {
        if (selectedFiles.length === 0)
            return;
        var formBody = { files: selectedFiles }

        const response = await fetch('/api/FileUpload/DownloadFiles' + '?MacAddress=' + mac,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formBody)

            });
        const data = await response.blob()
        console.log(data)

        fileDownload(data, 'snapshotCaptures.zip');
        console.log(response)
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    const handleSync = async () => {

        const response = await fetch('/api/FileUpload/ChangeFileSyncState/' + mac + '/1', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response;

        
        showSpinner()
        
        setTimeout(async () => {
            await fetch('/api/FileUpload/ChangeFileSyncState/' + mac + '/0')
            await fetchMain()
            hideSpinner()
        }, 1000)


    }

    const mystyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };


    const formatWithIcon = (cell, row) => {
        var icon = "";
        if (row.type == "File folder")
            icon = "/iconFolder.png";
        else if (row.type == "jpg" || row.type == "PNG" || row.type == "png")
            icon = "/iconPicture.png";
        else
            icon = "/iconVideo.png";

        return (
            <div style={mystyle}>
                <img style={{ flex: '1', margin: 0 }} src={icon} width="32" height="32" />
                <p id={row.tempId} style={{ flex: '10', margin: 0, textDecoration: "underline" }} >{cell}</p>
            </div>
        )
    }

    const selectRow = {
        mode: "checkbox",
        // clickToSelect: true,
        bgColor: '#f2f3f4',
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll
    };


    const rowEvents = {
        onDoubleClick: (e, row, rowIndex) => {
            if (row.type == "File folder") {
                navigate("/FileList/" + mac, { state: row.croppedPath });
                setShow(false);
            }
            else {
                setShow(true);
                console.log(row);
                setFile(row);
                getStaticFile(row.croppedPath)
            }
        },
        onMouseEnter: (e, row, rowIndex) => {
            // console.log(row.tempId);
            document.getElementById(row.tempId).style.cursor = 'pointer';
        }
    }

    const columns = [
        {
            dataField: 'tempId',
            text: 'ID',
            sort: true,
            hidden: true
        },
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            formatter: formatWithIcon,
        },
        {
            dataField: 'date',
            text: 'Date modified',
            sort: true,
        },
        {
            dataField: 'type',
            text: 'Type',
            sort: true
        },
        {
            dataField: 'size',
            text: 'Size',
            sort: true
        },
    ];


    return (
        <Container>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            <Link to="/Devices" style={{ fontSize: "18px" }}>See all devices</Link>
            <h2 style={{ backgroundColor:"#0275d8", borderRadius:"20px", color:"white", marginTop:"20px", padding:"5px", width:"30%", textAlign:"center"}}>{terminalId}</h2>
            <Row className="d-flex align-items-center" style={{margin: "3px 0px 3px 0px"}}>
                <Col className="col-md-7 justify-content-center" style={{padding:"15px 0 0"}}>
                    <Breadcrumb className="w-100 justify-content-center" >
                        {crumbs.map((item) =>
                            item.path == lastCrumb.path ?
                                <Breadcrumb.Item active>{item.name}</Breadcrumb.Item>
                                :
                                (
                                    <Breadcrumb.Item onClick={() => { navigate("/FileList/" + mac, { state: item.path }); }}>
                                        {item.name}
                                    </Breadcrumb.Item>
                                )

                        )}
                    </Breadcrumb>
                </Col>


                <Col className="col-1 pr-0  pt-2">
                    <BsArrowCounterclockwise size={30} color={"#0275d8"} onClick={() => { showSpinner(); fetchMain(); }} className="pointer" />
                </Col>
                <Col className="col-sm-2 pl-0 pt-1">
                    <Button variant="primary" className="w-100" onClick={handleDownload} >Download</Button>
                </Col>
                <Col className="col-sm-2  pl-0 pt-1">
                    <Button variant="primary" className="w-100" onClick={handleSync}>Synchronize</Button>
                </Col>
            </Row>

            <BootstrapTable
                keyField="date"
                data={filesAndFolders}
                columns={columns}
                selectRow={selectRow}
                rowEvents={rowEvents}
                bordered={false}
            />
            <Modal
                show={show}
                dialogClassName="modal-customw"

            >
                <Modal.Header closeButton={false}>

                    <Modal.Title id="example-custom-modal-styling-title">
                        {file.name}
                    </Modal.Title>
                    <BsXLg onClick={() => setShow(false)} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                </Modal.Header>
                <Modal.Body>
                    {file.type === "png" || file.type === "jpg" || file.type == "PNG" ?
                        <div class="d-flex justify-content-center py-4">
                            <img src={ testImage } alt="Random picture" class="img-responsive" />

                        </div> :
                        <div class="d-flex justify-content-center py-4">
                                <ReactPlayer controls url={ testImage } />

                        </div>
                    }
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FileList;