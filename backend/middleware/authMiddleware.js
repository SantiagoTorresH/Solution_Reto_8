// mini-notes-api/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "clave_por_defecto";

const verifyToken = (req, res, next) => {
    // 1. Obtener el token del encabezado 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separar "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No hay token." });
    }

    try {
        // 2. Verificar el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Guardar los datos del usuario dentro de la petición (req.user)
        // para que las rutas de notas sepan de quién es la nota
        req.user = decoded; 
        
        next(); // Continuar a la siguiente función (la ruta)
    } catch (error) {
        res.status(401).json({ message: "Token no válido o expirado." });
    }
};

module.exports = verifyToken;