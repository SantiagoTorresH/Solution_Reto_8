**APP-NOTES — Sistema de gestión de notas**

Aplicación Full Stack para crear, editar y organizar notas con autenticación de usuarios. Proyecto desarrollado como ejercicio práctico usando Node.js/Express en el backend y React + Vite en el frontend.

**Características**
- **Autenticación:** Registro e inicio de sesión con JWT.
- **CRUD de notas:** Crear, leer, actualizar y eliminar notas.
- **Búsqueda y filtrado:** Filtrado por título y contenido.
- **Interfaz responsiva:** Diseño con Tailwind CSS.

**Tecnologías**
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router.
- **Backend:** Node.js, Express, Mongoose (MongoDB), bcrypt, JWT.

**Requisitos previos**
- Node.js (>=16) y npm
- MongoDB (local o Atlas)

**Instalación y ejecución (local)**

1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd Solution_Reto_8
```

2. Backend

```bash
cd backend
npm install
# Crear .env con las variables indicadas abajo
npm run dev   # o `npm start` según el script
```

Variables de entorno recomendadas (.env):

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/appnotes
JWT_SECRET=tu_clave_secreta
```

3. Frontend

```bash
cd app-notes
npm install
npm run dev
```

El frontend por defecto servirá en el puerto de Vite (por ejemplo `5173`) y el backend en el puerto indicado en `.env`.

**Rutas / API (resumen)**
- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/login` — Autenticar y obtener JWT
- `GET /api/notes` — Obtener notas (protegido)
- `POST /api/notes` — Crear nota (protegido)
- `PUT /api/notes/:id` — Actualizar nota (protegido)
- `DELETE /api/notes/:id` — Eliminar nota (protegido)

Las rutas protegidas requieren el header `Authorization: Bearer <token>`.

**Estructura del proyecto (relevante)**
- `app-notes/` — Código del frontend (React + Vite)
- `backend/` — API en Node/Express y modelos Mongoose

**Próximos pasos sugeridos**
- Añadir `README` específicos en `backend/` y `app-notes` con scripts y variables.
- Opcional: configurar `docker-compose` para fácil despliegue local.

**Autor**
Proyecto implementado por el autor del reto.

--
