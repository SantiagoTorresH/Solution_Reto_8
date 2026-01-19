// backend/models/Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    contenido: { type: String, required: true },
    categoria: { type: String, default: 'Personal' },
    // Importante: Guardamos el ID del usuario que creó la nota
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true }); // Esto añade fecha de creación automáticamente

module.exports = mongoose.model('Note', NoteSchema, 'notas'); // usamos la collection notas 