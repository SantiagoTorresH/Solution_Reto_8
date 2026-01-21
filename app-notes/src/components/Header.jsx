// src/components/Header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({onSearch}) => { // recibimos la de busqueda
    const navigate = useNavigate();

    //Estado para controlar el modal de salida
    const [showModal, setShowModal] = useState(false);

    
    // Obtener el nombre del usuario desde localStorage
    const userName = localStorage.getItem('userName') || 'Usuario';
    const initial = userName.charAt(0).toUpperCase();

    const handleLogout = () => {
        // Cerrar el modal primero
        setShowModal(false);
        // Limpiar token y nombre del usuario
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        navigate('/login');
    };

    return (
        <>
        <header className="bg-white shadow-md border-b border-gray-100 mb-8">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                
                {/* Logo / Título */}
                <div className="flex items-center space-x-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                        Mini<span className="text-indigo-600">Notes</span>
                    </h1>
                </div>

                {/* BUSCADOR */}
                <div className="relative w-full max-w-md rounded-full shadow-md shadow-indigo-500/20 transition-shadow focus-within:shadow-lg focus-within:shadow-indigo-500/30">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar en mis notas..."
                            onChange={(e) => onSearch && onSearch(e.target.value)} // Enviamos el texto al padre si existe la función
                             className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-pink-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                        />
                    </div>

                {/* Zona de Usuario y Logout */}
                <div className="flex items-center space-x-6">
                    {/* Info Usuario */}
                    <div className="flex items-center space-x-3 border-r pr-6 border-gray-200">
                        <div className="flex flex-col text-right hidden sm:block">
                            <span className="text-xs text-gray-500 font-medium">Bienvenido,</span>
                            <span className="text-sm font-bold text-gray-800">{userName}</span>
                        </div>
                        {/* Avatar con inicial */}
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-500">
                            <span className="text-indigo-700 font-bold">{initial}</span>
                        </div>
                    </div>

                    {/* Botón Cerrar Sesión */}
                    <button 
                            onClick={() => setShowModal(true)} 
                            className="group flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors duration-200 bg-orange-500 rounded-md px-2 py-1 hover:bg-blue-950 transition"
                        >
                            <span className="text-sm font-medium ">Salir</span>
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                    </button>
                </div>
            </div>
        </header>

        {/* MODAL DE CONFIRMACIÓN PARA SALIR */}
        {showModal && (
            <div 
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                onClick={() => setShowModal(false)}
            >
                <div 
                    className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-slide-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">¿Cerrar sesión?</h3>
                        <p className="text-sm text-gray-500 mt-2">
                            Tendrás que ingresar tus credenciales nuevamente para acceder a tus notas.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                            Sí, salir
                        </button>
                    </div>
                </div>
            </div>
        )}

    </>
    );
};

export default Header;