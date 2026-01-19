// mini-notes-api/routes/notes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const verifyToken = require('../middleware/authMiddleware');
const Note = require('../models/Note');

// 1. OBTENER TODAS LAS NOTAS (del usuario logueado) - MongoDB
router.get('/', verifyToken, async (req, res) => {
    try {
        // Mongoose maneja automáticamente la conversión de string a ObjectId
        const userNotes = await Note.find({ usuario: req.user.id });
        res.json(userNotes);
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ 
            message: "Error al obtener notas",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 2. CREAR UNA NUEVA NOTA - MongoDB
router.post('/', verifyToken, async (req, res) => {
    try {
        // Verificar conexión a MongoDB
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB no está conectado. Estado:', mongoose.connection.readyState);
            return res.status(503).json({ 
                message: "Servicio no disponible. Base de datos no conectada." 
            });
        }

        const { titulo, contenido, categoria } = req.body;

        // Validar campos requeridos
        if (!titulo || !contenido || !categoria) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Validar que el ID del usuario sea válido
        if (!req.user || !req.user.id) {
            console.error('Usuario no autenticado. req.user:', req.user);
            return res.status(401).json({ message: "Usuario no autenticado correctamente" });
        }

        // Validar que el ID del usuario sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            console.error('ID de usuario inválido:', req.user.id, 'Tipo:', typeof req.user.id);
            return res.status(400).json({ message: "ID de usuario inválido" });
        }

        const newNote = new Note({
            usuario: req.user.id, // Mongoose convierte automáticamente el string a ObjectId
            titulo: titulo.trim(),
            contenido: contenido.trim(),
            categoria: categoria.trim()
        });

        // Validar el documento antes de guardar
        const validationError = newNote.validateSync();
        if (validationError) {
            console.error('Error de validación:', validationError);
            return res.status(400).json({ 
                message: "Error de validación",
                errors: Object.keys(validationError.errors || {}).map(key => ({
                    field: key,
                    message: validationError.errors[key].message
                }))
            });
        }

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        // Log detallado del error para debugging
        console.error('Error al crear nota:');
        console.error('- Mensaje:', error.message);
        console.error('- Stack:', error.stack);
        console.error('- Usuario ID:', req.user?.id);
        console.error('- Datos recibidos:', { titulo, contenido, categoria });
        
        // Proporcionar más información del error
        const errorMessage = error.message || "Error al crear nota";
        
        res.status(500).json({ 
            message: "Error al crear nota",
            error: errorMessage,
            // En producción, solo mostrar el tipo de error, no los detalles completos
            ...(process.env.NODE_ENV === 'development' && { 
                stack: error.stack,
                userId: req.user?.id 
            })
        });
    }
});

// 3. ACTUALIZAR UNA NOTA - MongoDB
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido, categoria } = req.body;

        // Validar que el ID de la nota sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de nota inválido" });
        }

        // Buscar la nota por ID
        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        // Seguridad: Verificar que la nota pertenece al usuario
        const userId = req.user.id.toString();
        if (note.usuario.toString() !== userId) {
            return res.status(403).json({ message: "No autorizado" });
        }

        if (!titulo || !contenido || !categoria) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Actualizar la nota
        note.titulo = titulo.trim();
        note.contenido = contenido.trim();
        note.categoria = categoria.trim();
        
        await note.save();
        res.json(note);
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(500).json({ 
            message: "Error al actualizar nota",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 4. ELIMINAR UNA NOTA - MongoDB
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID de la nota sea válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "ID de nota inválido" });
        }

        // Buscar la nota por ID
        const note = await Note.findById(id);
        
        if (!note) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        // Seguridad: Verificar que la nota pertenece al usuario
        const userId = req.user.id.toString();
        if (note.usuario.toString() !== userId) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Eliminar la nota
        await Note.findByIdAndDelete(id);
        res.json({ message: "Nota eliminada correctamente" });
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({ 
            message: "Error al eliminar nota",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;