import React from "react";
import { useState, useContext } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import '../ChangePassword.css';


function ChangePasswordM() {

    const [email, setEmail] = useState();

    const handleUserEmail = async (event) => {
        event.preventDefault();// ne dirati

        try {

            const podaci = { ToEmail: email, UserName: "User", Token: "" };
            

            const p = { targetEmail: email }
            const b = JSON.stringify(p)
            

            //postavi token

            var formBody = [];
            var encodedKey = encodeURIComponent("targetEmail");
            var encodedValue = encodeURIComponent(email);
            formBody.push(encodedKey + "=" + encodedValue);
            

            var rez = await fetch('/api/user/posttoken?' + formBody, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: formBody
            })
            
            const data = await rez.json()
            

            //posalji mail

            podaci.Token = data.token
            const a = JSON.stringify(podaci)

            console.log(podaci);
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: a
            }
            //event.preventDefault(); //dodati u slucaju debagiranja
            fetch('/api/mail/pass', options).then(res => {
                if (res.ok) {
                    return res;
                } else {
                    throw Error(`Request rejected with status ${res.status}`);
                }
            })
                .catch(console.error)
        } catch (e) {
            console.log(e);
            
            alert("uzbuna");
            
        }

    }


    return (
        <div id="">
            <Container className="mx-auto" style={{ margin:"15px" }}>
                <Link to={'/ChangePassword'} className="nav-link" id="withoutPad"> Change password home page</Link>
                <h1 className="headingPass">Change password with email</h1>
                <Form onSubmit={handleUserEmail}>
                    <Form.Group className="mb-3" controlId="">
                        <Form.Label>Enter email:</Form.Label>
                        <Form.Control type="email" style={{ width: "50%" }} placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
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

export default ChangePasswordM;
