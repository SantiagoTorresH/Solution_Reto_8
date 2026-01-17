// src/components/NoteForm.jsx
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const NoteForm = ({ onNoteCreated, editingNote, clearEditing, showNotification }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        contenido: '',
        categoria: 'Personal' 
    });
    const [loading, setLoading] = useState(false);

    // ESCUCHADOR DE EDICIÓN: 
    // Cuando el usuario haga clic en "Editar" en una tarjeta, 
    // este efecto rellenará el formulario automáticamente.
    useEffect(() => {
        if (editingNote) {
            setFormData({
                titulo: editingNote.titulo,
                contenido: editingNote.contenido,
                categoria: editingNote.categoria
            });
        }
    }, [editingNote]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingNote) {
                // MODO EDICIÓN: Usamos PUT y el ID de la nota
                await axiosClient.put(`/notes/${editingNote._id}`, formData);
                if (showNotification) showNotification("¡Nota actualizada con éxito!", "success");
            } else {
                // MODO CREACIÓN: Usamos POST
                await axiosClient.post('/notes', formData);
                if (showNotification) showNotification("¡Nota creada con éxito!", "success");
            }
            
            // Limpiar el estado y avisar al padre para refrescar la lista
            handleCancel(); 
            if (onNoteCreated) onNoteCreated(); 
            
        } catch (error) {
            console.error("Error al procesar la nota:", error?.message || error);
            if (showNotification) {
                showNotification("Error al guardar la nota. Inténtalo de nuevo.", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    // Función para limpiar el formulario y salir del modo edición
    const handleCancel = () => {
        setFormData({ titulo: '', contenido: '', categoria: 'Personal' });
        if (clearEditing) clearEditing();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
            {/* Título dinámico según la acción */}
            <h3 className="text-xl font-bold mb-4 text-zinc-700">
                {editingNote ? '✏️ Editando Nota' : '🆕 Nueva Nota'}
            </h3>
            
            <div className="space-y-4">
                <input
                    type="text"
                    name="titulo"
                    placeholder="Título de la nota"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                />

                <textarea
                    name="contenido"
                    placeholder="Escribe el contenido aquí..."
                    value={formData.contenido}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded h-24 focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                ></textarea>

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

                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-2 px-4 rounded text-white font-bold transition-colors ${
                            loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        {loading ? 'Guardando...' : editingNote ? 'Guardar Cambios' : 'Añadir Nota'}
                    </button>

                    {/* Mostrar botón Cancelar solo si estamos editando */}
                    {editingNote && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-300"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default NoteForm;

