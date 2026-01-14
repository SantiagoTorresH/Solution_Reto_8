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



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
