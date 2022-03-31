import React, { useEffect, useState } from 'react';
import { Container, Segment, Form, Button,Row,Col} from "react-bootstrap";

import UserCard from "./UserCard";


import { useLocation, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';


const UsersList = ({ editUser }) => {
    const [users, setUsers] = useState();

    useEffect(() => {
        const fetchMain = async () => {
            try {
                let token = 'Bearer ' + localStorage.getItem('token')
                const headers = { 'content-type': 'application/json', 'Authorization': token }

                const response1 = await fetch("/api/user/getallusers",
                    {
                        method: 'GET',
                        headers: headers
                    });
                console.log(response1);
                const data = await response1.json();
                setUsers(data);
            } catch (e) {
                console.log(e)
            }
        };

        fetchMain();
    }, []);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [surname, setSurname] = useState();
    const [deletedStatus, setDeletedStatus] = useState(false);

    const navigate = useNavigate();
    const { state } = useLocation()


    return (

        <Row>
            <Col>
                <Container className="my-2">
                    {users?.map((u) => (
                        <UserCard key={u.id} user={u} editUser={editUser} />
                    ))}
                </Container>
            </Col>
        </Row>
    );
};

export default UsersList;