import React from "react";
import { Container,  Row, Col,} from "react-bootstrap";






const UserCard = ({ user }) => {


    return (


        <Container className="block-example border-bottom border-info" >

            <Row>
                <Col sm={9} >Name: {user.name} </Col>
            </Row>
            <Row>
                <Col sm={9}>Surname: {user.surname}</Col>
                <Col sm={2}>
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