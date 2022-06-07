import React, { useState, useEffect } from "react";
import { Container, Form, Button, FormText } from "react-bootstrap";
import { Link, useNavigate } from 'react-router-dom';
import '../ChangePassword.css';


function ChangePasswordQ() {
    const [email, setEmail] = useState()
    const [securityQuestion, setSecurityQuestion] = useState(null)
    const [answer, setAnswer] = useState()
    const [enteredAnswer, setEnteredAnswer] = useState()
    const navigate = useNavigate()

    async function handleEmailSubmit(e) {
        e.preventDefault()
        try {

            var formBody = [];
            var encodedKey = encodeURIComponent("email");
            var encodedValue = encodeURIComponent(email);
            formBody.push(encodedKey + "=" + encodedValue);

            let headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
            const response = await fetch('api/user/GetSecurityQuestion?' + formBody, {
                method: 'GET',
                headers: headers
            })

            if (response.status == 400) {
                document.getElementById("errorEmail").style.display = "block"
                document.getElementById("errorQuestion").style.display = "none"
            } else if (response.status == 500) {
                document.getElementById("errorEmail").style.display = "none"
                document.getElementById("errorQuestion").style.display = "block"
               
            }
            else if (response.ok) {
                document.getElementById("errorEmail").style.display = "none"
                document.getElementById("errorQuestion").style.display = "none"
                const data = await response.json()
                setSecurityQuestion(data.question)
                setAnswer(data.answer)
            } else {
                console.log(response)
            }
        } catch (e) {
            console.log(e)
        }


    }

    async function handleAnswerSubmit(e) {
        e.preventDefault()


        var formBody = [];
        var encodedKey = encodeURIComponent("email");
        var encodedAnswer = encodeURIComponent("answer");
        var encodedValue = encodeURIComponent(email);
        var encudedEnteredAnswer = encodeURIComponent(enteredAnswer);
        formBody.push(encodedKey + "=" + encodedValue +   "&" + encodedAnswer + "=" + encudedEnteredAnswer);

        let headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        const response = await fetch('api/user/VerifySecurityQuestion?' + formBody, {
            method: 'GET',
            headers: headers
        })

       


        if (response.ok) {
            document.getElementById("errorAnswer").style.display = "none"

            var formBody = [];
            var encodedKey = encodeURIComponent("targetEmail");
            var encodedValue = encodeURIComponent(email);
            formBody.push(encodedKey + "=" + encodedValue);


            var res = await fetch('/api/user/posttoken?' + formBody, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            })

            
            const data = await res.json()
            console.log(data)
            navigate('/ChangePass/' + data.token)

        } else {
            document.getElementById("errorAnswer").style.display = "block"
        }
    }


    return (
        <div id="">
            <Container className="mx-auto customContainerBig" id="first" style={{ margin:"15px" }}>
               
                <h4 style={{ color: "white", backgroundColor: "#0275d8", padding: "10px", borderRadius: "10px" }}>Change password with security questions</h4>
                <Form onSubmit={handleEmailSubmit} style={{ paddingTop: "20px" }}>
                <Form.Group className="mb-3" controlId="">
                    <Form.Label ><span >Please, enter your email:</span></Form.Label>
                        <Form.Control required type="email" style={{ width: "50%" }} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                        <p id="errorEmail" style={{ display: "none", color: "red" }}>User with this email does not exist.</p>
                        <p id="errorQuestion" style={{ display: "none", color: "red" }}>You didn't set your security question, please choose another method.</p>
                    </Form.Group>
                    <FormText muted />
                    <Button variant="primary" type="submit" >
                        Submit
                    </Button>
                   
                </Form>
                { securityQuestion === null ? <></> : 
                    <Form onSubmit={handleAnswerSubmit} style={{paddingTop:"20px"}}>
                        <FormText muted />
                        <Form.Group className="mb-3" controlId="" >
                            <Form.Label style={{fontWeight:"bold"}}>Answer your security question:</Form.Label>
                            <p>{securityQuestion}</p>
                            <Form.Control type="text" style={{width:"50%"} } placeholder="Enter your answer" onChange={(e) => setEnteredAnswer(e.target.value)} />
                            <p id="errorAnswer" style={{ display: "none", color:"red" }}>Your answer is incorrect.</p>
                         </Form.Group>
                        <FormText muted />
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>}
                <Link to={'/ChangePassword'} className="nav-link" id="withoutPad" style={{ color: "#4a4a4a", float:"right" }}> Choose another method</Link>
            </Container>
        </div>
    )
};

export default ChangePasswordQ;
