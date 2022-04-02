import React, { useEffect, useState } from 'react';
import { Container, Form, Button,  Row, Col, Spinner } from "react-bootstrap";

import jwt from "jwt-decode";


function EditProfile() {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null)
    const [validated, setValidated] = useState(false);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [securityQuestion, setSecurityQuestion] = useState({ question: "", answer: ""});
    const questions = ["What is your mother's maiden name?", "What is your first pet's name?",
            "What is the name of your favorite teacher?" , "Where was your grandfather born?"   ]
   


    useEffect(async () => {

        try {
            let token = localStorage.getItem("token");
            var formBody = [];
            var encodedKey = encodeURIComponent("email");
            var encodedValue = encodeURIComponent(jwt(token).email);
            formBody.push(encodedKey + "=" + encodedValue);

            let tokenSend = 'Bearer ' + token

            let headers = {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  "Authorization": tokenSend }
            const response = await fetch('api/user/GetUser?' + formBody, {
                method: 'GET',
                headers: headers
            })

            const responseQ = await fetch('api/user/GetSecurityQuestion?' + formBody, {
                method: 'GET',
                headers: headers
            })


            var data = await response.json()
            setUser(data)
            setEmail(data.email)
            setName(data.name)
            setSurname(data.surname)
            setPassword(data.password)
            
            
            if (responseQ.ok) {
                let sq = await responseQ.json()
                setSecurityQuestion({ id: sq.id, userId: sq.userId, question: sq.question, answer: sq.answer })
            } else {
                setSecurityQuestion({ ...securityQuestion, question: questions[0] })
            }
            setLoading(false)

        } catch (e) {
            console.log(e)
        }

    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {


            const userSend = {
                id: user.id, email: email, name: name, surname: surname, password: password, roleId: user.roleId, deletedStatus: false
            };

            try {

                let token = 'Bearer ' + localStorage.getItem('token')
                const headers = { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': token }
                
                const options = {
                    method: 'PUT',
                    headers: headers,
                    body: JSON.stringify(userSend)
                }
                await fetch('api/user/EditProfile', options)

                if (!securityQuestion.question.trim().length == 0 && !securityQuestion.answer.trim().length == 0) {
                    let sq = securityQuestion
                    sq.userId = user.id


                    const headers = { 'Accept': 'application/json', 'content-type': 'application/json', 'Authorization': token }
                    const options = {
                        method: 'PUT',
                        headers: headers,
                        body: JSON.stringify(sq)
                    }
                    await fetch('api/user/UpdateSecurityQuestion', options)
                }

                window.location.reload(false);


            } catch (e) {
                console.log(e);
            }

        }
        setValidated(true);
        event.preventDefault();
    };

    if (loading) {
        return <Container fluid className="d-flex justify-content-center">
            <Spinner id="spinner" animation="border" variant="primary" />
        </Container>
    }

    return (

        <Row>
            <Col md={8}>
         
                <Container className="mx-auto" style={{paddingLeft: "20px"}} >
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control defaultValue={user.email} required type="email" placeholder="Enter@email" style={{ width: "60%" }} onChange={(e) => setEmail(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control defaultValue={user.name} required type="text" placeholder="Name" style={{ width: "60%" }} onChange={(e) => setName(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control defaultValue={user.surname} required type="text" placeholder="Surname" style={{ width: "60%" }} onChange={(e) => setSurname(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control defaultValue={user.password} required type="password" placeholder="Password" style={{ width: "60%" }} onChange={(e) => setPassword(e.target.value)} />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formQuestionSelect">
                            <Form.Label>Security Question</Form.Label>
                            <Form.Control as="select" aria-label="Default select example" style={{ marginBottom: "5px", width:"60%" }} defaultValue={securityQuestion.question }  onChange={(e) => setSecurityQuestion({ ...securityQuestion, question: e.target.value })}>
                            {questions.map((q,i) => (

                                <option value={q} key={i}>{q}</option>

                            ))}
                            </Form.Control>
                            <Form.Group className="mb-3" controlId="formAnswer">
                                <Form.Control required type="text" defaultValue={securityQuestion.answer} style={{ width: "60%" }} placeholder="Answer here" onChange={(e) => setSecurityQuestion({ ...securityQuestion, answer: e.target.value })} />
                                </Form.Group>
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

export default EditProfile;
