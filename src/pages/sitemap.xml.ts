import type { APIRoute } from "astro";
import { site } from "../data/site";
import { getProductos, getCategorias, getRecetas } from "../db/queries";

export const prerender = false;

const BASE = `https://${site.dominio}`;

// Rutas públicas estáticas (las privadas —admin, cuenta, checkout, etc.— se excluyen).
const RUTAS_FIJAS = [
  "/",
  "/nosotros",
  "/tienda",
  "/tienda/catalogo",
  "/recetario",
  "/retornables",
  "/preguntas",
  "/contacto",
];

function url(path: string): string {
  return new URL(path, BASE).href;
}

export const GET: APIRoute = async () => {
  const [productos, categorias, recetas] = await Promise.all([
    getProductos(),
    getCategorias(),
    getRecetas(),
  ]);

  const rutas = [
    ...RUTAS_FIJAS,
    ...categorias.map((c) => `/tienda/${c.slug}`),
    ...productos.map((p) => `/producto/${p.slug}`),
    ...recetas.map((r) => `/recetario/${r.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map((r) => `  <url><loc>${url(r)}</loc></url>`).join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
