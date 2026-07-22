# Handoff técnico para Codex

## Estado del proyecto

- Repositorio: `MatiasACS/App-Cotizacion`.
- Rama estable: `main`.
- El MVP está fusionado y el repositorio es público.
- Stack actual: HTML, CSS y JavaScript sin framework.
- Persistencia: `localStorage` del navegador.
- Distribución prevista: Progressive Web App (PWA) en GitHub Pages.
- Fuente inicial de precios: Ferretería Cerda, `https://www.ferreteriacerda.cl/`.
- El catálogo actual es demostrativo y no representa precios vigentes.

## Objetivo del producto

Crear una aplicación extremadamente simple para que un trabajador independiente de construcción y reparación de hogares pueda elaborar cotizaciones desde el celular en menos de cinco minutos.

La aplicación debe permitir:

1. ingresar datos del maestro, cliente y trabajo;
2. agregar materiales desde un catálogo o manualmente;
3. agregar mano de obra, transporte y otros costos;
4. calcular el total;
5. guardar y reabrir cotizaciones localmente;
6. imprimir o guardar la cotización como PDF;
7. conservar la fuente y versión de los precios usados;
8. funcionar sin conexión después de la primera carga;
9. exportar e importar un respaldo local.

## Usuario principal

Persona no técnica que trabaja en terreno y usa principalmente un teléfono Android. La prioridad es claridad, botones grandes, pocos pasos y ausencia de configuraciones complejas.

## Arquitectura actual

- `index.html`: interfaz completa del cotizador.
- `styles.css`: diseño adaptable a celular e impresión.
- `app.js`: estado, cálculos, persistencia, catálogo, historial y respaldo.
- `data/catalog.json`: catálogo local demostrativo y metadatos de fuente.
- `manifest.webmanifest`: instalación PWA.
- `service-worker.js`: caché y funcionamiento offline.
- `AGENTS.md`: restricciones obligatorias para agentes de desarrollo.
- `docs/MVP.md`: alcance funcional aprobado.

## Invariantes obligatorias

1. No introducir React, Vue, Angular, backend, autenticación ni servicios pagados sin una decisión estratégica aprobada fuera de Codex.
2. No enviar nombres, teléfonos, clientes ni cotizaciones a servicios externos.
3. No ejecutar scraping desde el navegador.
4. Una cotización guardada debe conservar una copia de sus precios y metadatos; una actualización posterior del catálogo no puede alterar cotizaciones históricas.
5. Todos los datos demostrativos deben permanecer identificados como demostrativos.
6. Mantener rutas relativas compatibles con un proyecto de GitHub Pages publicado en un subdirectorio.
7. Mantener el flujo principal usable en una pantalla de 360 px de ancho.
8. Evitar dependencias salvo que aporten una mejora imprescindible y se justifiquen antes de incorporarlas.
9. Hacer cambios pequeños mediante ramas y pull requests revisables.
10. No comenzar el extractor de Ferretería Cerda sin una instrucción explícita.

## Milestone inmediato

### MVP público y comprobable

El próximo hito no es agregar funciones. Es conseguir una versión desplegada en GitHub Pages y completar una prueba funcional desde un teléfono real.

Criterios de aceptación:

- la página carga en la URL de GitHub Pages;
- CSS, JavaScript, manifiesto y catálogo cargan desde el subdirectorio del proyecto;
- se puede agregar un material del catálogo;
- se puede agregar un material manual;
- los totales se calculan correctamente;
- una cotización se guarda y vuelve a abrir;
- el respaldo JSON se exporta;
- la vista de impresión permite guardar un PDF;
- tras una primera carga, el flujo básico funciona sin conexión;
- no aparecen errores no controlados en la consola.

## Backlog técnico priorizado

### P0 — Publicación y estabilidad

1. Preparar el repositorio para GitHub Pages.
2. Verificar rutas relativas y alcance del service worker.
3. Agregar `.nojekyll` si se publica directamente desde la raíz.
4. Ejecutar una prueba funcional local.
5. Corregir únicamente fallas que bloqueen el flujo principal.

### P1 — Piloto móvil

1. Probar el flujo en Android/Chrome.
2. Registrar dificultades de uso reales.
3. Mejorar mensajes de validación y tamaños táctiles.
4. Confirmar que el usuario entiende dónde guardar el PDF.
5. Confirmar que el respaldo se puede recuperar.

### P2 — Integridad del catálogo

1. Formalizar un JSON Schema para fuente, catálogo y productos.
2. Agregar validación automática del catálogo.
3. Calcular hash SHA-256 para releases del catálogo.
4. Definir el mecanismo de actualización sin implementar todavía el scraper.

### P3 — Extracción de precios

Solo después de aprobar la estrategia de extracción, permisos y frecuencia:

1. extractor separado de la PWA;
2. normalización de productos;
3. pruebas de selectores;
4. historial de versiones;
5. publicación de `catalog.json` validado.

## Funciones deliberadamente postergadas

- cuentas y sincronización;
- backend;
- agenda;
- pagos;
- fotografías;
- métricas comerciales;
- comparación entre ferreterías;
- calculadoras de obra;
- DOI automático;
- scraping de producción.

## Protocolo de trabajo con Codex

Para cada tarea:

1. leer `AGENTS.md`, `docs/MVP.md` y este documento;
2. inspeccionar el estado del repositorio antes de modificar;
3. declarar el alcance técnico exacto;
4. crear una rama específica;
5. realizar el cambio mínimo necesario;
6. ejecutar pruebas y validaciones pertinentes;
7. revisar el diff completo;
8. documentar riesgos y pruebas manuales pendientes;
9. no fusionar automáticamente;
10. terminar con un resumen de archivos, pruebas y decisiones que requieren revisión humana.

Las decisiones de producto, alcance, datos y arquitectura se toman en la conversación de planificación. Codex ejecuta las tareas técnicas aprobadas.