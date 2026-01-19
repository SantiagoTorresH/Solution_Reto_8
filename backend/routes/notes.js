// mini-notes-api/routes/notes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const Note = require('../models/Note');

// 1. OBTENER TODAS LAS NOTAS (del usuario logueado) - MongoDB
router.get('/', verifyToken, async (req, res) => {
    try {
        // Buscamos todas las notas donde el campo 'usuario' coincida con el ID del token
        const userNotes = await Note.find({ usuario: req.user.id });
        res.json(userNotes);
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ message: "Error al obtener notas" });
    }
});

// 2. CREAR UNA NUEVA NOTA - MongoDB
router.post('/', verifyToken, async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body;

        if (!titulo || !contenido || !categoria) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const newNote = new Note({
            usuario: req.user.id, // Relacionamos la nota con el usuario
            titulo,
            contenido,
            categoria
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(500).json({ message: "Error al crear nota" });
    }
});

// 3. ACTUALIZAR UNA NOTA - MongoDB
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido, categoria } = req.body;

        // Buscar la nota por ID
        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        // Seguridad: Verificar que la nota pertenece al usuario
        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        if (!titulo || !contenido || !categoria) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Actualizar la nota
        note.titulo = titulo;
        note.contenido = contenido;
        note.categoria = categoria;
        
        await note.save();
        res.json(note);
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(500).json({ message: "Error al actualizar nota" });
    }
});

// 4. ELIMINAR UNA NOTA - MongoDB
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la nota por ID
        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        // Seguridad: Verificar que la nota pertenece al usuario
        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Eliminar la nota
        await Note.findByIdAndDelete(id);
        res.json({ message: "Nota eliminada correctamente" });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({ message: "Error al eliminar nota" });
    }
});

module.exports = router;