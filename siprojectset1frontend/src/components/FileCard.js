import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Modal, ButtonGroup, Card, Placeholder  } from "react-bootstrap";

import { useNavigate } from 'react-router-dom';


const FileCard = ({ file }) => {

    const [placeHolder, setPlaceHolder] = useState();

    useEffect(() => {
        if (file.extension == "jpg")
            setPlaceHolder("/image-place-holder.png");
        else
            setPlaceHolder("/video-place-holder.gif");

    }, []);

    return (

        <Container>
            <div className="card">
                <img className="card__image" variant="top" src={ placeHolder } />
                <div className="body">
                    <div className="card__title"> {file.name}</div>
                </div>
            </div>
            
        </Container>

    )
};

export default FileCard;


