import React, { useState } from 'react';
import { Container, Button, Row, Col, Modal, ButtonGroup } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";

import { useNavigate } from 'react-router-dom';


const UserCard = ({ user, navigation }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false)}
    const handleShow = () => {
        setShow(true);
    }

    const navigate = useNavigate();

    const deleteUser = async (user) => {
        try {
            let token = 'Bearer ' + localStorage.getItem('token')
            const headers = { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': token }
            
            fetch('api/user/deleteuser',
                {
                    method: 'PUT',
                    body: JSON.stringify(user),
                    headers: headers
                }).then(() => { handleClose(); setTimeout(() => { window.location.reload() }, 250); });

            
        } catch (e) {
            console.log(e);
        }
    }
    return (


        <Container fluid="sm" className="block-example border-bottom border-info" >

            <Row >
                <Col xs={12} sm={8} md={8}  >
                    <Container className="my-1">
                        <span style={{fontWeight:"bold"}}>Name:</span> {user.name}
                    </Container>
                </Col>

            </Row>

            <Row>
                <Col xs={12} sm={8} md={8}  >
                    <Container className="my-1">
                        <span style={{ fontWeight: "bold" }}>Surname:</span> {user.surname}
                    </Container>
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={8} md={8} >
                    <Container className="my-1">
                        <span style={{ fontWeight: "bold" }}>Email:</span> {user.email}
                    </Container>
                </Col>
                <Col xs={12} sm={4} md={4} className="float-right">
                    <Container className="my-1">
                        <ButtonGroup className="float-right pl-0">
                            <Button variant="primary" className="  border btn-big " onClick={() => { navigate("/UpdateUser", { state: user }) }}> Edit</Button>
                            <Button variant="primary" className=" border btn-big  " onClick={() => { handleShow() }} > Delete</Button>
                        </ButtonGroup>
                    </Container>
                </Col>

            </Row>

            <Modal show={show}>
                <Modal.Header closeButton={false}>
                    <Modal.Title>Infromation</Modal.Title>
                    <BsXLg onClick={handleClose} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn-small" onClick={() => { deleteUser(user) }}  >Yes</Button>
                    <Button variant="secondary" className="btn-small" onClick={(e) => { e.preventDefault(); handleClose() }} >No</Button>
                </Modal.Footer>
            </Modal>

        </Container>

    )
};

export default UserCard;


