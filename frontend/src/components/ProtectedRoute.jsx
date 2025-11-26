import React from 'react';
import { Navigate } from 'react-router-dom';

// Aceasta componenta primeste pagina pe care vrei sa intri (children)
// si rolul necesar (roleRequired)
const ProtectedRoute = ({ children, roleRequired }) => {
    const token = localStorage.getItem('auth_token');
    const userRole = localStorage.getItem('role');

    // 1. Daca nu esti logat, te trimite la Login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Daca se cere un rol anume (ex: ADMIN) si tu nu il ai, te trimite acasa
    if (roleRequired && userRole !== roleRequired) {
        return <Navigate to="/" replace />;
    }

    // 3. Daca totul e ok, te lasa sa intri
    return children;
};

export default ProtectedRoute;