import React, { useEffect, useState, useRef } from 'react';
import { Container, Modal, CloseButton, ButtonGroup, Button, Row, Col, Spinner } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import ReactPlayer from 'react-player'
import Breadcrumb from 'react-bootstrap/Breadcrumb'
import { BsArrowCounterclockwise } from "react-icons/bs";



const FileList = () => {

    var { state } = useLocation();
    const navigate = useNavigate();
    const { mac } = useParams();
    const fileDownload = require('js-file-download');
    const interval = useRef()


    const [filesAndFolders, setFilesAndFolders] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [crumbs, setCrumbs] = useState([]);
    const [lastCrumb, setLastCrumb] = useState({});
    const [terminalId, setTerminalId] = useState();
    const [testImage, setTestImage] = useState();
    const [syncing, setSyncing] = useState(false)

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


            
                var data1 = await response1.json();

                console.log("data1: " + JSON.stringify(data1));
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

                var encodedKey = encodeURIComponent("MacAddress");
                var encodedValue = encodeURIComponent(mac);

                const response2 = await fetch('/api/Licence/GetTerminalAndDebugLog?' + encodedKey + "=" + encodedValue, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                });

                var data2 = await response2.json();
                console.log("data2: " + data2);
                setTerminalId(data2.terminalID)

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

        setSyncing(true)
        showSpinner()
        
        interval.current = setInterval(async () => {
            const response = await fetch('/api/FileUpload/GetFileSyncActive/' + mac)
            const data = await response.json()
            console.log(data)
            if (!data) {
                setSyncing(false)
                fetch('/api/FileUpload/ChangeFileSyncState/' + mac + '/0')
                fetchMain()
                hideSpinner()
                clearInterval(interval.current)
            }
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
                <img style={{ flex: '1', margin: 0 }} onMouseOver={{ cursor: "pointer" }} src={icon} width="32" height="32" />
                <p style={{ flex: '10', margin: 0 }} onMouseOver={{cursor: "pointer"}}>{cell}</p>
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

        }
    }

    const columns = [
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

            <h1>{terminalId}</h1>
            <Row>
                <Col className="col-md-7 pr-0">
                    <Breadcrumb className="w-100">
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
                    <Button variant="primary" className="w-100" onClick={handleDownload} style={{ marginBottom: "5px" }}>Download</Button>
                </Col>
                <Col className="col-sm-2  pl-0 pt-1">
                    <Button variant="primary" className="w-100" onClick={handleSync} style={{ marginBottom: "5px" }}>Synchronize</Button>
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
                onHide={() => setShow(false)}
                dialogClassName="modal-customw"

            >
                <Modal.Header closeButton>

                    <Modal.Title id="example-custom-modal-styling-title">
                        {file.name}
                    </Modal.Title>
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