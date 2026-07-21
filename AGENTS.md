# Instrucciones para Codex

## Propósito

Mantener una aplicación extremadamente simple para uso móvil en terreno.

## Reglas

1. No agregar frameworks sin una necesidad demostrada.
2. No agregar backend, autenticación ni servicios pagados al MVP.
3. Mantener funcionamiento offline.
4. No enviar cotizaciones, clientes ni teléfonos a servicios externos.
5. Cada producto agregado a una cotización debe copiar:
   - nombre;
   - precio;
   - unidad;
   - `source_id`;
   - versión del catálogo;
   - fecha de observación;
   - URL de origen cuando exista.
6. Una cotización histórica nunca debe cambiar cuando se actualice el catálogo.
7. Los cambios deben ser pequeños y revisables.
8. No incorporar scraping dentro del navegador.
9. Marcar claramente todos los datos demostrativos.
10. Probar el flujo principal en una pantalla móvil.

## Flujo principal

1. Ingresar datos del maestro y cliente.
2. Agregar materiales.
3. Agregar mano de obra y transporte.
4. Revisar total.
5. Guardar.
6. Imprimir o guardar como PDF.

## Criterio de éxito del MVP

Una persona sin conocimientos técnicos puede generar una cotización desde un teléfono en menos de cinco minutos.
