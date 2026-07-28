import type { APIRoute } from "astro";
import { getImagen } from "../../../db/queries";

export const prerender = false;

// Sirve una imagen guardada en la base (Neon). La URL es content-addressed por
// id (cada subida crea una fila nueva), así que el contenido es inmutable y se
// puede cachear de forma agresiva en el navegador y la CDN.
//
// Las respuestas generadas por un Worker NO pasan por la caché del CDN de
// Cloudflare automáticamente (el Cache-Control solo le sirve al navegador),
// así que usamos la Cache API explícitamente: cada datacenter guarda su copia
// y las visitas siguientes no tocan Neon — que cobra por transferencia.
export const GET: APIRoute = async ({ params, request, locals }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) return new Response("No encontrada", { status: 404 });

  // Clave normalizada sin query string para no duplicar entradas de caché.
  const url = new URL(request.url);
  const cacheKey = new Request(url.origin + url.pathname);
  // `caches.default` solo existe en el runtime de Workers (no en `astro dev`).
  const cache = (globalThis as any).caches?.default;

  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
  }

  const img = await getImagen(id);
  if (!img) return new Response("No encontrada", { status: 404 });

  const bytes = Buffer.from(img.data, "base64");
  const res = new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });

  if (cache) {
    const guardar = cache.put(cacheKey, res.clone());
    const ctx = (locals as any).cfContext;
    if (ctx?.waitUntil) ctx.waitUntil(guardar);
    else await guardar;
  }

  return res;
};
