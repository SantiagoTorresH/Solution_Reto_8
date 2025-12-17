// componente que revise si existe un token de autenticación en el localStorage. Si no existe, redirige al usuario a la página de login.

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // 1. Obtener el token del almacenamiento local
    const token = localStorage.getItem('token');

    // 2. Si no hay token, redirigir al usuario a la página de login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. si hay token , renderizar el componente children
    return children;
};

export default ProtectedRoute;

