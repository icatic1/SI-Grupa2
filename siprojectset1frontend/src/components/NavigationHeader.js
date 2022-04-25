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
                <Navbar className="fluid navbar navbar-expand-lg mx-auto bg-primary" style={{ marginBottom: "10px", width:"100%" }}>
                    <div className="navbar-header">
                       <a className="navbar-brand" style={{ color: "white", fontSize: "28px", fontWeight: "bold" }}>SnapShot</a> 
                    </div>
                    <Container className="mx-auto">
                        <ul className="nav navbar-nav">
                            <li><Link to={'/Home'} className="nav-link" style={{ color: "white", fontSize: "24px" }}> Home </Link></li>
                            <li><Link to={'/EditProfile'} className="nav-link" style={{ color: "white", fontSize: "24px" }}> Edit Profile </Link></li>
                            {checkAdmin() === true ? <li><Link to={'/AddUser'} className="nav-link" style={{ color: "white", fontSize: "24px" }}> Add user </Link></li> : <></>}
                            {checkAdmin() === true ? <li><Link to={'/GetAll'} className="nav-link" style={{ color: "white", fontSize: "24px" }}>Users</Link></li> : <></>}
                            <li><Link to={'/Devices'} className="nav-link" style={{ color: "white", fontSize: "24px" }}> Devices </Link></li>
                        </ul>
                        <ul className="nav navbar-nav ml-auto">
                            <li className="nav navbar-nav"><Link to={'/'} onClick={onLogout} className="nav-link" style={{ color: "white", fontSize: "24px" }}>Logout</Link></li>
                        </ul>

                    </Container >
                </Navbar >
            }
        </>
    )
}

export default NavigationHeader