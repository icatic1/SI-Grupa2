import { Container, Navbar, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import jwt from 'jwt-decode';

import { AuthContext } from "../App"

function NavigationHeader() {

    const { onLogout, token } = useContext(AuthContext)

    function checkAdmin() {
        if (token === null || token === undefined) {
            return false
        }


        if (jwt(token).Roles != "Administrator") {
            return false
        }

        return true
    }

    return (
        <>
            {token === null ? <></> :
                <Navbar className="fluid navbar navbar-expand-lg navbar-light bg-light mx-auto">
                    <Container className="mx-auto">
                        <ListGroup className="navbar-nav mr-auto">
                            <ListGroup.Item><Link to={'/Home'} className="nav-link"> Home </Link></ListGroup.Item>
                            {checkAdmin() === true ? <ListGroup.Item><Link to={'/AddUser'} className="nav-link"> Add user </Link></ListGroup.Item> : <></>}
                            {checkAdmin() === true ? <ListGroup.Item><Link to={'/GetAll'} className="nav-link">Users</Link></ListGroup.Item> : <></>}
                            <ListGroup.Item><Link to={'/'} onClick={onLogout} className="nav-link">Logout</Link></ListGroup.Item>
                        </ListGroup>

                    </Container >
                </Navbar >
            }
        </>
    )
}

export default NavigationHeader