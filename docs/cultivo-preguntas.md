# Cultivo — dudas para Pedro

Consigna: doc "Cultivo" + mockups en Drive (carpeta "Cultivo", 19/11/2026).
Lista viva: lo que no bloquea se implementa con el supuesto indicado y se ajusta si Pedro dice otra cosa.

## Para preguntarle a Pedro

| # | Estado | Tema | Pregunta | Supuesto mientras tanto |
|---|--------|------|----------|-------------------------|
| 1 | ⬜ | Menú | En algunos mockups "Cultivo" reemplaza a "Tienda" en el menú y en otros aparecen los dos. ¿Quedan los dos? | Quedan los dos: Inicio · Nosotros · Tienda · Cultivo · Recetario… |
| 2 | ⬜ | Lema | El doc dice "llena de vida **a** tu espacio" y el logo dice "llena de vida tu espacio". El texto intro también cambia entre doc y mockup ("darle más vida a tu espacio" vs "llenar de vida tu espacio"). ¿Cuál va? | Lo del logo/mockup: "llena de vida tu espacio" y el texto del mockup. Editable desde Contenido. |
| 3 | ⬜ | Logos | Los PNG vienen con fondo crema y tienen restos tenues de otra imagen detrás del isotipo. ¿Podés pasar SVG o PNG con fondo transparente? | Recorto y limpio los PNG actuales. |
| 4 | ⬜ | Archivos | Los archivos "Logo/Portada - Tienda (Horizontal)" son de Cultivo, no de Tienda. ¿Para qué son? ¿Imagen para compartir en redes? | Uso la horizontal como imagen para compartir (OG) de /cultivo. |
| 5 | ⬜ | Archivos | "Categoría - Insumos(1).png" es en realidad la categoría Conocimiento. Solo confirmar. | Es Conocimiento. |
| 6 | ⬜ | Entrega del PDF | No hay pago online: los pagos se confirman a mano (transferencia o efectivo). ¿Está bien que el PDF salga automáticamente cuando marcás el pedido como "Pagado" en el panel? | Sí, al marcar "Pagado". Más un botón "Reenviar PDF" en el pedido. |
| 7 | ⬜ | Entrega del PDF | ¿Adjunto al mail o link de descarga? | Link de descarga privado, sin vencimiento. Los adjuntos pesados suelen caer en spam o rebotar. |
| 8 | ⬜ | Pago digital | En un pedido 100% digital, ¿se ofrece efectivo, o solo transferencia? | Solo transferencia. |
| 9 | ⬜ | Cantidad | En Conocimiento, ¿tiene sentido elegir cantidad? (comprar 2 veces el mismo PDF) | Cantidad fija en 1 para digitales. |
| 10 | ⬜ | Envío | Los productos digitales, ¿suman para llegar al envío gratis? | No: solo suman los productos físicos. |
| 11 | ⬜ | Recomendados | "También puede interesarte": ¿los elegís vos por producto o los elige la web sola? | Automático: otros productos de Cultivo (otras categorías primero), respetando el orden del panel. |
| 12 | ⬜ | Categorías | En Tienda, la página de cada categoría tiene un bloque de texto con características. En los mockups de Cultivo no aparece. ¿Lo querés o no? | Se puede cargar igual que en Tienda; si queda vacío no se muestra. |
| 13 | ⬜ | Catálogo | El "Catálogo" de Cultivo, ¿muestra solo productos de Cultivo? Y los de Cultivo, ¿aparecen también en el catálogo de Tienda o en "Los más pedidos" del inicio? | Catálogos separados. Cultivo no aparece en Tienda. |
| 14 | ⬜ | Plantines | Presentaciones de 2, 5 y 10 L: ¿cada una con su precio? ¿La ficha PDF es la misma para todas? | Sí: precio por presentación, un PDF por plantín. |
| 15 | ⬜ | PDFs | ¿De qué tamaño aproximado serán las guías (MB, páginas)? | Hasta 20 MB por archivo. |
| 16 | ⬜ | Categorías | ¿Las 3 categorías (Plantines, Insumos, Conocimiento) son fijas o querés poder crear otras desde el panel? | Fijas. Texto e imagen editables. |

## Decisiones técnicas (internas)

- **Modelo:** mismas tablas `productos`/`categorias`. Las categorías tienen `seccion` (`tienda` | `cultivo`) y, en Cultivo, `tipo` (plantines/insumos/conocimiento), que define las 6 tarjetas (`productos.especificaciones`, jsonb) y si lleva PDF. Lógica en `src/lib/cultivo.ts`.
- **Panel:** las páginas de productos viven en `src/pages/admin/[seccion]/` y sirven a `/admin/productos` y `/admin/cultivo`.
- **PDF:** R2 privado (binding `ARCHIVOS`, bucket `proposito-archivos`). Se manda por Brevo un link personal por producto al marcar el pedido "pagado" (y botón "Reenviar PDFs"). Topes en `src/lib/archivos-limites.ts`: 20 MB/archivo, 8 GB total, 800 k escrituras y 8 M lecturas por mes, 10 descargas por link; caché de la Cache API para no repetir lecturas.
- **Checkout:** carrito 100 % digital → sin entrega/agenda, solo transferencia, `modalidad = "digital"`. Mixto: el envío se calcula solo sobre lo físico. Una guía sin PDF cargado no se puede comprar.

## Checklist para subir a producción (en este orden)

1. Crear el bucket R2 `proposito-archivos` en la cuenta de Cloudflare (sin esto el deploy falla).
2. Correr `docs/migraciones/2026-11-cultivo.sql` en la base de **producción** (connection string desde Neon, no el `.env`).
3. Recién ahí mergear a `main` (auto-deploy).
4. Confirmar que `BREVO_SENDER_EMAIL` está cargado en el Worker (sin eso no salen los mails de PDFs).

_Última actualización: 2026-11-19_
