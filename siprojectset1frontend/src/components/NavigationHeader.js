import { Container, Navbar, DropdownButton,Dropdown } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import jwt from 'jwt-decode';

import { AuthContext } from "../App"

function NavigationHeader() {

    const { onLogout, token } = useContext(AuthContext)
    const navigate = useNavigate()
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
                <Navbar sticky="top" className="fluid navbar navbar-expand-lg mx-auto bg-primary" style={{ marginBottom: "10px", width:"100%", lineHeight:"center" }}>
                    <div className="navbar-header">
                       <a className="navbar-brand" style={{ color: "white", fontSize: "28px", fontWeight: "bold", marginRight:"20px" }}>SnapShot</a> 
                    </div>
                    <Container className="mx-auto">
                        <ul className="nav navbar-nav">
                            <li><Link to={'/Home'} className="nav-link" style={{ color: "white", fontSize: "20px" }}> Home </Link></li>
                            <li><DropdownButton size="lg" title="Profile">
                                <Dropdown.Item onClick={() => navigate('/EditProfile')} style={{ color: "black", textAlign:"left", padding: "2px 10px 2px 10px" }} className="nav-link" > Edit Profile </Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/Devices')} style={{ color: "black", textAlign: "left", padding: "2px 10px 2px 10px" }} className="nav-link" > My devices </Dropdown.Item>
                            </DropdownButton>
                                </li>
                            {checkAdmin() === true ? <li><DropdownButton size="lg" title="Manage users">
                                <Dropdown.Item onClick={() => navigate('/AddUser')} className="nav-link" style={{ color: "black", textAlign: "left", padding: "2px 10px 2px 10px" }}> Add user</Dropdown.Item>
                                <Dropdown.Item onClick={() => navigate('/GetAll')} className="nav-link" style={{ color: "black", textAlign: "left", padding: "2px 10px 2px 10px" }}>All users</Dropdown.Item>
                            </DropdownButton></li> : <></>}
                            
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