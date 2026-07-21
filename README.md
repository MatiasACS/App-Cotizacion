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

1. Subir los archivos a la rama `main`.
2. Abrir **Settings → Pages**.
3. Seleccionar **Deploy from a branch**.
4. Elegir `main` y la carpeta `/root`.
5. Guardar.

## Próximas etapas

1. Sustituir el catálogo demostrativo por datos autorizados de Ferretería Cerda.
2. Crear un extractor separado.
3. Publicar versiones del catálogo con hash SHA-256.
4. Agregar actualización automática mediante GitHub Actions.
5. Evaluar DOI para releases estables del conjunto de datos.
