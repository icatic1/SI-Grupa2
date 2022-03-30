import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [validated, setValidated] = useState(false);

    function handleSubmit() {
        //treba implementirati
    }

    return (

        <Container className="mx-auto">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Link to={'/'} className="nav-link">Forgot your password?</Link>
                <p style={{ 'display': 'none', 'color': 'red' }} id="error">Your email or password is incorrect.</p>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    )
};

export default Login;