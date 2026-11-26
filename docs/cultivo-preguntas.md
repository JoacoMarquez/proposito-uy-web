# Cultivo — dudas para Pedro

Consigna: doc "Programación – Cultivo" + mockups en Drive (carpeta "Cultivo").
Versiones del doc: 19/11 (original), 23/11 (sin PDFs, Conocimiento → Cosechas) y 25/11 (ajustes: se elimina Cosechas, atajos, imágenes por dispositivo, asesoramiento por WhatsApp).
Lista viva: lo que no bloquea se implementa con el supuesto indicado y se ajusta si Pedro dice otra cosa.

## Para preguntarle a Pedro

| # | Estado | Tema | Pregunta | Supuesto mientras tanto |
|---|--------|------|----------|-------------------------|
| 1 | ⬜ | Atajos | En PC había 3 atajos y en celular 4 (con Contacto). Propuesta aplicada: los mismos 4 en ambos (Recetario, Retornables, Preguntas, Cultivo); Contacto sigue en el menú. ¿Te parece? | Aplicado así. Falta la imagen del atajo Cultivo (Contenido › Inicio). |
| 2 | ⬜ | Logo | ¿Cuándo tenés el logo con el lema nuevo "Todo empieza en la tierra"? Idealmente en SVG o PNG con fondo transparente. | Queda el logo actual (con el lema viejo) hasta que lo subas desde Contenido › Cultivo. |
| 3 | ⬜ | Imágenes | Tamaños sugeridos: Plantines/Insumos 1600×900 (computadora) y 1200×900 (celular); Catálogo 2400×800 (computadora) y 1600×900 (celular); Nosotros 1200×1500. | Mientras no haya foto de Catálogo se ve el isotipo. |
| 5 | ⬜ | Nombre y variante | La ficha y las tarjetas ya muestran nombre y variante separados, sin barra. En el título de la pestaña, el camino de migas, el carrito y los pedidos aparece "Tierra \| Campo", igual que en Tienda. ¿Está bien así? | Igual que en Tienda. |
| 6 | ⬜ | Menú | En algunos mockups "Cultivo" reemplaza a "Tienda" en el menú y en otros aparecen los dos. ¿Quedan los dos? | Quedan los dos: Inicio · Nosotros · Tienda · Cultivo · Recetario… |
| 7 | ⬜ | Archivos | Los archivos "Logo/Portada - Tienda (Horizontal)" son de Cultivo. ¿Para qué son? ¿Imagen para compartir en redes? | Sin uso por ahora. |
| 9 | ⬜ | Categorías | En Tienda, la página de cada categoría tiene un bloque de texto con características. En los mockups de Cultivo no aparece. ¿Lo querés? | Se puede cargar igual que en Tienda; si queda vacío no se muestra. |
| 10 | ⬜ | Catálogo | El catálogo de Cultivo, ¿muestra solo productos de Cultivo? ¿Alguno de Cultivo va en "Los más pedidos" del inicio? | Catálogos separados. Cultivo no aparece en Tienda. |
| 11 | ⬜ | Categorías | ¿Las categorías (Plantines, Insumos) son fijas o querés poder crear otras desde el panel? | Fijas. Texto e imagen editables. |

Resueltas por el doc del 23/11: lema ("Todo empieza en la tierra"), texto de presentación, PDFs (se eliminan), pago y envío de digitales (no hay), presentaciones de Plantines (2 y 5 L con precio cada una).

## Decisiones técnicas (internas)

- **Modelo:** mismas tablas `productos`/`categorias`. Las categorías tienen `seccion` (`tienda` | `cultivo`) y, en Cultivo, `tipo` (plantines/insumos), que define las 6 tarjetas (`productos.especificaciones`, jsonb). En Insumos el título de cada tarjeta también es editable por producto (`titulo_<clave>` en el mismo jsonb). Lógica en `src/lib/cultivo.ts`.
- **Panel:** las páginas de productos viven en `src/pages/admin/[seccion]/` y sirven a `/admin/productos` y `/admin/cultivo`.
- **Pedidos:** todos los productos de Cultivo son físicos; usan el carrito, checkout, pagos y entregas de siempre sin cambios.

## Checklist para subir a producción (en este orden)

1. Correr `docs/migraciones/2026-11-cultivo-ajustes.sql` (ajustes del 25/11; `2026-11-cultivo.sql` ya corrió) en la base de **producción** (connection string desde Neon, no el `.env`).
2. Recién ahí mergear a `main` (auto-deploy).

_Última actualización: 2026-11-26_
