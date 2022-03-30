import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from "react-bootstrap";

import { useLocation, useNavigate } from 'react-router-dom';





function UpdateUser() {


    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const { state } = useLocation();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [deletedStatus, setDeletedStatus] = useState(false);

    useEffect(() => {
        if (state != null) {
            setEmail(state.email);
            setPassword(state.password);
            setName(state.name);
            setSurname(state.surname);
        }
    }, []);
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const userSend = {
                id: state.id, email: email, name: name, surname: surname, password: password, deletedStatus: false
            };
            try {
                const headers = { 'Accept': 'application/json', ' content-type': 'application/json' }
                const a = JSON.stringify(userSend)
                const options = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: a
                }
                fetch('/user/updateuserinfo', options).then(() => { navigate("/GetAll"); window.location.reload(false); })
            } catch (e) {
                console.log(e);
            }

        }
        setValidated(true);
        event.preventDefault();
    };




    return (

        <Container className="mx-auto">


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
                <Button variant="primary" type="submit" >
                    Submit
                </Button>

            </Form>
        </Container>
    )
};

export default UpdateUser;