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

Cada pregunta incluye sus `options` como una lista anidada de solo lectura. El examen asociado se representa mediante el campo `exam`, que transporta el identificador de un examen y permite asignarlo al crear o actualizar la pregunta. Las opciones se crean y editan mediante el recurso `/api/options/`, indicando `question` como identificador. Esta separación mantiene las relaciones explícitas y permite gestionar cada opción de forma independiente.

La validación del serializador de pregunta exige exactamente una opción correcta entre las opciones asociadas antes de guardar la pregunta. Para crear una pregunta con opciones, primero se crea la pregunta y luego se crean sus opciones; al completar o modificar las opciones, se conserva la regla de una sola respuesta correcta.

La paginación global es por número de página, con 10 registros por página. El permiso inicial es `AllowAny`, apropiado para desarrollo del curso; puede endurecerse al añadir autenticación.
