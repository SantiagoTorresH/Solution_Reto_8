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

    // Estados para las notificaciones y el modal
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [modal, setModal] = useState({ show: false, noteId: null });

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
        try {
            await axiosClient.delete(`/auth/notes/${id}`);
            fetchNotes(); // Recargar la lista
            showNotification('Nota eliminada correctamente', 'success');
        } catch (error) {
            console.error("Error al eliminar:", error);
            showNotification('Error al eliminar la nota', 'error');
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

    // Función para mostrar la notificación y que se borre a los 3 segundos
    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* TOAST NOTIFICATION */}
            {toast.show && (
                <div 
                    className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 text-white rounded-lg shadow-2xl transition-all duration-500 animate-fade-in-down min-w-[300px] max-w-md ${
                        toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    role="alert"
                >
                    <div className="text-sm font-semibold flex-1">
                        <span className="mr-2">{toast.type === 'success' ? '✅' : '❌'}</span>
                        {toast.message}
                    </div>
                    <button
                        onClick={() => setToast({ show: false, message: '', type: 'success' })}
                        className="text-white hover:text-gray-200 transition-colors text-lg font-bold leading-none ml-2"
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
            )}

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
                        showNotification={showNotification}
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
                                    // onDelete={handleDelete}
                                    // En el NoteCard dentro del map:
                                    onDelete={() => setModal({ show: true, noteId: note.id })}
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
            {/* MODAL DE CONFIRMACIÓN */}
            {modal.show && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                    onClick={() => setModal({ show: false, noteId: null })}
                >
                    <div 
                        className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-slide-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <span className="text-red-600 text-xl font-bold">!</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">¿Eliminar esta nota?</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Esta acción no se puede deshacer. La nota desaparecerá para siempre.
                            </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setModal({ show: false, noteId: null })}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    handleDelete(modal.noteId);
                                    setModal({ show: false, noteId: null });
                                }}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Notes;