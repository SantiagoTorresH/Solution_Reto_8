// src/pages/Register.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Register = () => {
    // Definimos el estado inicial de los datos del formulario
    const [formData, setFormData] = useState({
        name: "", // Campo adicional
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData, // Mantén los otros campos (email, password)
            [e.target.name]: e.target.value, // Actualiza el campo actual (name, email o password)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // 1. Envío de datos al endpoint de registro
            // Nota: Aquí se asume que tu backend usará la ruta /auth/register
            const response = await axiosClient.post("/auth/register", formData);

            console.log("Registro exitoso:", response.data);

            // 2. Redirigir al usuario a la página de Login
            // Esto es importante: después de registrarse, debe iniciar sesión.
            navigate("/login");
        } catch (err) {
            // 3. Manejo de errores
            // [cite_start]; // Esto cubre validaciones sencillas (ej: email ya existe, contraseña muy corta) [cite: 22]
            setError(
                err.response?.data?.message ||
                "Error al registrar usuario. Verifica los datos."
            );
        }
    };

    // Dentro de Register.jsx...

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-700 p-4">
            <div className="w-full max-w-md bg-lime-500 p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                    Crear Cuenta
                </h2>

                {error && (
                    <div
                        className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de Nombre */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name" // ¡Importante! Debe coincidir con el estado
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Campo de Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email" // ¡Importante!
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password" // ¡Importante!
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Registrarse
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
