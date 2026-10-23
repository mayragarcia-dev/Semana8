# Quiz API

Proyecto Django mínimo para gestionar exámenes, preguntas y opciones con Django REST Framework.

## Instalación y ejecución

```bash
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

La API queda disponible bajo `/api/` (`/api/exams/`, `/api/questions/` y `/api/options/`).

## Representación de relaciones

Cada pregunta incluye sus `options` como una lista anidada que se puede leer y escribir: al crear o actualizar una pregunta se envían sus opciones en el mismo cuerpo. El examen asociado se representa mediante el campo `exam`, que transporta el identificador de un examen. Las opciones también pueden gestionarse de forma independiente mediante `/api/options/`, indicando `question` como identificador.

La validación del serializador de pregunta exige exactamente una opción correcta entre las opciones enviadas. Al reemplazar las opciones de una pregunta, la regla se vuelve a comprobar.

La paginación global es por número de página, con 10 registros por página. El permiso inicial es `AllowAny`, apropiado para desarrollo del curso; puede endurecerse al añadir autenticación.

## Filtrado y búsqueda

El recurso de preguntas admite `?exam=<id>` para filtrar por examen y `?search=<texto>` para buscar en el enunciado. Ambos parámetros se pueden combinar; la paginación se controla con `?page=<número>`.

## Tabla de la API

| Recurso | Dirección | Método | Cuerpo de ejemplo | Respuesta esperada |
|---|---|---|---|---|
| Exámenes | `/api/exams/` | GET | — | 200, lista paginada |
| Exámenes | `/api/exams/` | POST | `{"title": "Examen de prueba", "description": "Semana 8"}` | 201, examen creado |
| Examen | `/api/exams/{id}/` | GET | — | 200, examen |
| Examen | `/api/exams/{id}/` | PUT | `{"title": "Examen", "description": "Actualizado"}` | 200, examen actualizado |
| Examen | `/api/exams/{id}/` | PATCH | `{"description": "Actualizado"}` | 200, examen actualizado |
| Examen | `/api/exams/{id}/` | DELETE | — | 204, sin contenido |
| Preguntas | `/api/questions/` | GET | — | 200, lista paginada; admite `?exam=` y `?search=` |
| Preguntas | `/api/questions/` | POST | `{"exam": 1, "text": "¿Cuánto es 2+2?", "options": [{"text": "4", "is_correct": true}, {"text": "5", "is_correct": false}]}` | 201, pregunta con opciones |
| Pregunta | `/api/questions/{id}/` | GET | — | 200, pregunta con opciones |
| Pregunta | `/api/questions/{id}/` | PUT | Cuerpo completo con `exam`, `text` y `options` | 200, pregunta actualizada |
| Pregunta | `/api/questions/{id}/` | PATCH | `{"text": "Nuevo enunciado"}` o `{"options": [...]}` | 200, pregunta actualizada |
| Pregunta | `/api/questions/{id}/` | DELETE | — | 204, sin contenido |
| Opciones | `/api/options/` | GET | — | 200, lista paginada |
| Opciones | `/api/options/` | POST | `{"question": 1, "text": "Ninguna", "is_correct": false}` | 201, opción creada |
| Opción | `/api/options/{id}/` | GET | — | 200, opción |
| Opción | `/api/options/{id}/` | PUT | `{"question": 1, "text": "Ninguna", "is_correct": false}` | 200, opción actualizada |
| Opción | `/api/options/{id}/` | PATCH | `{"text": "Ninguna de las anteriores"}` | 200, opción actualizada |
| Opción | `/api/options/{id}/` | DELETE | — | 204, sin contenido |
| Errores | `/api/exams/` | POST | `{"description": "Sin título"}` | 400, `{"title": ["Este campo es requerido."]}` |
| Errores | `/api/exams/` | POST | `{"title": ["No es texto"]}` | 400, `{"title": ["No es una cadena válida."]}` |
| Errores | `/api/questions/` | POST | Pregunta con dos opciones correctas | 400, `{"options": ["La pregunta debe tener exactamente una opción correcta."]}` |
