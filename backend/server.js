// mini-notes-api/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Cargamos variables de entorno una sola vez al principio

const app = express();

// --- 1. CONEXIÓN A LA BASE DE DATOS ---
// Es mejor poner esto cerca del inicio para saber si la app tiene "corazón" (DB)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB local'))
    .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// --- 2. MIDDLEWARES ---

// Configuración de CORS
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
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
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`📂 Base de datos configurada en: ${process.env.MONGO_URI}`);
});