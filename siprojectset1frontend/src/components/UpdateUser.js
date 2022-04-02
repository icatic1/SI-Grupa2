import React, { useEffect, useState } from 'react';
import { Container, Segment, Form, Button, DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateUser() {
    const [loading, setLoading] = useState(false);

    const { state } = useLocation();
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [deletedStatus, setDeletedStatus] = useState(false);
    const [role, setRole] = useState();
    const [roleId, setRoleId] = useState();

    // sve role iz baze sa id i name
    const [roles, setRoles] = useState();

    const [show, setShow] = useState(false);

    const handleClose = () => { setShow(false); document.getElementById('form').submit(); }
    const handleShow = () => {
        setShow(true);
    }

    useEffect(() => {



        setName(state.name);
        setEmail(state.email);
        setPassword(state.password);
        setSurname(state.surname);
        setRole(state.role);
        setRoleId(state.roleId)

        const InitFetch = async () => {
            try {
                setLoading(true);
                const headers = { 'content-type': 'application/json' }
                const response = await fetch("api/user/getallroles",
                    {
                        method: 'GET',
                        headers: headers
                    });

                const allRoles = await response.json();
                setRoles(allRoles);
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false);
            }
        };


        InitFetch();


    }, []);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {


            const userSend = {
                id: state.id, email: email, name: name, surname: surname, password: password, roleId: roleId, deletedStatus: false
            };
            try {

                let token = 'Bearer ' + localStorage.getItem('token')
                const headers = {'Accept': 'application/json',  'content-type': 'application/json', 'Authorization': token}
                const a = JSON.stringify(userSend)
                const options = {
                    method: 'PUT',
                    headers: headers,
                    body: a
                }
                fetch('api/user/updateuserinfo', options).then(() => { navigate("/GetAll"); window.location.reload(false); })
            } catch (e) {
                console.log(e);
            }

        }
        setValidated(true);
        event.preventDefault();
    };

    if (loading) {
        return null;
    }

    return (

        <Row>
            <Col md={8}>
                <Container className="mx-auto" >
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control defaultValue={state.email} required type="email" placeholder="Enter@email" onChange={(e) => setEmail(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={state.name} required type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control defaultValue={state.surname} required type="text" placeholder="Surname" onChange={(e) => setSurname(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control defaultValue={state.password} required type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicRoleSelect">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" aria-label="Default select example" defaultValue={state.roleId} onChange={(e) => setRoleId(e.target.value)}>
                                {roles?.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>

                    </Form>
                </Container>
            </Col>
        </Row>
    )
};

export default UpdateUser;