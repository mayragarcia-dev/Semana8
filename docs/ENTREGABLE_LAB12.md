# Entregable — Laboratorio 12: servicios web
Alumno: ____________________  
Equipo y responsabilidades: ____________________  
Fecha: ____________________

## Desarrollo (tareas 7 a 12)
El cliente React consume la API de Django con Axios. El listado solicita los exámenes al montar la página. El borrado espera el DELETE y vuelve a consultar la lista. La página de alta usa entradas controladas, preventDefault y POST; al terminar navega al listado sin recargar el navegador.

El formulario usa noValidate para permitir que el título vacío llegue a Django y así demostrar la validación del servidor. La API sigue validando el campo obligatorio. El mensaje de la respuesta se presenta en un panel de alerta. Las operaciones deshabilitan sus botones durante la solicitud. Axios tiene un límite de espera de diez segundos.

## Inicio
Abrir dos terminales en C:\Des.Apli.Emp.4to\Semana8.

Terminal Django:
~~~powershell
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py runserver 127.0.0.1:8000
~~~

Terminal React:
~~~powershell
cd frontend
npm install
npm run dev
~~~

Cliente: http://localhost:5180/#/exams  
Alta: http://localhost:5180/#/exams/new  
API: http://127.0.0.1:8000/api/exams/

Se usa 5180 porque 5173 estaba ocupado por otra aplicación. Vite mantiene el puerto fijo y Django autoriza únicamente http://localhost:5180. No utilizar 127.0.0.1:5180 como dirección del cliente porque sería otro origen.

## Tabla de la pantalla
| Pantalla / acción | Petición | Carga | Datos / éxito | Error |
|---|---|---|---|---|
| Entrar al listado, Actualizar o Reintentar | GET /api/exams/ | Esqueleto de tres filas | Tabla ID, nombre, descripción y eliminar; mensaje si está vacía | Panel “No se pudieron cargar los exámenes. Comprueba que la API esté disponible.” y botón Reintentar |
| Crear examen | POST /api/exams/ con title y description | Botón Guardando… deshabilitado | Navega a #/exams y consulta el listado | Muestra el mensaje devuelto por Django y conserva el formulario |
| Eliminar examen | DELETE /api/exams/{id}/, después GET /api/exams/ | Botón Eliminando… y luego esqueleto | Fila eliminada del listado | Panel de error; Reintentar vuelve a consultar los datos |

En desarrollo StrictMode puede generar dos GET iniciales. No son dos altas ni dos borrados.

## Capturas que debes tomar
Guarda tus imágenes en docs/evidencias/ con los nombres sugeridos. Inserta las imágenes en tu entregable final junto con tu nombre, código y explicación.

1. **01-alta-formulario.png**: en http://localhost:5180/#/exams/new escribe un nombre y una descripción. Captura los campos antes de enviar.
2. **02-alta-listado.png**: pulsa Crear examen. Captura el listado con la nueva fila; opcionalmente abre F12 > Network para mostrar POST 201 y GET 200.
3. **03-borrado.png**: elimina SOLO el registro de prueba creado por ti. Captura la tabla después y Network con DELETE 204 y GET 200. Usa también la captura anterior para demostrar el antes/después.
4. **04-cors-error.png**: con Django ejecutándose, abre config/settings.py y cambia temporalmente CORS_ALLOWED_ORIGINS a []. Guarda y espera la recarga de Django. En el listado abre F12 > Console y pulsa Actualizar. Captura la consola con el error CORS y el panel de error en pantalla. El navegador suele mencionar que falta Access-Control-Allow-Origin; copia en tu explicación el texto exacto que veas. NO uses modo No CORS ni extensiones para eludirlo.
5. **05-cors-restaurado.png**: restaura CORS_ALLOWED_ORIGINS = ["http://localhost:5180"], guarda y pulsa Reintentar. Captura el listado recuperado y la configuración restaurada.
6. **06-validacion.png**: abre el alta, deja Nombre del examen vacío y pulsa Crear examen. Captura el mensaje “title: Este campo no puede estar en blanco.”. En F12 > Network selecciona POST exams/ y Response para mostrar HTTP 400 y el JSON real.
7. **07-servidor-apagado.png**: mantén React abierto y detén SOLO Django con Ctrl+C en su terminal. En el listado pulsa Actualizar. Captura el panel de error y Reintentar; opcionalmente incluye Network con conexión rechazada. Es necesario solicitar datos después de detener Django: una tabla ya cargada no detecta por sí sola el apagado.
8. Reinicia Django y pulsa Reintentar para restaurar la aplicación.
9. **08-carga.png**: en F12 > Network activa Slow 3G y pulsa Actualizar. Captura el esqueleto mientras espera. Después vuelve a No throttling.
10. **09-estructura-codigo.png**: en VS Code abre la raíz del repositorio y muestra frontend/src/App.jsx, frontend/src/services/apiClient.js, config/settings.py y quiz/. Captura el árbol del proyecto y los fragmentos relevantes.

## Ubicación del código
- frontend/src/App.jsx: navegación por hash, useEffect, tres estados, handleCreate y handleDelete.
- frontend/src/services/apiClient.js: base URL única y operaciones Axios.
- frontend/vite.config.js: origen del cliente en el puerto 5180.
- config/settings.py: aplicaciones, middleware y CORS_ALLOWED_ORIGINS.
- quiz/models.py y quiz/serializers.py: título obligatorio y validación del servidor.
- docs/ENTREGABLE_LAB12.md: este documento y tabla para el entregable.

## Verificación realizada
- npm run build y npm run lint: correctos.
- Django check y migraciones: correctos.
- Navegador: listado vacío, POST válido con retorno al listado, DELETE con actualización, POST vacío con mensaje real de Django.
- CORS: se retiró temporalmente el origen y apareció el panel de error; Django respondió GET 200, pero el navegador no entregó los datos al cliente. Se restauró el origen y se recuperó la lista.
- El visor de consola de la herramienta no expuso el diagnóstico nativo de CORS. Falta que captures y transcribas ese mensaje exacto en F12 de tu navegador; no se presenta aquí un mensaje inventado como observado.
- Django detenido: al recargar el listado apareció el panel de error y no una pantalla en blanco. Tras reiniciar Django, Reintentar recuperó la tabla.
- Las capturas del alumno todavía deben adjuntarse. No se ha subido el repositorio ni el entregable al campus.

## Explicación de errores
CORS es una política del navegador: un servidor puede responder HTTP 200 y el navegador impedir que React lea esa respuesta porque el origen no está autorizado. Se corrige restituyendo el origen exacto.

La validación devuelve HTTP 400 porque title no permite un valor vacío. React muestra el contenido de la respuesta y permite corregir el campo.

Con Django apagado no hay respuesta HTTP de la API. React captura el fallo de conexión, conserva su interfaz y ofrece reintentar. Un fallo de red y un bloqueo CORS pueden verse iguales desde Axios; el diagnóstico se realiza en la consola y Network del navegador.

## Conclusiones
Se integraron las operaciones de listado, creación y borrado sin recargar manualmente la aplicación. Los estados de carga, datos y error mantienen una interfaz utilizable. La validación se resuelve en el servidor y su resultado se comunica al usuario. CORS se restringe al origen de desarrollo autorizado.
