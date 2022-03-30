import React, { useState } from 'react';
import { Container, Form, Button } from "react-bootstrap";

function AddUser() {

   

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [deletedStatus, setDeletedStatus] = useState(false);
    const [checked, setChecked] = useState(false)

   
    return (

        <Container className="mx-auto">
            <Form id="form" >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control required type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label>Surname</Form.Label>
                    <Form.Control required type="text" placeholder="Surname" onChange={(e) => setSurname(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Admin"  />
                </Form.Group>

                <Button variant="primary" type="submit" >
                    Submit
                </Button>

            </Form>

        </Container>
    )
};

export default AddUser;