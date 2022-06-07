import React from "react";
import { useState } from "react";
import { Container, Form, Button,Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { BsXLg } from "react-icons/bs";
import '../ChangePassword.css';


function ChangePasswordM() {

    const [email, setEmail] = useState();
    const [modal, setmodal] = useState("Your reset link is on the way! Please, check your email inbox.");
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }

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

            setShow(true);

            //posalji mail

            podaci.Token = data.token
            const a = JSON.stringify(podaci)

            
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
            
      
        }

    }


    return (
        <div id="">
            <Container className="mx-auto customContainerBig" style={{ margin:"15px" }}>
                
                <h4 style={{ color: "white", backgroundColor: "#0275d8", padding: "10px", borderRadius: "10px" }}>Change password with email</h4>
                <Form onSubmit={handleUserEmail} style={{paddingTop:"20px"}}>
                    <Form.Group className="mb-3" controlId="">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" style={{ width: "50%" }} placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)}/>
                        <Form.Text className="text-muted">

                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <Link to={'/ChangePassword'} className="nav-link" id="withoutPad" style={{ color: "#4a4a4a", float:"right" }}> Choose another method</Link>
            </Container>
            <Modal show={show} >
                <Modal.Header closeButton={false}>
                    <Modal.Title>Information</Modal.Title>
                    <BsXLg onClick={handleClose} style={{ float: "right", size: "50px", cursor: "pointer" }}></BsXLg>
                </Modal.Header>
                <Modal.Body>{modal}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
};

export default ChangePasswordM;
