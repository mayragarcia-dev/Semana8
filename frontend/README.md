# Cliente React del catálogo

Interfaz de React 19 y Vite para consultar el catálogo Django. Las instrucciones para iniciar ambos servidores están en el [README principal](../README.md).

## Desarrollo

```powershell
npm install
npm run dev
```

La API debe estar activa en `http://127.0.0.1:8000/`; Vite muestra la dirección local del frontend, normalmente `http://localhost:5173/`.

## Servicios

- `src/services/apiClient.js`: instancia de Axios; la URL base se configura aquí.
- `src/services/productService.js`: listar, consultar, crear, modificar y eliminar productos. Envía archivos de imagen como `FormData`.
- `src/services/categoryService.js`: listar, consultar, crear, modificar y eliminar categorías.

Los componentes consumen estos servicios y no importan Axios. El listado del catálogo muestra el objeto `category` anidado que devuelve la API.
