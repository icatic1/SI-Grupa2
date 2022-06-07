import React, { useState, useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../App"

function Login() {
    const { onLogin } = useContext(AuthContext);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate()
    async function handleSubmit(event) {

        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return
        }

        setValidated(true);

        await onLogin({ "email": email, "password": password }).then(res => {
            if (res != null) {

                navigate('/TFA', { state: { "email": email, "token": res } });
            }
            else {
                document.getElementById('error').style.display = "block"
            }
        })

    };

    return (
        <div>
        <Container className="mx-auto customContainer">
                <h1 style={{ textAlign: "center", color:"#0275d8"}}>Login</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </Form.Group>
                <Link to={'/ChangePassword'} className="nav-link">Forgot your password?</Link>
                    <p style={{ 'display': 'none', 'color': 'red' }} id="error">Your email or password is incorrect.</p>
                    <div style={{ textAlign: "center", paddingTop:"20px" }}>
                        <Button id="sub_btn" variant="primary btn-md" style={{width:"100%" }} type="submit">
                            Login
                        </Button>
                    </div>
            </Form>
            </Container>
            </div>
    )
};

export default Login;