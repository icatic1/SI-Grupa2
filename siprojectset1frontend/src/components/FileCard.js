import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Modal, ButtonGroup, Card, Placeholder } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';


const FileCard = ({ file, mac }) => {

    const [placeHolder, setPlaceHolder] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        if (file.extension == "jpg" || file.extension == "png")
            setPlaceHolder(file.previewPath);
        else if (file.extension == "mp4")
            setPlaceHolder("/video-place-holder.gif");
        else
            setPlaceHolder("/folder-place-holder.png");
    }, []);

    return (

        <Container>
            <div className="card" onClick={() => { if (file.extension == "folder") navigate("/FileList/" + mac, { state: file.cropped }); }}>
                <img className="card__image" variant="top" src={placeHolder} />
                <div className="body">
                    <div className="card__title"> {file.name}</div>
                </div>
            </div>

        </Container>

    )
};

export default FileCard;