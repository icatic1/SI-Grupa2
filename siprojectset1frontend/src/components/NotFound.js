import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <div style={{ margin: "15px"}}>
        <h1 style={{size: "80px" }}>404 - Not Found!</h1>
        <h2 style={{ margin: "15px", size: "64px" }}>Sorry, this page doesn't exist...</h2>
        <Link to="/" style={{ margin: "15px", size:"48px" }}>Go Home</Link>
    </div>
);

export default NotFound;