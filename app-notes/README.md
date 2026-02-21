# Frontend — APP-NOTES (app-notes)

Interfaz de usuario construida con React (Vite) y Tailwind CSS para gestionar notas.

## Requisitos
- Node.js >= 16
- npm

## Instalación

```bash
cd app-notes
npm install
```

## Variables de entorno (opcional)
Si quieres apuntar a un backend distinto, crea un archivo `.env` en `app-notes` con:

```
VITE_API_URL=http://localhost:4000/api
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Construir para producción

```bash
npm run build
```

## Notas
- La aplicación consume la API en `/api` por defecto; asegúrate de que el backend esté corriendo.
- Ajusta `VITE_API_URL` si tu backend corre en otro host/puerto.

## Autor
Santiago Torres 



