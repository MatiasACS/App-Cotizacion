# Flujo local de trabajo con Codex

## 1. Preparar el repositorio

```bash
git clone https://github.com/MatiasACS/App-Cotizacion.git
cd App-Cotizacion
git pull origin main
```

Verificar:

```bash
git status -sb
```

## 2. Abrir Codex desde la raíz

Iniciar Codex dentro de la carpeta que contiene `AGENTS.md`. El agente debe leer las instrucciones del repositorio antes de modificar archivos.

La primera sesión debe usar el Prompt 0 de `docs/CODEX_PROMPTS.md`.

## 3. Una tarea por rama

Ejemplo:

```bash
git switch main
git pull origin main
git switch -c feat/github-pages-readiness
```

No mezclar en una rama:

- GitHub Pages;
- mejoras de interfaz;
- validación del catálogo;
- extractor;
- nuevas funciones.

## 4. Ejecutar localmente

```bash
python -m http.server 8080
```

Abrir en el navegador:

```text
http://localhost:8080
```

Para simular que GitHub Pages sirve la app desde `/App-Cotizacion/`, puede montarse o copiarse el proyecto dentro de un directorio con ese nombre antes de iniciar el servidor. Codex debe verificar que todas las rutas continúen siendo relativas.

## 5. Validaciones mínimas

```bash
node --check app.js
node --check service-worker.js
python -m json.tool data/catalog.json > /dev/null
python -m json.tool manifest.webmanifest > /dev/null
```

También se debe ejecutar una prueba manual del flujo modificado.

## 6. Revisar antes de confirmar

```bash
git diff --check
git diff --stat
git diff
```

Codex debe explicar:

- qué cambió;
- por qué;
- qué pruebas ejecutó;
- qué no pudo probar;
- qué riesgos permanecen.

## 7. Commit y publicación

Solo después de revisar el diff:

```bash
git add <archivos-aprobados>
git commit -m "feat: prepare GitHub Pages deployment"
git push -u origin feat/github-pages-readiness
```

Luego abrir un pull request hacia `main`. No fusionar automáticamente.

## 8. Separación de responsabilidades

### Conversación de planificación

Define:

- objetivos;
- prioridades;
- alcance;
- experiencia del usuario;
- modelo de datos;
- autorización de extracción;
- decisiones arquitectónicas.

### Codex

Ejecuta:

- inspección técnica;
- implementación acotada;
- pruebas;
- documentación técnica;
- preparación de rama y pull request.

Codex no debe tomar decisiones de producto irreversibles ni ampliar el alcance por iniciativa propia.

## 9. Formato esperado al final de cada sesión

```text
Rama:
Objetivo:
Archivos modificados:
Pruebas ejecutadas:
Resultados:
Pruebas manuales pendientes:
Riesgos:
Decisiones requeridas:
Siguiente acción recomendada:
```
