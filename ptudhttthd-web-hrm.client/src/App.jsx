import React, { useState, useEffect } from "react";
import "./styles/App.css";
import { ToastContainer } from 'react-toastify';
import SignUpLogin from './components/SignUpLogin.jsx';
import HomePage from './components/HomePage.jsx';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { EditProvider, RequestProvider } from './components/EditContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        setIsAuthenticated(!!token);
        setLoading(false);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <EditProvider>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/signuplogin" />}
                    />
                    <Route path="/signuplogin" element={<SignUpLogin />} />
                    <Route
                        path="/home"
                        element={isAuthenticated ? <RequestProvider> <HomePage /> </RequestProvider> : <Navigate to="/signuplogin" />}
                    />
                </Routes>
            </Router>
        </EditProvider>
    );
}

export default App;
