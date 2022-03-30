import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './components/Login'
import NavigationHeader from './components/NavigationHeader'
import Home from './components/Home'

import './App.css';
function App() {
    return (
        <Router>
            <NavigationHeader />
            <Routes>
                <Route exact path="/Home" element={<Home />} />
                <Route exact path='/' element={<Login />} />
            </Routes>
        </Router>)
}

export default App