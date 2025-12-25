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
        userId: req.user.id, // ID del usuario que viene del token
        titulo,
        contenido,
        categoria,
        fechaCreacion: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

module.exports = router;