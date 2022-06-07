import React, { useEffect, useState } from 'react';
import { Container, Segment, Form, Button, Modal, Row, Col, Select } from "react-bootstrap";
import { BsXLg } from "react-icons/bs";

function AddUser() {

    const [validated, setValidated] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [deletedStatus, setDeletedStatus] = useState(false);
    const [checked, setChecked] = useState(false)
    const [modal, setmodal] = useState("User successfully added!");
    const [userRole, setUserRole] = useState();

    const [roles, setRoles] = useState();


    const [show, setShow] = useState(false);


    useEffect(() => {
        const fetchMain = async () => {
            try {
                const headers = { 'content-type': 'application/json' }
                const response = await fetch("api/user/getallroles",
                    {
                        method: 'GET',
                        headers: headers
                    });

  
                const data = await response.json();

                setRoles(data);
                setUserRole(data[0].id);
            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();
    }, []);


    const handleClose = () => { setShow(false); document.getElementById('form').submit(); }
    const handleShow = () => {
        setShow(true);
    }

    const handleClick = () => setChecked(!checked)


    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
        }

        setValidated(true);
        event.preventDefault();
        const user = { email, name, surname, password, deletedStatus, roleId: userRole };
        try {

            
            let token = 'Bearer ' + localStorage.getItem('token')
            const headers = { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': token }

            fetch('api/user/adduser',
                {
                    method: 'POST',
                    body: JSON.stringify(user),
                    headers: headers
                }).then(res => {
                    if (res.ok) {
                        return res;
                    } else {
                        setmodal("User not added!")
                        throw Error(`Request rejected with status ${res.status}`);
                    }
                })
                .catch(console.error)

        } catch (e) {
            console.log(e);
        }
    };


    return (
        <Container style={{paddingBottom:"10px"}}>
            <h3 style={{ color: "#0275d8" }}>Add a new user</h3>
            <hr />
        <Row>
            <Col md={8}>
                <Container className="mx-auto" >
                    <Form id="form" noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control style={{ width: "60%" }} required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control style={{ width: "60%" }} required type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control style={{ width: "60%" }} required type="text" placeholder="Surname" onChange={(e) => setSurname(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control style={{ width: "60%" }} required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicRoleSelect" required>
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" style={{ width: "60%" }} defaultValue={userRole} aria-label="Default select example" onChange={(e) => setUserRole(e.target.value)}>
                                {roles?.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>

                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" onClick={handleShow}>
                            Submit
                        </Button>

                    </Form>

                    <Modal show={show}>
                        <Modal.Header closeButton={false}>
                            <Modal.Title>Information</Modal.Title>
                            <BsXLg onClick={handleClose} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                        </Modal.Header>
                        <Modal.Body>{modal}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" onClick={handleClose}>
                                OK
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </Col>
        </Row>
        </Container>
    )
};

export default AddUser;

