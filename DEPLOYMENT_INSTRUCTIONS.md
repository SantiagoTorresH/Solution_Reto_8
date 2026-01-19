# Instrucciones de Despliegue - Solución de Errores

## ⚠️ PROBLEMAS CRÍTICOS RESUELTOS

### Problema 1: 404 al recargar la página en Vercel ✅
**Solución:** Se creó `vercel.json` para configurar el routing de SPA (Single Page Application).

### Problema 2: Las notas desaparecen al reiniciar el servidor ✅
**Causa:** El backend estaba usando un array en memoria que se reseteaba cada vez que Render reiniciaba el servidor.

**Solución:** Se actualizó `backend/routes/notes.js` para usar MongoDB en lugar del array en memoria. Ahora las notas se guardan permanentemente en la base de datos.

## Errores Corregidos Anteriormente

### 1. ✅ Error 404 en `/api/notes`
**Problema:** La variable de entorno `VITE_API_URL` no estaba configurada en Vercel.

**Solución aplicada:**
- Se agregó un fallback en `axiosClient.js` que usa `https://solution-reto-8.onrender.com/api` por defecto
- Se mejoró el manejo de errores en el interceptor de axios

### 2. ✅ Rutas DELETE y PUT faltantes
**Problema:** El backend no tenía rutas para actualizar y eliminar notas.

**Solución aplicada:**
- Se agregaron las rutas `PUT /api/notes/:id` y `DELETE /api/notes/:id` en `backend/routes/notes.js`

### 3. ✅ Configuración de CORS
**Problema:** CORS podría bloquear requests desde Vercel.

**Solución aplicada:**
- Se actualizó la configuración de CORS para aceptar automáticamente cualquier URL de Vercel (`*.vercel.app`)
- Se mejoró la flexibilidad para desarrollo y producción

## Configuración Requerida en Vercel

Para que la aplicación funcione correctamente, necesitas configurar la variable de entorno en Vercel:

### Pasos:

1. **Ve a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Agrega la siguiente variable:**
   - **Nombre:** `VITE_API_URL`
   - **Valor:** `https://solution-reto-8.onrender.com/api`
   - **Environment:** Production, Preview, Development (marca todas)

4. **Redeploy tu aplicación** después de agregar la variable

### Alternativa (si prefieres usar otra URL):

Si tu backend está en otra URL, simplemente cambia el valor de `VITE_API_URL` a tu URL de backend seguida de `/api`.

Ejemplo:
- Backend: `https://mi-backend.onrender.com`
- Variable: `https://mi-backend.onrender.com/api`

## Configuración en Render (Backend)

Asegúrate de que en Render tengas configuradas estas variables de entorno:

- `MONGO_URI` - Tu conexión a MongoDB
- `JWT_SECRET` - Tu clave secreta para JWT
- `PORT` - Puerto (Render lo asigna automáticamente, pero puedes especificarlo)
- `FRONTEND_URL` - URL de tu frontend en Vercel (opcional, pero recomendado)

## Errores de Extensiones del Navegador

Los errores relacionados con `chrome-extension://` y `runtime.lastError` son causados por extensiones del navegador (como Grammarly, LastPass, etc.) y **NO afectan tu aplicación**. Puedes ignorarlos.

## Pasos para Desplegar las Correcciones

### 1. Frontend (Vercel)
1. **Commit y push** de los cambios (incluyendo `vercel.json`)
2. Vercel detectará los cambios automáticamente y hará redeploy
3. **Verificar** que `vercel.json` esté en la raíz de `app-notes/`

### 2. Backend (Render)
1. **Commit y push** de los cambios en `backend/routes/notes.js`
2. Render debería detectar los cambios y hacer redeploy automáticamente
3. **Verificar** que las variables de entorno estén configuradas:
   - `MONGO_URI` - Tu conexión a MongoDB
   - `JWT_SECRET` - Tu clave secreta
   - `PORT` - (Render lo asigna automáticamente)

## Verificación

Después de hacer redeploy en ambos servicios:

1. ✅ El error 404 al recargar debería desaparecer
2. ✅ Las notas deberían persistir después de reiniciar el servidor
3. ✅ Deberías poder crear, editar y eliminar notas
4. ✅ Las notas no desaparecerán al cerrar sesión y volver a iniciar

## Notas Adicionales

- El backend ahora acepta requests desde cualquier dominio `*.vercel.app` automáticamente
- Si necesitas restringir CORS a dominios específicos, edita `backend/server.js`
- El frontend tiene un fallback, pero es mejor configurar `VITE_API_URL` en Vercel para mayor control

