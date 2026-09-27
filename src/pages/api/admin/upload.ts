import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { validateToken, SESSION_COOKIE } from "../../../lib/auth";

export const prerender = false;

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

// Sube una imagen (ya optimizada en el cliente) al bucket R2. Solo admin.
export const POST: APIRoute = async ({ request, cookies }) => {
  const admin = await validateToken(cookies.get(SESSION_COOKIE)?.value);
  if (!admin) return json({ error: "No autorizado." }, 401);

  const bucket = (env as any).FOTOS;
  if (!bucket) return json({ error: "Almacenamiento de fotos no configurado (bucket R2)." }, 500);

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return json({ error: "Falta el archivo." }, 400);
  if (file.size > 5 * 1024 * 1024) return json({ error: "La imagen es muy grande (máx. 5 MB)." }, 400);

  const slug = String(form.get("slug") ?? "img").toLowerCase().replace(/[^a-z0-9-]/g, "") || "img";
  const rand = Math.random().toString(36).slice(2, 8);
  const key = `productos/${slug}-${rand}.webp`;

  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: "image/webp" },
  });

  return json({ url: `/fotos/${key}` }, 200);
};
