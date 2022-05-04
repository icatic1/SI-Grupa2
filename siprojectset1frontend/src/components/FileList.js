import React, { useEffect, useState } from 'react';
import { Container, Modal, CloseButton, ButtonGroup, Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import ReactPlayer from 'react-player'



const FileList = () => {

    var { state } = useLocation();
    const navigate = useNavigate();
    const { mac } = useParams();
    const fileDownload = require('js-file-download');
    


    const [filesAndFolders, setFilesAndFolders] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState({});
    const [selectedFiles, setSelectedFiles] = useState([]);


    useEffect(() => {
        const fetchMain = async () => {
            try {
                if (state == null)
                    state = "/" + mac;


                const response1 = await fetch('/api/FileUpload/GetFilesByPathSortedNew' + state,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });


               
                var data1 = await response1.json();
                
                await setFilesAndFolders(data1);
                

            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();

    }, [state]);


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
        
        const response = await fetch('/api/FileUpload/DownloadFiles',
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
                <img style={{ flex: '1', margin: 0 }} src={ icon } width="32" height="32"/>
                <p style={{ flex: '10', margin: 0 }} >{cell}</p>
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
            <ButtonGroup style={{ float: 'right'}}>
                <Button variant="primary" style={{  marginBottom: '10px' }} onClick={handleDownload}>Download</Button>
            </ButtonGroup>
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
                            <img src={file.previewPath} alt="Random" class="img-responsive"/>
                        </div> :
                        <div class="d-flex justify-content-center py-4">
                            <ReactPlayer controls url={file.previewPath} />
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FileList;