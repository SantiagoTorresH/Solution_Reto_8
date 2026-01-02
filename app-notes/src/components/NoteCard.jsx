// src/components/NoteCard.jsx
import React from 'react';

const NoteCard = ({ note, onDelete, onEdit }) => {
    // Función para asignar color según la categoría
    const getCategoryColor = (cat) => {
        switch (cat) {
            case 'Personal': return 'border-blue-500 bg-blue-50';
            case 'Trabajo': return 'border-green-500 bg-green-50';
            case 'Ideas': return 'border-yellow-500 bg-yellow-50';
            case 'Recordatorios': return 'border-red-500 bg-red-50';
            default: return 'border-gray-500 bg-gray-50';
        }
    };

    return (
        <div className={`p-4 border-l-8 rounded-lg shadow-sm ${getCategoryColor(note.categoria)}`}>
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-gray-800">{note.titulo}</h4>
                <span className="text-xs text-gray-500">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-600 mt-2 whitespace-pre-wrap">{note.contenido}</p>
            
            <div className="mt-4 flex justify-end space-x-3">
                {/* BOTÓN EDITAR */}
                <button 
                    onClick={() => onEdit(note)} 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                    Editar
                </button>
                <button 
                    onClick={() => onDelete(note._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default NoteCard;