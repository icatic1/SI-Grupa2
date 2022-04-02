import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Modal, ButtonGroup } from "react-bootstrap";

import { useNavigate } from 'react-router-dom';


const UserCard = ({ user, navigation }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false); setTimeout(() => { window.location.reload() }, 250) }
    const handleShow = () => {
        setShow(true);
    }

    const navigate = useNavigate();

    const deleteUser = async (user) => {
        try {
            let token = 'Bearer ' + localStorage.getItem('token')
            const headers = { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': token }
            console.log(JSON.stringify(user));
            fetch('api/user/deleteuser',
                {
                    method: 'PUT',
                    body: JSON.stringify(user),
                    headers: headers
                }).then(handleClose());

            // console.log(response);
        } catch (e) {
            console.log(e);
        }
    }
    return (


        <Container fluid="sm" className="block-example border-bottom border-info" >

            <Row >
                <Col xs={12} sm={8} md={8}  >
                    <Container className="my-1">
                        Name: {user.name}
                    </Container>
                </Col>

            </Row>

            <Row>
                <Col xs={12} sm={8} md={8}  >
                    <Container className="my-1">
                        Surname: {user.surname}
                    </Container>
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={8} md={8} >
                    <Container className="my-1">
                        Email: {user.email}
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

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Infromation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete the user?</Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" className="btn-small" onClick={() => { deleteUser(user) }}  >Yes</Button>
                    <Button variant="secondary" className="btn-small" onClick={() => { handleClose() }} >No</Button>
                </Modal.Footer>
            </Modal>

        </Container>

    )
};

export default UserCard;


