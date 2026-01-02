# Backend — APP-NOTES

API en Node.js y Express que gestiona usuarios y notas usando MongoDB (Mongoose).

## Requisitos
- Node.js >= 16
- npm
- MongoDB local o Atlas

## Instalación

```bash
cd backend
npm install
```

## Variables de entorno
Crear un archivo `.env` en la carpeta `backend` con al menos estas variables:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/appnotes
JWT_SECRET=tu_clave_secreta
```

## Ejecutar

```bash
# Modo desarrollo (recomendado si hay script dev)
npm run dev

# o
npm start
```

## Endpoints principales

- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/login` — Iniciar sesión y obtener JWT
- `GET /api/notes` — Obtener notas (protegido)
- `POST /api/notes` — Crear nota (protegido)
- `PUT /api/notes/:id` — Actualizar nota (protegido)
- `DELETE /api/notes/:id` — Eliminar nota (protegido)

Rutas protegidas requieren el header: `Authorization: Bearer <token>`.

## Estructura relevante
- `models/` — modelos Mongoose (`User.js`, `Note.js`)
- `routes/` — rutas (`auth.js`, `notes.js`)
- `middleware/` — middleware de autenticación

## Notas y sugerencias
- Añadir validaciones más estrictas y tests.
- Considera configurar `nodemon` para desarrollo (si no está presente).

## Autor
Proyecto del reto.
