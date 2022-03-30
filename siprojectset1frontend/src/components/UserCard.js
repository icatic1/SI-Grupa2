import React from "react";
import { Container,  Row,Button, Col} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


const UserCard = ({ user }) => {
    const navigate = useNavigate();

    return (


        <Container className="block-example border-bottom border-info" >

            <Row>
                <Col sm={9} >Name: {user.name} </Col>
            </Row>
            <Row>
                <Col sm={9}>Surname: {user.surname}</Col>
                <Col sm={2}>
                    <Container className="my-2">
                        <Button sm={2} variant="primary" onClick={() => { navigate("/UpdateUser", { state: user }) }}> Update</Button>
                    </Container>
                </Col>
            </Row>
            <Row>
                <Col sm={9}>Email: {user.email}</Col>
                <Col sm={2}>
                </Col>
            </Row>
        </Container>
    )
};

export default UserCard;