import React from "react";
import { Link } from 'react-router-dom';
import { Container } from "react-bootstrap"
import '../ChangePassword.css';

function ChangePassword() {
    return (
        <Container className="mx-auto customContainerBig">
            <h4 style={{ color: "white", backgroundColor:"#0275d8", padding:"10px", borderRadius:"10px" }}>Choose one of the following methods to reset your password:</h4>
            <div style={{paddingBottom:"30px"}}>
                <Link to={'/ChangePasswordQ'} className="nav-link" style={{fontSize:"20px"}}> Change password with security question</Link>
                <Link to={'/ChangePasswordM'} className="nav-link" style={{ fontSize: "20px" }}> Change password with email</Link>
            </div>
            <Link to={'/'} className="nav-link" style={{ color:"#4a4a4a"}}>Go back to Login page</Link>
            
         </Container>
    )
};

export default ChangePassword;
