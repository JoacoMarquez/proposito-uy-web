# Propósito UY — Web

Sitio de la marca **Propósito UY**: catálogo de productos (frutos secos, barras
proteicas, hummus y cremas) con **pedidos por WhatsApp**. No es un e-commerce con
carrito/pago: es un sitio de contenido estático.

- **Stack:** [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com) (v4).
- **Tipo de salida:** estático (`output: static`) → se puede deployar en cualquier hosting.
- **Dominio:** `propositouy.com.uy`.

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor local en http://localhost:4321
npm run build    # genera el sitio en dist/
npm run preview  # previsualiza dist/ localmente
```

## Cómo editar el contenido (sin tocar diseño)

Todo el contenido vive en `src/data/`:

| Archivo | Qué controla |
|---|---|
| `src/data/site.ts` | Nombre, **número de WhatsApp**, redes, navegación. |
| `src/data/productos.ts` | Catálogo. Agregar/editar un producto = editar la lista. |
| `src/data/recetas.ts` | Recetas del recetario (cada una genera su página). |
| `src/data/preguntas.ts` | Preguntas frecuentes por tema. |

> ⚠️ **Pendiente:** poner el número real de WhatsApp en `src/data/site.ts`
> (`whatsapp: "598..."`). Hoy hay un placeholder.

## Estructura de páginas (mapa del documento base)

- `/` — Inicio (banner, más pedidos, categorías, cierre, atajos)
- `/nosotros` — Declaración + compromisos
- `/tienda` → `/tienda/{secos,barras,humedos}` y `/tienda/catalogo`
- `/recetario` → `/recetario/{slug}`
- `/retornables`
- `/preguntas`
- `/contacto` (WhatsApp)

## Deploy

El sitio es **estático**, así que el mismo `dist/` sirve para los dos caminos:

### Opción A — Vercel (recomendado para desarrollo)
1. Subir el repo a GitHub.
2. Importar en [vercel.com](https://vercel.com) → detecta Astro automáticamente.
3. Cada `git push` redeploya. Apuntar `propositouy.com.uy` en Settings → Domains.

### Opción B — Hostinger (aprovecha lo ya pagado hasta 2029)
1. `npm run build`.
2. Subir **el contenido de `dist/`** a `public_html` (File Manager o FTP en hPanel).
3. (Opcional) Automatizar con GitHub Actions vía FTP para no subir a mano.

## Roadmap

- [x] Fase 0 — Setup (Astro + Tailwind + estructura de datos)
- [x] Fase 1 — Layout, header, footer, componentes base
- [x] Fase 2 — Contenido como datos (productos, recetas, FAQ)
- [x] Fase 3 — Páginas de Tienda (categorías + catálogo + producto)
- [x] Fase 4 — Nosotros, Recetario, Retornables, Preguntas, Contacto
- [ ] Fase 5 — Cargar contenido real + fotos del Drive, pulido responsive/SEO
- [ ] Fase 6 — Deploy a producción + dominio + analytics
- [ ] Fase 7 (opcional) — CMS liviano (Keystatic/Decap) para que el cliente edite
