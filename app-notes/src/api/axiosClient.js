// src/api/axiosClient.js

import axios from 'axios';

// 1. Definir la URL base de tu backend desde variables de entorno
// En desarrollo: http://localhost:4000/api
// En producción: https://tu-backend.onrender.com/api
const API_URL = import.meta.env.VITE_API_URL;

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. Interceptor para agregar el token (Middleware de cliente)
// Esto se ejecuta ANTES de enviar la petición al servidor
axiosClient.interceptors.request.use(
    (config) => {
        // Obtener el token del almacenamiento local
        const token = localStorage.getItem('token'); 

        // Si existe un token, lo adjuntamos al encabezado 'Authorization'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor para manejar errores comunes (ej. Token expirado)
// Esto se ejecuta DESPUÉS de recibir la respuesta del servidor
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Ejemplo: Si el servidor devuelve un error 401 (No autorizado o Token expirado)
        if (error.response && error.response.status === 401) {
            // Eliminar token y nombre del usuario
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            // Redirigir al login
            window.location.href = '/login';
            console.error("Token expirado o inválido. Redirigiendo a login...");
        }
        return Promise.reject(error);
    }
);


export default axiosClient;