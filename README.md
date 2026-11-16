# Quiz API y cliente React

Proyecto académico que integra una API REST para exámenes, preguntas y opciones, construida con Django REST Framework, y una interfaz React con Vite para listar y gestionar exámenes.

## Requisitos

- Python 3.10 o posterior
- Node.js y npm

## Iniciar la API

Desde la raíz del repositorio, crea un entorno virtual, instala las dependencias y aplica las migraciones:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

La API REST Framework queda disponible en `http://127.0.0.1:8000/api/`. Desde el navegador puedes comprobar la raíz y seguir sus enlaces a los recursos.

## Iniciar el cliente React

En otra terminal, desde la raíz del repositorio:

```powershell
cd frontend
npm install
npm run dev
```

Vite muestra la dirección local al iniciar; normalmente es `http://localhost:5173/`. La configuración de Django permite solicitudes CORS desde ese origen. El cliente centraliza la dirección de la API y las operaciones para exámenes en `frontend/src/services/apiClient.js`.

La pantalla permite listar exámenes, crear uno nuevo y eliminarlo. Mientras carga, muestra un esqueleto; si la solicitud falla, ofrece un botón para reintentar.

## Recursos de la API

| Recurso | URL local | Métodos principales |
|---|---|---|
| Raíz | `http://127.0.0.1:8000/api/` | GET |
| Exámenes | `http://127.0.0.1:8000/api/exams/` | GET, POST |
| Examen individual | `http://127.0.0.1:8000/api/exams/{id}/` | GET, PUT, PATCH, DELETE |
| Preguntas | `http://127.0.0.1:8000/api/questions/` | GET, POST |
| Pregunta individual | `http://127.0.0.1:8000/api/questions/{id}/` | GET, PUT, PATCH, DELETE |
| Opciones | `http://127.0.0.1:8000/api/options/` | GET, POST |
| Opción individual | `http://127.0.0.1:8000/api/options/{id}/` | GET, PUT, PATCH, DELETE |

Las listas usan paginación por número de página, con 10 registros por página. El recurso de preguntas admite `?exam=<id>` para filtrar por examen, `?search=<texto>` para buscar en el enunciado y `?page=<número>` para cambiar de página.

## Ejemplos de solicitudes

Crear un examen:

```json
{
  "title": "Examen de prueba",
  "description": "Semana 8"
}
```

Crear una pregunta con sus opciones (debe haber exactamente una opción correcta):

```json
{
  "exam": 1,
  "text": "¿Cuánto es 2 + 2?",
  "options": [
    { "text": "4", "is_correct": true },
    { "text": "5", "is_correct": false }
  ]
}
```

Las preguntas incluyen sus opciones como una lista anidada. El campo `exam` contiene el identificador del examen asociado. Las opciones también pueden administrarse por separado en `/api/options/`, enviando el identificador de su pregunta en `question`.

## Configuración de desarrollo

- CORS permite `http://localhost:5173` mediante `django-cors-headers`.
- La API permite solicitudes sin autenticación (`AllowAny`) para el laboratorio.
- La base de datos de desarrollo es SQLite (`db.sqlite3`).
