import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode';
import Login from './components/Login'
import NavigationHeader from './components/NavigationHeader'
import Home from './components/Home'
import AddUser from './components/AddUser'
import FileList from './components/FileList'
import UserList from './components/UserList'
import UpdateUser from './components/UpdateUser'
import ChangePassword from "./components/ChangePassword";
import ChangePasswordM from "./components/ChangePasswordM";
import ChangePasswordQ from "./components/ChangePasswordQ";
import ChangePass from "./components/ChangePass";
import TFA from "./components/TFA";
import NotFound from "./components/NotFound";
import EditProfile from "./components/EditProfile";
import DeviceList from "./components/DeviceList";
import Configuration from "./components/Configuration";
import Live from "./components/Live";

import './App.css';


export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        
        if (localStorage.getItem('token') != null) {

            setToken(localStorage.getItem('token'))

        }
    }, [])

    useEffect(() => {

        if (token) {
            if (jwt(token).exp * 1000 < Date.now()) {
                setToken(null)
                localStorage.removeItem('token')
                navigate('/')
            }

        }
    }, [location])

    const handleLogin = async (data) => {
        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");


        const response1 = await fetch('/api/user/login?' + formBody, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });

        if(!response1.ok) return null
        const resp = await response1;
        const resp2 = await response1.body;
        const resp3 = await resp2.getReader().read();
        var result = String.fromCharCode.apply(null, resp3.value);
        
        return result;

    }

    const ftasendcode = async (data) => {

        var formBody = [];
        for (var property in data) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(data[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");


        const response1 = await fetch('/api/user/tfasendcode?' + formBody, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        });

        const resp = await response1;
        const resp2 = await response1.body;
        const resp3 = await resp2.getReader().read();
        var result = String.fromCharCode.apply(null, resp3.value);
        if (result == "true") {
            localStorage.setItem('token', data.token);
            setToken(localStorage.getItem('token'))
        }
        return result;

    }

    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem('token');
    }

    const value = {
        token: token,
        onLogin: handleLogin,
        onLogout: handleLogout,
        ftasendcode: ftasendcode
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}

const ProtectedRoute = ({ children }) => {
    const { token } = useContext(AuthContext)

    if (token === null) {
        return <Navigate to="/" replace />

    }

    return (children)
}

const ProtectedAdminRoute = ({ children }) => {
    const { token } = useContext(AuthContext)

    if (token === null || token === undefined) {
        return <Navigate to="/" replace />

    }



    if (jwt(token).Roles != "Administrator") {

        return <Navigate to="/Home" />
    }


    return (children)
}

const HomeWrapper = ({ children }) => {
    const { token } = useContext(AuthContext)

    if (token === null) {
        return <Login />

    }

    return <Home />
}
function App() {
    return (
        <div className="app">
        <Router>
            <AuthProvider>
            <NavigationHeader />
                <Routes>
                    <Route exact path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route exact path="/EditProfile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                    <Route exact path='/' element={<HomeWrapper />} />
                    <Route exact path='/AddUser' element={<ProtectedAdminRoute><AddUser /></ProtectedAdminRoute>} />
                    <Route exact path='/GetAll' element={<ProtectedAdminRoute><UserList /></ProtectedAdminRoute>} />
                    <Route exact path='/UpdateUser' element={<ProtectedAdminRoute><UpdateUser /></ProtectedAdminRoute>} />
                    <Route exact path='/ChangePassword' element={<ChangePassword />} />
                    <Route exact path='/ChangePasswordM' element={<ChangePasswordM />} />
                    <Route exact path='/ChangePasswordQ' element={<ChangePasswordQ />} />
                    <Route exact path='/ChangePass/:passtoken' element={<ChangePass />} />
                    <Route exact path='/TFA' element={<TFA />} />
                    <Route exact path='/Devices' element={<ProtectedRoute><DeviceList /></ProtectedRoute>} />
                    <Route exact path='/Configuration/:mac' element={<ProtectedRoute><Configuration /></ProtectedRoute>} />
                    <Route exact path='/FileList/:mac' element={<ProtectedRoute><FileList /></ProtectedRoute>} />
                    <Route exact path='/Live/:id/:mac/:num' element={<ProtectedRoute><Live /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </AuthProvider>
            </Router>
            </div>)
}

export default App