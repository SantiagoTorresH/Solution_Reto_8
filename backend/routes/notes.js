// mini-notes-api/routes/notes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Base de datos temporal para notas
let notes = []; 

// 1. OBTENER TODAS LAS NOTAS (del usuario logueado)
router.get('/', verifyToken, (req, res) => {
    // Filtramos las notas para que solo devuelva las que pertenecen al usuario (req.user.id)
    const userNotes = notes.filter(n => n.userId === req.user.id);
    res.json(userNotes);
});

// 2. CREAR UNA NUEVA NOTA
router.post('/', verifyToken, (req, res) => {
    const { titulo, contenido, categoria } = req.body;

    if (!titulo || !contenido || !categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const newNote = {
        id: Date.now(), // ID único basado en tiempo
        _id: Date.now().toString(), // También agregamos _id para compatibilidad
        userId: req.user.id, // ID del usuario que viene del token
        titulo,
        contenido,
        categoria,
        fechaCreacion: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

// 3. ACTUALIZAR UNA NOTA
router.put('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, categoria } = req.body;

    // Buscar la nota por id o _id
    const noteIndex = notes.findIndex(n => (n.id == id || n._id == id) && n.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).json({ message: "Nota no encontrada" });
    }

    if (!titulo || !contenido || !categoria) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Actualizar la nota
    notes[noteIndex] = {
        ...notes[noteIndex],
        titulo,
        contenido,
        categoria
    };

    res.json(notes[noteIndex]);
});

// 4. ELIMINAR UNA NOTA
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    // Buscar la nota por id o _id
    const noteIndex = notes.findIndex(n => (n.id == id || n._id == id) && n.userId === req.user.id);

    if (noteIndex === -1) {
        return res.status(404).json({ message: "Nota no encontrada" });
    }

    // Eliminar la nota
    notes.splice(noteIndex, 1);

    res.json({ message: "Nota eliminada correctamente" });
});

module.exports = router;