import type { APIRoute } from "astro";
import { site } from "../data/site";

export const prerender = false;

const BASE = `https://${site.dominio}`;

// Secciones privadas / sin valor para buscadores.
const DISALLOW = ["/admin", "/cuenta", "/checkout", "/carrito", "/pedido", "/api"];

export const GET: APIRoute = () => {
  const body = `User-agent: *
${DISALLOW.map((p) => `Disallow: ${p}`).join("\n")}

Sitemap: ${BASE}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
