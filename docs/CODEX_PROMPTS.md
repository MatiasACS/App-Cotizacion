# Prompts de desarrollo para Codex

Ejecutar los prompts en orden. No entregar dos milestones distintos en una sola sesión. Cada prompt exige una rama y un diff revisable.

---

## Prompt 0 — Orientación y auditoría inicial

```text
Trabaja en el repositorio App-Cotizacion.

Antes de modificar cualquier archivo:
1. lee AGENTS.md, docs/MVP.md y docs/CODEX_HANDOFF.md completos;
2. ejecuta git status y confirma la rama actual;
3. inspecciona index.html, styles.css, app.js, service-worker.js, manifest.webmanifest y data/catalog.json;
4. describe brevemente cómo funciona el flujo principal y dónde se guardan los datos;
5. identifica errores evidentes, riesgos para GitHub Pages y riesgos para funcionamiento móvil/offline.

No implementes cambios todavía. No agregues dependencias. No propongas backend, autenticación, framework ni scraping.

Entrega:
- mapa breve de archivos y responsabilidades;
- lista priorizada de hallazgos P0, P1 y P2;
- comandos que usarías para validar localmente;
- propuesta de una única primera tarea técnica pequeña.
```

---

## Prompt 1 — Preparar GitHub Pages

```text
Trabaja en App-Cotizacion y prepara únicamente la publicación estática en GitHub Pages.

Lee primero AGENTS.md, docs/MVP.md y docs/CODEX_HANDOFF.md. Parte desde main actualizado y crea la rama feat/github-pages-readiness.

Objetivo:
Que el sitio pueda publicarse desde la raíz de main como un proyecto GitHub Pages, manteniendo rutas relativas, PWA y funcionamiento offline.

Tareas:
1. audita todas las rutas de index.html, app.js, manifest.webmanifest y service-worker.js para un despliegue bajo /App-Cotizacion/;
2. corrige solo rutas incompatibles;
3. agrega un archivo .nojekyll vacío en la raíz;
4. confirma que start_url, scope y registro del service worker sean compatibles con el subdirectorio;
5. inicia un servidor local y prueba que HTML, CSS, JS, manifiesto y data/catalog.json respondan correctamente;
6. ejecuta validaciones de sintaxis para JavaScript y JSON;
7. actualiza README.md con una sección breve de despliegue y URL esperada, sin inventar que Pages ya está habilitado;
8. no agregues GitHub Actions, porque esta aplicación no requiere compilación;
9. no cambies diseño ni funciones de negocio.

Criterios de aceptación:
- ninguna ruta absoluta al dominio;
- la aplicación funciona servida desde un subdirectorio equivalente a /App-Cotizacion/;
- .nojekyll está presente;
- no hay errores de sintaxis;
- el diff solo contiene preparación de Pages y documentación.

Al terminar:
- muestra git diff --stat;
- enumera las pruebas ejecutadas y resultados;
- indica los pasos manuales exactos que debe hacer el propietario en Settings > Pages;
- no fusiones ni publiques automáticamente.
```

---

## Prompt 2 — Prueba funcional del MVP

```text
Trabaja en App-Cotizacion después de que la preparación de GitHub Pages esté integrada. Crea la rama test/mvp-functional-smoke.

Lee AGENTS.md, docs/MVP.md y docs/CODEX_HANDOFF.md.

Objetivo:
Comprobar y corregir exclusivamente errores que bloqueen el flujo principal del MVP.

Escenarios obligatorios:
1. cargar el catálogo demostrativo;
2. seleccionar un producto del catálogo y agregar cantidad;
3. agregar un ítem manual;
4. eliminar un ítem;
5. ingresar mano de obra y transporte;
6. validar subtotales y total;
7. guardar una cotización;
8. reabrirla desde el historial;
9. modificarla y guardar nuevamente sin duplicarla;
10. eliminar una cotización;
11. exportar un respaldo JSON;
12. importar un respaldo válido;
13. rechazar un respaldo inválido;
14. abrir la vista Imprimir / PDF;
15. recargar la aplicación y confirmar persistencia;
16. simular desconexión después de una primera carga y comprobar el shell offline.

Reglas:
- no rediseñes la interfaz;
- no agregues nuevas funciones;
- no migres localStorage;
- no agregues dependencias salvo que sea imposible ejecutar una prueba útil sin ellas; si ocurre, detente y explica antes de instalar;
- corrige únicamente fallas reproducibles;
- conserva los precios congelados de cada cotización.

Entrega:
- tabla de escenarios con aprobado/fallido;
- bugs encontrados con causa raíz;
- cambios mínimos realizados;
- pruebas ejecutadas;
- lista de pruebas que requieren teléfono real;
- diff revisado y sin cambios fuera de alcance.
```

---

## Prompt 3 — Ajuste de usabilidad móvil

```text
Trabaja en App-Cotizacion después del smoke test. Crea la rama feat/mobile-usability-pass.

Lee AGENTS.md, docs/MVP.md y docs/CODEX_HANDOFF.md.

Objetivo:
Mejorar la facilidad de uso en Android/Chrome para una persona no técnica, sin cambiar arquitectura ni agregar funciones de negocio.

Prueba la aplicación a 360 x 800 px y 412 x 915 px.

Evalúa y mejora solo cuando sea necesario:
- botones con área táctil suficiente;
- legibilidad y contraste;
- orden visual del flujo;
- visibilidad del total;
- mensajes de error comprensibles;
- prevención de cantidades vacías o negativas;
- claridad entre guardar, imprimir y crear nueva cotización;
- historial fácil de abrir;
- evitar desplazamiento horizontal fuera de la tabla de materiales;
- etiquetas accesibles y navegación con teclado;
- confirmación antes de perder una cotización no guardada, solo si se puede implementar de forma simple y confiable.

Restricciones:
- no uses frameworks;
- no agregues animaciones decorativas;
- no cambies la marca ni inventes funcionalidades;
- no agregues login, nube o analítica;
- mantén impresión y modo offline.

Entrega:
- capturas o descripción de antes/después;
- problemas observados y cambios asociados;
- comprobación en ambas resoluciones;
- pruebas de regresión del flujo principal;
- recomendaciones que deben volver a planificación, sin implementarlas.
```

---

## Prompt 4 — Contrato y validación del catálogo

```text
Trabaja en App-Cotizacion. No implementes scraping. Crea la rama feat/catalog-contract.

Lee AGENTS.md, docs/MVP.md y docs/CODEX_HANDOFF.md.

Objetivo:
Formalizar el contrato de datos necesario para reemplazar el catálogo demostrativo por datos versionados sin romper cotizaciones históricas.

Tareas:
1. analiza data/catalog.json y el consumo real en app.js;
2. crea JSON Schema para fuente, catálogo y producto, usando una versión estable del estándar sin agregar una librería en el navegador;
3. crea un script local simple de validación, preferentemente con Python estándar o Node sin dependencias;
4. valida campos obligatorios, tipos, moneda CLP, precios no negativos, identificadores únicos y fechas ISO 8601;
5. agrega cálculo reproducible de SHA-256 del archivo de catálogo;
6. documenta cómo versionar con CalVer, por ejemplo YYYY.MM.DD.N;
7. conserva compatibilidad con el catálogo actual;
8. agrega datos de prueba inválidos solo dentro de tests o fixtures;
9. no extraigas información de la web ni cambies precios.

Entrega:
- esquema y explicación de campos;
- comandos de validación y hash;
- pruebas positivas y negativas;
- análisis de compatibilidad con app.js;
- decisiones de datos que requieren aprobación antes del extractor.
```

---

## Prompt 5 — Diseño técnico del extractor, sin implementarlo

```text
Realiza únicamente un diseño técnico para un futuro extractor de Ferretería Cerda. No escribas todavía código que haga solicitudes al sitio.

Lee AGENTS.md, docs/MVP.md, docs/CODEX_HANDOFF.md y el contrato de catálogo aprobado.

Objetivo:
Proponer una arquitectura separada de la PWA que obtenga información pública, normalice productos, valide el catálogo y publique una nueva versión revisable.

El diseño debe cubrir:
- verificación de autorización, robots.txt y términos antes de operar;
- frecuencia moderada y ejecución manual inicial;
- separación scraper/normalizador/validador/publicador;
- campos disponibles y campos ausentes;
- estrategia de identificadores estables;
- manejo de productos eliminados, sin precio o duplicados;
- pruebas con HTML guardado como fixture;
- detección de cambios de selectores;
- generación de manifest, hash y resumen de cambios;
- publicación mediante pull request, nunca directamente a main;
- rollback a la última versión válida;
- logs sin datos personales;
- riesgos legales y operativos.

No hagas solicitudes HTTP, no uses Playwright y no agregues dependencias. Entrega un documento de diseño y una lista de preguntas para planificación.
```

---

## Prompt 6 — Revisión de una entrega antes del PR

```text
Revisa la rama actual de App-Cotizacion como si fueras el revisor técnico antes de abrir un pull request.

Lee AGENTS.md y docs/CODEX_HANDOFF.md. Compara la rama con main.

Comprueba:
- que el cambio coincide con el alcance declarado;
- que no se incorporaron dependencias, servicios externos o datos personales inesperados;
- que la PWA sigue funcionando en subdirectorio;
- que las cotizaciones históricas siguen congelando precios;
- que no se alteró el catálogo demostrativo como si fuera real;
- que los archivos modificados son necesarios;
- que hay validaciones suficientes;
- que README y documentación siguen correctos.

Ejecuta las pruebas disponibles. No modifiques código en la primera pasada.

Entrega:
1. resumen del diff;
2. problemas bloqueantes;
3. problemas no bloqueantes;
4. pruebas y resultados;
5. recomendación: listo para PR o requiere cambios;
6. borrador de título y cuerpo del pull request.
```
