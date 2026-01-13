const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IMPORTAR LOS MODELOS
const User = require('../models/User');
const Note = require('../models/Note');

const JWT_SECRET = process.env.JWT_SECRET || "clave_por_defecto";

// Usar middleware centralizado para verificar JWT
const verifyToken = require('../middleware/authMiddleware');

// 1. REGISTRO (MongoDB)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Buscar en la DB si ya existe
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "El usuario ya existe" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Guardar en MongoDB
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (e) { res.status(500).json({ message: "Error en el servidor" }); }
});

// 2. LOGIN (MongoDB)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        // El token ahora usa el _id de MongoDB
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) { res.status(500).json({ message: "Error en el servidor" }); }
});

// 3. OBTENER NOTAS (MongoDB)
router.get('/notes', verifyToken, async (req, res) => {
    try {
        // Buscamos todas las notas donde el campo 'usuario' coincida con el ID del token
        const userNotes = await Note.find({ usuario: req.user.id });
        res.json(userNotes);
    } catch (e) { res.status(500).json({ message: "Error al obtener notas" }); }
});

// 4. CREAR NOTA (MongoDB)
router.post('/notes', verifyToken, async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body;
        const newNote = new Note({
            usuario: req.user.id, // Relacionamos la nota con el usuario
            titulo,
            contenido,
            categoria
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (e) { res.status(500).json({ message: "Error al crear nota" }); }
});

// 5. EDITAR NOTA (MongoDB)
router.put('/notes/:id', verifyToken, async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body;
        
        // Buscamos la nota por ID
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        // Seguridad: ¿Es el dueño? (convertimos a String para comparar)
        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Actualizamos
        note.titulo = titulo || note.titulo;
        note.contenido = contenido || note.contenido;
        note.categoria = categoria || note.categoria;
        
        await note.save();
        res.json(note);
    } catch (e) { res.status(500).json({ message: "Error al editar" }); }
});

// 6. ELIMINAR NOTA (MongoDB)
router.delete('/notes/:id', verifyToken, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Nota eliminada con éxito" });
    } catch (e) { res.status(500).json({ message: "Error al eliminar" }); }
});

module.exports = router;