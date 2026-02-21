// Librerías principales para manejar rutas, contraseñas y tokens de autenticación
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para crear tokens de autenticación

// IMPORTAR LOS MODELOS de la base de datos MongoDB
const User = require('../models/User'); // Modelo de usuario
const Note = require('../models/Note'); // Modelo de notas

// Clave secreta para firmar y verificar tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || "clave_por_defecto";

// Importar middleware que verifica si el token JWT es válido
const verifyToken = require('../middleware/authMiddleware');

// ============== FUNCIONES DE VALIDACIÓN ==============
// Valida que el email tenga el formato correcto
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Valida que la contraseña sea segura:
// - Mínimo 8 caracteres
// - Al menos una mayúscula
// - Al menos una minúscula
// - Al menos un número
const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
};

// ============== RUTA 1: REGISTRO DE USUARIO ==============
// POST /register - Crea un nuevo usuario con email y contraseña
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body; // Obtener datos del formulario, del fronted, req.body

        // Validar que todos los campos requeridos estén presentes
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Email inválido" });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                message: "Contraseña debe tener: mínimo 8 caracteres, mayúscula, minúscula y número",
            });
        }

        // Convertir email a minúsculas para case-insensitiveness
        const lowerEmail = email.toLowerCase();

        // Verificar si el email ya está registrado en la base de datos
        const userExists = await User.findOne({ email: lowerEmail });
        if (userExists) return res.status(400).json({ message: "El email ya está registrado" });

        // Encriptar la contraseña antes de guardarla (por seguridad)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario y guardarlo en MongoDB
        const newUser = new User({ name: name.trim(), email: lowerEmail, password: hashedPassword });
        await newUser.save(); // Guardar en la base de datos

        res.status(201).json({ message: "Usuario registrado con éxito" }); // backend responde al frontend
    } catch (e) {
        console.error("Error en registro:", e);
        if (e.code === 11000) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }
        res.status(500).json({ message: "Error en el servidor" });
    }
});

// ============== RUTA 2: LOGIN DE USUARIO ==============
// POST /login - Valida credenciales y genera un token JWT
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // Obtener email y contraseña
        const lowerEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowerEmail }); // Buscar usuario en la BD
        
        // Validar que el usuario existe y la contraseña es correcta
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Credenciales incorrectas" });
        }

        // Crear token JWT válido por 1 hora con el ID y email del usuario
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        // Enviar token y datos del usuario al frontend
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (e) { res.status(500).json({ message: "Error en el servidor" }); }
});

// ============== RUTA 3: OBTENER TODAS LAS NOTAS DEL USUARIO ==============
// GET /notes - Obtiene las notas del usuario autenticado (requiere token JWT)
router.get('/notes', verifyToken, async (req, res) => {
    try {
        // Buscar todas las notas que pertenecen al usuario autenticado
        const userNotes = await Note.find({ usuario: req.user.id });
        res.json(userNotes); // Enviar notas al frontend
    } catch (e) { res.status(500).json({ message: "Error al obtener notas" }); }
});

// ============== RUTA 4: CREAR UNA NUEVA NOTA ==============
// POST /notes - Crea una nueva nota para el usuario autenticado (requiere token JWT)
router.post('/notes', verifyToken, async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body; // Obtener datos de la nota
        // Crear nueva nota asociada al usuario autenticado
        const newNote = new Note({
            usuario: req.user.id, // Asociar la nota al usuario actual
            titulo,
            contenido,
            categoria
        });
        await newNote.save(); // Guardar en la base de datos
        res.status(201).json(newNote); // Enviar la nota creada
    } catch (e) { res.status(500).json({ message: "Error al crear nota" }); }
});

// ============== RUTA 5: EDITAR UNA NOTA EXISTENTE ==============
// PUT /notes/:id - Actualiza una nota (solo el dueño puede hacerlo)
router.put('/notes/:id', verifyToken, async (req, res) => {
    try {
        const { titulo, contenido, categoria } = req.body; // Nuevos datos de la nota
        
        // Buscar la nota por su ID
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        // Verificar que el usuario autenticado es el dueño de la nota
        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Actualizar solo los campos que fueron enviados
        note.titulo = titulo || note.titulo;
        note.contenido = contenido || note.contenido;
        note.categoria = categoria || note.categoria;
        
        await note.save(); // Guardar cambios en la BD
        res.json(note); // Enviar nota actualizada
    } catch (e) { res.status(500).json({ message: "Error al editar" }); }
});

// ============== RUTA 6: ELIMINAR UNA NOTA ==============
// DELETE /notes/:id - Elimina una nota (solo el dueño puede hacerlo)
router.delete('/notes/:id', verifyToken, async (req, res) => {
    try {
        // Buscar la nota a eliminar
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Nota no encontrada" });

        // Verificar que el usuario autenticado es el dueño
        if (note.usuario.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado" });
        }

        // Eliminar la nota de la BD
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Nota eliminada con éxito" });
    } catch (e) { res.status(500).json({ message: "Error al eliminar" }); }
});

module.exports = router;