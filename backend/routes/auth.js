const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simulación de base de datos en memoria
const users = []; 
const notes = [];
let noteIdCounter = 1;
const JWT_SECRET = "mi_clave_secreta_super_segura"; // En producción va en .env

// Middleware: Verificar Token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

// 1. RUTA DE REGISTRO 
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Validar si el usuario ya existe
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar usuario
    const newUser = { id: users.length + 1, name, email, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: "Usuario registrado con éxito" });
});

// 2. RUTA DE LOGIN [cite: 36]
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Buscar usuario
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: "Credenciales incorrectas" }); // [cite: 37]
    }

    // Comparar contraseña encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Credenciales incorrectas" }); // [cite: 37]
    }

    // Crear el TOKEN JWT [cite: 8]
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// ===== RUTAS DE NOTAS =====

// 1. OBTENER TODAS LAS NOTAS DEL USUARIO LOGUEADO
router.get('/notes', verifyToken, (req, res) => {
    const userNotes = notes.filter(n => n.userId === req.user.id);
    res.json(userNotes);
});

// 2. CREAR UNA NUEVA NOTA
router.post('/notes', verifyToken, (req, res) => {
    const { titulo, contenido, categoria } = req.body;

    if (!titulo || !contenido) {
        return res.status(400).json({ message: "Título y contenido son obligatorios" });
    }

    const newNote = {
        id: noteIdCounter++,
        userId: req.user.id,
        titulo,
        contenido,
        categoria: categoria || 'Personal',
        fechaCreacion: new Date().toISOString(),
        fechaEdicion: new Date().toISOString()
    };

    notes.push(newNote);
    res.status(201).json(newNote);
});

// 3. EDITAR UNA NOTA EXISTENTE
router.put('/notes/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const { titulo, contenido, categoria } = req.body;

    // Buscamos el índice de la nota en el arreglo
    const index = notes.findIndex(n => n.id === parseInt(id));

    // Si no existe la nota
    if (index === -1) {
        return res.status(404).json({ message: "Nota no encontrada" });
    }

    // SEGURIDAD: Verificar que la nota pertenezca al usuario logueado
    if (notes[index].userId !== req.user.id) {
        return res.status(403).json({ message: "No tienes permiso para editar esta nota" });
    }

    // Actualizamos los datos
    notes[index] = {
        ...notes[index],
        titulo: titulo || notes[index].titulo,
        contenido: contenido || notes[index].contenido,
        categoria: categoria || notes[index].categoria,
        fechaEdicion: new Date().toISOString()
    };

    res.json(notes[index]);
});

// 4. ELIMINAR UNA NOTA
router.delete('/notes/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    // Buscamos la nota para verificar la propiedad antes de borrar
    const noteIndex = notes.findIndex(n => n.id === parseInt(id));

    if (noteIndex === -1) {
        return res.status(404).json({ message: "Nota no encontrada" });
    }

    // SEGURIDAD: Verificar que la nota pertenezca al usuario logueado
    if (notes[noteIndex].userId !== req.user.id) {
        return res.status(403).json({ message: "No tienes permiso para eliminar esta nota" });
    }

    // Eliminamos la nota del arreglo
    notes.splice(noteIndex, 1);

    res.json({ message: "Nota eliminada con éxito" });
});

module.exports = router;