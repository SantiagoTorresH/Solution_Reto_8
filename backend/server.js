// mini-notes-api/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Cargar variables de entorno

const app = express();


// Middlewares

// 1. Configuración de CORS: Permite la comunicación con el frontend
app.use(cors({
    origin: [
        'http://localhost:5173', // puerto por defecto de Vite
        'http://localhost:5174'  // si Vite eligió otro puerto (ej. 5174)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// 2. Procesar cuerpos de petición como JSON (usando express.json)
app.use(express.json());

// 3. Log simple para depurar bodies
app.use((req, res, next) => {
    console.log('[req]', req.method, req.path, 'body=', req.body);
    next();
});

// 4. Usar las rutas de autenticación con el prefijo /api/auth (después de middlewares)
app.use('/api/auth', require('./routes/auth')); 

// 3. Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Notas está funcionando');
});

    // 4. Nueva ruta de salud
    app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', message: 'API is running' });
    });

    // Manejador de errores para responder con JSON en lugar de stack traces HTML
    app.use((err, req, res, next) => {
        console.error('ERROR HANDLER:', err && err.stack ? err.stack : err);
        res.status(500).json({ error: err && err.message ? err.message : 'Internal Server Error' });
    });

// 4. Iniciar el servidor
// Usamos el puerto 4000 o el que definamos en las variables de entorno
const PORT = process.env.PORT || 4000; 

app.listen(PORT, () => {
    console.log(`🚀 Servidor API escuchando en http://localhost:${PORT}`);
});