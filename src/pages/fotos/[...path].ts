import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

// Sirve las imágenes guardadas en el bucket R2 (subidas desde el panel).
export const GET: APIRoute = async ({ params }) => {
  const key = params.path;
  const bucket = (env as any).FOTOS;
  if (!key || !bucket) return new Response("Not found", { status: 404 });

  const obj = await bucket.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      ETag: obj.httpEtag,
    },
  });
};
