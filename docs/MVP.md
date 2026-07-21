# Alcance del MVP

## Incluido

- aplicación instalable tipo PWA;
- diseño para celular;
- catálogo local en JSON;
- actualización manual del catálogo mediante un botón;
- materiales del catálogo;
- materiales personalizados;
- mano de obra;
- transporte;
- cálculo automático;
- guardado local;
- historial;
- PDF mediante impresión;
- respaldo JSON;
- trazabilidad básica de la fuente.

## No incluido

- scraper;
- DOI automático;
- sincronización;
- cuentas;
- múltiples usuarios;
- pagos;
- agenda;
- métricas;
- fotografías;
- calculadoras de obra;
- comparación entre proveedores.

## Entidades mínimas

### Fuente

- `source_id`
- nombre
- sitio web
- moneda
- contacto
- ubicación

### Catálogo

- versión
- fecha de generación
- fuente
- productos

### Producto

- identificador
- SKU
- nombre
- unidad
- precio
- categoría
- URL
- fecha de observación

### Cotización

- identificador
- fecha
- maestro
- cliente
- trabajo
- materiales congelados
- mano de obra
- transporte
- total
- fuente y versión del catálogo
