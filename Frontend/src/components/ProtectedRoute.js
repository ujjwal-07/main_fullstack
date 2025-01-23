import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check for the token in localStorage
    const token = localStorage.getItem('authToken');

    // If no token, redirect to the login page
    if (!token) {
        return <Navigate to="/login" />;
    }

    // If token exists, render the protected route
    return children;
};

export default ProtectedRoute;
