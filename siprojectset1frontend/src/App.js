import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode';
import Login from './components/Login'
import NavigationHeader from './components/NavigationHeader'
import Home from './components/Home'
import AddUser from './components/AddUser'
import UserList from './components/UserList'
import UpdateUser from './components/UpdateUser'
import ChangePassword from "./components/ChangePassword";
import ChangePasswordM from "./components/ChangePasswordM";
import ChangePasswordQ from "./components/ChangePasswordQ";


import './App.css';


export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        
        if (localStorage.getItem('token') != undefined) {

            setToken(localStorage.getItem('token'))

        }
    }, [])

    useEffect(() => {

        if (token) {

            if (token.exp * 1000 < Date.now()) {
                setToken(null)
                localStorage.clear('token')
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


        await fetch('/user/login?' + formBody, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        }).then(response => {
            if (response.status != 200) {
                return false
            }
            return response.body
        }).
            then(body => { if (body) { return body.getReader().read() }; return false }).
            then(d => {
                if (!d) {
                    return false
                }
                var result = String.fromCharCode.apply(null, d.value);

                localStorage.setItem('token', result);
                setToken(localStorage.getItem('token'))

                return true
            }).catch((err) => {
                return false
            })

    }

    const handleLogout = () => {
        setToken(null)
        localStorage.removeItem('token');
    }

    const value = {
        token: token,
        onLogin: handleLogin,
        onLogout: handleLogout,
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
        <Router>
            <AuthProvider>
            <NavigationHeader />
                <Routes>
                    <Route exact path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route exact path='/' element={<HomeWrapper />} />
                    <Route exact path='/AddUser' element={<ProtectedAdminRoute><AddUser /></ProtectedAdminRoute>} />
                        <Route exact path='/GetAll' element={<ProtectedAdminRoute><UserList /></ProtectedAdminRoute>} />
                            <Route exact path='/UpdateUser' element={<ProtectedAdminRoute><UpdateUser /></ProtectedAdminRoute>} />
                    <Route exact path='/ChangePassword' element={<ChangePassword />} />
                    <Route exact path='/ChangePasswordM' element={<ChangePasswordM />} />
                    <Route exact path='/ChangePasswordQ' element={<ChangePasswordQ />} />
                </Routes>
            </AuthProvider>
        </Router>)
}

export default App