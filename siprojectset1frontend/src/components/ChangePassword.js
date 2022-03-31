import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Routes, useNavigate } from 'react-router-dom';
import '../ChangePassword.css';

function ChangePassword() {
    return (
        <div>
            <div id="everything">
                <Link to={'/ChangePasswordQ'} className="nav-link"> Change password with security question</Link>
                <Link to={'/ChangePasswordM'} className="nav-link"> Change password with email</Link>
            </div>
        </div>    
    )
};

export default ChangePassword;