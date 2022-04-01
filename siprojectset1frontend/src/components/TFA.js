import React, { useEffect, useState, useContext } from "react";
import { Container, Segment, Form, Button, Spinner } from "react-bootstrap";

import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../App"




async function tfaActivate(email) {
    var formData = {
        "email": email
    };
    var formBody = [];
    for (var property in formData) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(formData[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const response1 = await fetch("/api/user/tfalogin?" + formBody,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            data: formBody
        });
    const resp = await response1;
    const resp2 = await response1.body;
    const resp3 = await resp2.getReader().read();
    var result = String.fromCharCode.apply(null, resp3.value);
    
    console.log("Response u async je: ");
    console.log(result);
    return result;
}



function TFA() {
    const { state } = useLocation();
    const { ftasendcode } = useContext(AuthContext);

    const [jwtToken, setJWTToken] = useState();
    const [email, setEmail] = useState();
    const [tfaActive, setTFAActive] = useState();
    const [code, setCode] = useState();
    const [validated, setValidated] = useState(false);
    const [tokenDetails, setTokenDetails] = useState();

    const navigate = useNavigate()


    useEffect(() => {
        if (state != null) {
            tfaActivate(state.email).then(data => setTFAActive(data)).then(() => {
                setEmail(state.email);
                setJWTToken(state.token);
                hideSpinner();
            })
        } 
    }, []);

    function hideSpinner() {
        if (document.getElementById('spinner')) document.getElementById('spinner').style.display = 'none';
    }

    async function handleGoodSubmit(event) {

        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            return
        }

        setValidated(true);

        ftasendcode({ "code": code, "email": email, "token":  jwtToken}).then(res => {
            if (res == "true") {
                navigate('/Home');
            } else {
                if(document.getElementById('error')) document.getElementById('error').style.display = "block";
            }
        })
            .catch(console.error);
    };



    console.log(tfaActive);
    if (tfaActive != null && tfaActive == "true") {
        return (
            <Container className="mx-auto">
                <Form noValidate validated={validated} onSubmit={handleGoodSubmit}>
                    <Form.Group className="mb-3" controlId="formCode">
                        <Form.Label>Enter your code</Form.Label>
                        <Form.Control required type="number" placeholder="Enter code" onChange={(e) => setCode(e.target.value)} />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        )
    } else {
        return (
            <div>
                <Container className="mx-auto">
                    <Spinner id="spinner" animation="border" variant="primary" />
                    <img src={tfaActive} />
                    <br />
                    <Form noValidate validated={validated} onSubmit={handleGoodSubmit}>
                        <Form.Group className="mb-3" controlId="formCode">
                            <Form.Label>Enter your code</Form.Label>
                            <Form.Control required type="number" placeholder="Enter code" onChange={(e) => setCode(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>
                        <p style={{ 'display': 'none', 'color': 'red' }} id="error">Your code is incorrect.</p>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
            </div>
        )
    }

    return (
        <div>
            This is from parent: {email}
        </div>
    )
};

export default TFA;
