// src/pages/Notes.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import FilterBar from '../components/FilterBar';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState('Todas'); // Estado para el filtro
    const [editingNote, setEditingNote] = useState(null); // Estado para la nota en edición
    const navigate = useNavigate();

    // 1. Función para obtener las notas (Definida fuera para reutilizarla)
    const fetchNotes = async () => {
        try {
            // La ruta completa es /api/auth/notes (axiosClient ya tiene /api como baseURL)
            const response = await axiosClient.get('/auth/notes');
            setNotes(response.data);
        } catch (error) {
            console.error("Error al obtener notas:", error?.message || error);
        }
    };

    // 2. Cargar notas al iniciar
    useEffect(() => {
        fetchNotes();
    }, []);

    // 3. Función para eliminar nota
    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar esta nota?")) {
            try {
                await axiosClient.delete(`/auth/notes/${id}`);
                fetchNotes(); // Recargar la lista
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("No se pudo eliminar la nota");
            }
        }
    };

    // 4. Función de Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // 5. Lógica de Filtrado
    const filteredNotes = filter === 'Todas' 
        ? notes 
        : notes.filter(n => n.categoria === filter);

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-indigo-700">Mis Notas Personales</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                    Cerrar Sesión
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna Izquierda: Formulario */}
                <div className="md:col-span-1">
                    <NoteForm 
                        onNoteCreated={fetchNotes} 
                        editingNote={editingNote} // Pasamos la nota que se está editando
                        clearEditing={() => setEditingNote(null)} // Función para limpiar la edición
                    />
                </div>

                {/* Columna Derecha: Lista y Filtros */}
                <div className="md:col-span-2">
                    {/* Componente FilterBar */}
                    <FilterBar 
                        filter={filter} 
                        onFilterChange={setFilter} 
                    />

                    {filteredNotes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredNotes.map(note => (
                                <NoteCard 
                                    key={note.id} 
                                    note={note} 
                                    onDelete={handleDelete}
                                    onEdit={(n) => setEditingNote(n)} // Al hacer clic en editar, guardamos la nota aquí
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-500">No hay notas en esta categoría.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notes;