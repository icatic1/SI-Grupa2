import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../ChangePassword.css';


function ChangePasswordQ() {
    return (
        <div id="">
            <Container className="mx-auto" id="first">
                <Link to={'/ChangePassword'} className="nav-link" id="withoutPad"> Change password home page</Link>
                <h1 className="headingPass">Change password with security question</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="">
                        <Form.Label>Answer your security question:</Form.Label>
                        <Form.Control type="text" placeholder="Enter answer" />
                        <Form.Text className="text-muted">

                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
};

export default ChangePasswordQ;
