# Cliente web de exámenes

Interfaz de React 19 y Vite que consume la API de exámenes del proyecto Django. La guía de inicio completa y las rutas disponibles están en el [README principal](../README.md).

## Desarrollo local

Desde esta carpeta instala las dependencias e inicia Vite:

```powershell
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173/`). La API Django debe estar ejecutándose en `http://127.0.0.1:8000/`.

## Estructura relevante

- `src/services/apiClient.js`: configuración central de Axios y operaciones para listar, crear y eliminar exámenes.
- `src/App.jsx`: formulario y listado; gestiona carga, errores y reintento.
- `src/styles/exams.css`: estilos de la pantalla, la tabla, el esqueleto y los errores.

Para generar una compilación de producción ejecuta `npm run build`.
