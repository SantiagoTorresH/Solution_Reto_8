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
    const [validations, setValidations] = useState({
        emailValid: false,
        passwordValid: false,
    });
    const navigate = useNavigate();

    // Validar formato de email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validar fortaleza de contraseña
    // Requisitos: mínimo 8 caracteres, mayúscula, minúscula, número
    const validatePassword = (password) => {
        if (password.length < 8) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        return true;
    };

    // Obtener mensaje de requisitos de contraseña
    const getPasswordRequirements = (password) => {
        const requirements = [];
        if (password.length < 8) requirements.push("Mínimo 8 caracteres");
        if (!/[A-Z]/.test(password)) requirements.push("Al menos una mayúscula");
        if (!/[a-z]/.test(password)) requirements.push("Al menos una minúscula");
        if (!/[0-9]/.test(password)) requirements.push("Al menos un número");
        return requirements;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Validar en tiempo real
        if (name === "email") {
            setValidations({
                ...validations,
                emailValid: validateEmail(value),
            });
        }
        if (name === "password") {
            setValidations({
                ...validations,
                passwordValid: validatePassword(value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validar antes de enviar
        if (!validateEmail(formData.email)) {
            setError("Email inválido. Por favor ingresa un email válido.");
            return;
        }

        if (!validatePassword(formData.password)) {
            setError(
                "Contraseña no cumple requisitos: " +
                getPasswordRequirements(formData.password).join(", ")
            );
            return;
        }

        if (!formData.name.trim()) {
            setError("El nombre es requerido.");
            return;
        }

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
        <div className="flex justify-center items-center min-h-screen  p-4">
            <div className="w-full max-w-md  p-8 rounded-2xl bg-[#1e2952] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
                <h2 className="text-3xl font-bold text-center text-orange-600 mb-6">
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Campo de Nombre */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                            placeholder="Tu nombre completo"
                            required
                        />
                    </div>

                    {/* Campo de Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ${
                                formData.email && !validations.emailValid
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                    : formData.email && validations.emailValid
                                    ? "border-green-400 focus:border-green-500 focus:ring-green-200"
                                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                            }`}
                            placeholder="tu@email.com"
                            required
                        />
                        {formData.email && !validations.emailValid && (
                            <p className="mt-2 text-xs font-medium text-red-600 flex items-center gap-1">
                                ✗ Email inválido
                            </p>
                        )}
                        {formData.email && validations.emailValid && (
                            <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                                ✓ Email válido
                            </p>
                        )}
                    </div>

                    {/* Campo de Contraseña */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-800 mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border-2 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition duration-200 ${
                                formData.password && !validations.passwordValid
                                    ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                                    : formData.password && validations.passwordValid
                                    ? "border-green-400 focus:border-green-500 focus:ring-green-200"
                                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"
                            }`}
                            placeholder="Contraseña segura"
                            required
                        />
                        {formData.password && !validations.passwordValid && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-xs font-semibold text-red-700 mb-2">
                                    📋 Requisitos faltantes:
                                </p>
                                <ul className="space-y-1">
                                    {getPasswordRequirements(formData.password).map(
                                        (req, idx) => (
                                            <li key={idx} className="text-xs text-red-600 flex items-center gap-2">
                                                <span>•</span> {req}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                        {formData.password && validations.passwordValid && (
                            <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                                ✓ Contraseña válida
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!validations.emailValid || !validations.passwordValid || !formData.name.trim()}
                        className={`w-full py-2 px-4 rounded-lg font-bold text-white transition duration-200 shadow-md ${
                            !validations.emailValid || !validations.passwordValid || !formData.name.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-orange-600 hover:bg-orange-700 active:scale-95"
                        }`}
                    >
                        Registrarse
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-50">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-orange-600 hover:text-indigo-500"
                    >
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
