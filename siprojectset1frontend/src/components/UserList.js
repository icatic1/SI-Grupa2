import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from "react-bootstrap";

import UserCard from "./UserCard";
import Pagination from "./Pagination"


import { useLocation, useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';


const UsersList = ({ editUser }) => {
    const [users, setUsers] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)
    const [items, setItems] = useState(null)

    useEffect(() => {
        if (users != null) {
            if (users.length >= currentPage * 5) {
                setItems(users.slice((currentPage - 1) * 5, currentPage * 5))
            }
            else {
                setItems(users.slice((currentPage - 1) * 5, users.length + 1))
            }
        }

    }, [currentPage])

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
                if(data.length > 6)
                    setItems(data.filter(u => u.email != jwt(localStorage.getItem("token")).email).slice(0, 5))
                else
                    setItems(data.filter(u => u.email != jwt(localStorage.getItem("token")).email).slice(0, data.length-1))
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
            {items!=null ? <><h3 style={{ color: "#0275d8" }}>Registered users</h3>
            <hr /></> : <></>}
            <Row>
                <Col>
                    <Container className="my-2">
                        {items?.map((u) => (
                            <UserCard key={u.id} user={u} editUser={editUser} />
                        ))}
                    </Container>
                </Col>
                
            </Row>
            <Row className={"justify-content-center"} style={{marginTop:"10px"}}>
                {users != null && users.length != 0 && users.length != undefined ? <Pagination itemsCount={users.length} itemsPerPage={5} currentPage={currentPage} setCurrentPage={setCurrentPage} /> : <>{ }</>}
            </Row>
        </Container>
    );
};

export default UsersList;