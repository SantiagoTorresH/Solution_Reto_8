

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient'; // Importamos el cliente

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState(null); // Estado para manejar errores [cite: 37]
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {
      // 1. Envío de datos al endpoint de login del backend
      const response = await axiosClient.post('/auth/login', formData); 
      
      // 2. Guardar token y nombre del usuario en localStorage
      localStorage.setItem('token', response.data.token);
      if (response.data.user && response.data.user.name) {
        localStorage.setItem('userName', response.data.user.name);
      }

      // 3. Redirigir al usuario a la ruta protegida /notes
      navigate('/notes'); 

    } catch (err) {
      // 4. Manejo de errores (ej. credenciales incorrectas) [cite: 37]
      setError(err.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen  p-4">
      <div className="w-full max-w-md  p-8 rounded-2xl bg-[#1e2952] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">Iniciar Sesión</h2>
        
        {/* Muestra el error si existe */}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-rose-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/20 focus:border-orange-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-rose-700">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500/20 focus:border-orange-500"
              required
            />
            
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Entrar
          </button>
        </form>
        
        <p className="mt-6 text-center text-lg text-0range-800">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-rose-500">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;