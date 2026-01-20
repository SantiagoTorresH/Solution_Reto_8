// mini-notes-api/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Cargamos variables de entorno una sola vez al principio


const app = express();

// --- 1. CONEXIÓN A LA BASE DE DATOS ---
// Es mejor poner esto cerca del inicio para saber si la app tiene "corazón" (DB)
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ Conectado a MongoDB en la nube');
        
        // Limpiar índice problemático de la colección 'notas'
        // Este índice se creó cuando User usaba la colección 'notas'
        try {
            const db = mongoose.connection.db;
            const notasCollection = db.collection('notas');
            
            // Obtener todos los índices
            const indexes = await notasCollection.indexes();
            const emailIndex = indexes.find(idx => idx.name === 'email_1');
            
            if (emailIndex) {
                console.log('🔧 Eliminando índice problemático email_1 de la colección notas...');
                await notasCollection.dropIndex('email_1');
                console.log('✅ Índice email_1 eliminado correctamente');
            }
        } catch (indexError) {
            // Si el índice no existe o ya fue eliminado, no es un problema
            // MongoDB puede devolver diferentes códigos de error para índice no encontrado
            const isIndexNotFound = indexError.code === 27 || 
                                   indexError.code === 85 || 
                                   indexError.message?.includes('index not found') ||
                                   indexError.message?.includes('not found');
            
            if (!isIndexNotFound) {
                console.warn('⚠️ Advertencia al limpiar índices:', indexError.message);
            } else {
                console.log('ℹ️ El índice email_1 no existe (ya fue eliminado o nunca existió)');
            }
        }
    })
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// --- 2. MIDDLEWARES --- 

// Configuración de CORS
const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:5174',
    process.env.FRONTEND_URL, // URL del frontend en producción
    // Permitir cualquier URL de Vercel (patrón común)
    /^https:\/\/.*\.vercel\.app$/,
    // Permitir cualquier URL de Render (por si acaso)
    /^https:\/\/.*\.onrender\.com$/
].filter(Boolean); // Eliminar valores undefined/null

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman o aplicaciones móviles)
        if (!origin) return callback(null, true);
        
        // Verificar si el origin está en la lista permitida
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            // En desarrollo, permitir todos los origins para facilitar debugging
            if (process.env.NODE_ENV !== 'production') {
                callback(null, true);
            } else {
                callback(new Error('No permitido por CORS'));
            }
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Procesar cuerpos JSON
app.use(express.json());

// Log de peticiones (Muy útil para desarrollo)
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// --- 3. RUTAS ---

// Prefijo /api/auth para todas las rutas dentro de auth.js
app.use('/api/auth', require('./routes/auth')); 

// Prefijo /api/notes para todas las rutas dentro de notes.js
app.use('/api/notes', require('./routes/notes'));

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('API de Notas está funcionando');
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// --- 4. MANEJO DE ERRORES ---
// 
app.use((err, req, res, next) => {
    console.error('ERROR:', err.stack || err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// --- 5. INICIAR EL SERVIDOR ---
const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
    // console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    // console.log(`📂 Base de datos configurada en: ${process.env.MONGO_URI}`);
});


