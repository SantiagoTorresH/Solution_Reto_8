// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 border-t border-gray-200 py-6 mt-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Sección de Logo o Nombre */}
                    <div className="mb-4 md:mb-0">
                        <span className="text-xl font-bold text-indigo-600">MiniNotes</span>
                        <p className="text-sm text-gray-500 mt-1">
                            Organiza tus ideas, mejora tu productividad.
                        </p>
                    </div>

                    {/* Enlaces o Info de Copyright */}
                    <div className="text-center md:text-right">
                        <p className="text-sm text-gray-600">
                            © {new Date().getFullYear()} Creado para dar solocion al reto del modulo 8. .
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                            Hecho con React + Tailwind + Node.js
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;