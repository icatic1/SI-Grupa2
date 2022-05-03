import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from "react-bootstrap";

import UserCard from "./UserCard";


import { useLocation, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';


const UsersList = ({ editUser }) => {
    const [users, setUsers] = useState();

    useEffect(() => {
        const fetchMain = async () => {
            try {

                
                let token = 'Bearer ' + localStorage.getItem('token')
                //const response = await addUser();
                const headers = { "Authorization": token }

                const response1 = await fetch("api/user/getallusers",
                    {
                        method: 'GET',
                        headers: headers
                    });

                const data = await response1.json();
                setUsers(data.filter(u => u.email != jwt(localStorage.getItem("token")).email));
                hideSpinner();
              
            } catch (e) {
                console.log(e)
               
            }
        };

        fetchMain();
    }, []);


    function hideSpinner() {
        document.getElementById('spinner').style.display = 'none';
    }

    return (
        <Container>
            <Container fluid className="d-flex justify-content-center">
                <Spinner id="spinner" animation="border" variant="primary" />
            </Container>
            <Row>
                <Col>
                    <Container className="my-2">
                        {users?.map((u) => (
                            <UserCard key={u.id} user={u} editUser={editUser} />
                        ))}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default UsersList;