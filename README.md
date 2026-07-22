# App-Cotizacion

MVP móvil y local para crear cotizaciones de trabajos de construcción y reparación usando precios referenciales de ferreterías locales.

## Objetivo inicial

La primera versión permite:

- seleccionar materiales desde un catálogo JSON;
- agregar materiales manuales;
- calcular materiales, mano de obra y transporte;
- guardar cotizaciones en el dispositivo;
- conservar la fuente y versión de los precios;
- imprimir o guardar la cotización como PDF;
- funcionar sin conexión después de la primera carga;
- exportar e importar un respaldo local.

## Fuente inicial

- **Nombre:** Ferretería Cerda
- **Sitio:** https://www.ferreteriacerda.cl/
- **Identificador:** `ferreteria-cerda-cl`
- **Moneda:** CLP

> El catálogo incluido en este repositorio es demostrativo. No representa precios vigentes de la ferretería.

## Tecnología

- HTML
- CSS
- JavaScript
- PWA
- localStorage
- GitHub Pages

No se requiere servidor, cuenta de usuario, base de datos externa ni proceso de compilación.

## Ejecutar localmente

Los service workers no funcionan correctamente abriendo `index.html` directamente. Inicia un servidor local:

```bash
python -m http.server 8080
```

Luego abre:

```text
http://localhost:8080
```

## Publicar en GitHub Pages

La URL esperada de la aplicación es:

```text
https://matiasacs.github.io/App-Cotizacion/
```

La URL sólo estará disponible después de habilitar GitHub Pages y completar el primer despliegue.

1. Mantener los archivos de la aplicación en la rama `main`.
2. Abrir **Settings → Pages**.
3. En **Build and deployment**, seleccionar **Deploy from a branch**.
4. Elegir la rama `main` y la carpeta `/(root)`.
5. Guardar y esperar el primer despliegue.

No se requiere GitHub Actions ni un proceso de compilación. El archivo `.nojekyll` permite que GitHub Pages publique los archivos estáticos directamente desde la raíz.

## Probar desde un teléfono

Después de habilitar Pages:

1. Abrir `https://matiasacs.github.io/App-Cotizacion/` desde el navegador del teléfono.
2. Crear y guardar una cotización de prueba marcada claramente como demostrativa.
3. Recargar la página y confirmar que la cotización continúa en el historial.
4. Tras una primera carga completa, desactivar temporalmente la conexión y comprobar que la aplicación vuelve a abrir y permite consultar la cotización.
5. Probar **Imprimir / PDF** y, si el navegador lo ofrece, instalar la aplicación en la pantalla de inicio.

## Desarrollo con Codex

- Contexto y decisiones vigentes: [`docs/CODEX_HANDOFF.md`](docs/CODEX_HANDOFF.md)
- Prompts por milestone: [`docs/CODEX_PROMPTS.md`](docs/CODEX_PROMPTS.md)
- Flujo local de ramas y pruebas: [`docs/WORKFLOW_CODEX.md`](docs/WORKFLOW_CODEX.md)
- Restricciones obligatorias del agente: [`AGENTS.md`](AGENTS.md)

Las decisiones de producto y arquitectura se realizan fuera de Codex. Codex implementa tareas técnicas pequeñas, prueba los cambios y entrega ramas o pull requests revisables.

## Próximas etapas

1. Preparar y probar el despliegue en GitHub Pages.
2. Completar el smoke test funcional desde un teléfono.
3. Sustituir el catálogo demostrativo por datos autorizados de Ferretería Cerda.
4. Crear un extractor separado.
5. Publicar versiones del catálogo con hash SHA-256.
6. Evaluar DOI para releases estables del conjunto de datos.
