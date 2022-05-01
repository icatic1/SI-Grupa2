import React, { useEffect, useState } from 'react';
import { Container, Modal } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import ReactPlayer from 'react-player'

const FileList = () => {

    var { state } = useLocation();
    const navigate = useNavigate();
    const { mac } = useParams();


    const [filesAndFolders, setFilesAndFolders] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState({});


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


                console.log(response1);
                var data1 = await response1.json();
                console.log(data1);
                await setFilesAndFolders(data1);
                console.log("Sta se desava " + filesAndFolders);

            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();

    }, [state]);


    const handleOnSelect = (row, isSelect) => {
        //Amila
        return true; // return true or dont return to approve current select action
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
        else if (row.type == "jpg" || row.type == "png")
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
            <BootstrapTable
                keyField="date"
                data={filesAndFolders}
                columns={columns}
                selectRow={selectRow}
                rowEvents={ rowEvents }
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
                    {file.type === "png" || file.type === "jpg" ?
                        <div>
                            <img src={file.previewPath} alt="Random" class="img-responsive"/>
                        </div> :
                        <div>
                            {console.log(file.previewPath)}
                            <ReactPlayer controls url={file.previewPath} />
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FileList;