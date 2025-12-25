// src/components/NoteForm.jsx
import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

const NoteForm = ({ onNoteCreated }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        contenido: '',
        categoria: 'Personal' // Valor por defecto
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Enviamos la nota al backend (Ruta que creamos en el Paso 12)
            await axiosClient.post('/auth/notes', formData);
            
            // Limpiar el formulario tras el éxito
            setFormData({ titulo: '', contenido: '', categoria: 'Personal' });
            
            // Avisar al componente padre que refresque la lista de notas
            if (onNoteCreated) onNoteCreated(); 
            
            alert("¡Nota creada con éxito!");
        } catch (error) {
            console.error("Error al crear la nota:", error?.message || error);
            alert("Hubo un error al guardar la nota.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Nueva Nota</h3>
            
            <div className="space-y-4">
                {/* Título */}
                <input
                    type="text"
                    name="titulo"
                    placeholder="Título de la nota"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                />

                {/* Contenido */}
                <textarea
                    name="contenido"
                    placeholder="Escribe el contenido aquí..."
                    value={formData.contenido}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded h-24 focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                ></textarea>

                {/* Categoría (Select) */}
                <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-600">Categoría:</label>
                    <select
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                        <option value="Personal">🏠 Personal</option>
                        <option value="Trabajo">💼 Trabajo</option>
                        <option value="Ideas">💡 Ideas</option>
                        <option value="Recordatorios">⏰ Recordatorios</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white font-bold transition-colors ${
                        loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {loading ? 'Guardando...' : 'Añadir Nota'}
                </button>
            </div>
        </form>
    );
};

export default NoteForm;