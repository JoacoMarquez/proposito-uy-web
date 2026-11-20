import type { APIRoute } from "astro";
import { bucket, consumirDescarga, registrarOperacion } from "../../../lib/archivos";
import { DESCARGAS_POR_LINK, nombreDescarga } from "../../../lib/archivos-limites";
import { site, whatsappLink } from "../../../data/site";

export const prerender = false;

// Descarga de un PDF de Cultivo desde el link personal del mail.
// - Cada link sirve DESCARGAS_POR_LINK veces.
// - El PDF se guarda en la Cache API del datacenter (clave = objeto de R2, no el
//   token), así las descargas repetidas no gastan lecturas de R2.
// - Si se llega al tope mensual de lecturas, se muestra "temporalmente no disponible".

function pagina(titulo: string, texto: string, status: number): Response {
  const wa = whatsappLink("Hola! Tengo un problema para descargar mi PDF de Cultivo.");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${titulo} · ${site.nombre}</title></head>
<body style="margin:0;background:#FBF8EF;font-family:Arial,Helvetica,sans-serif;color:#2D392C">
<div style="max-width:480px;margin:15vh auto;padding:28px;background:#fff;border-radius:16px">
<h1 style="font-size:20px;margin:0 0 8px">${titulo}</h1><p style="line-height:1.5">${texto}</p>
<p><a href="${wa}" style="color:#2D392C;font-weight:bold">Escribinos por WhatsApp</a> · <a href="/" style="color:#2D392C">Ir a la web</a></p>
</div></body></html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

export const GET: APIRoute = async ({ params, request, locals }) => {
  const res = await consumirDescarga(String(params.token ?? ""));
  if (!res.ok) {
    return res.motivo === "agotado"
      ? pagina("Link sin descargas disponibles", `Este link ya se usó ${DESCARGAS_POR_LINK} veces. Si necesitás descargarlo de nuevo, escribinos y te lo reenviamos.`, 410)
      : pagina("Link no válido", "No encontramos este archivo. Revisá que el link esté completo.", 404);
  }

  const cabeceras = {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${nombreDescarga(res.nombre)}"`,
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex",
  };

  // `caches.default` solo existe en el runtime de Workers (no en `astro dev`).
  const cache = (globalThis as any).caches?.default;
  const cacheKey = new Request(`${new URL(request.url).origin}/__archivos/${res.key}`);
  if (cache) {
    const hit: Response | undefined = await cache.match(cacheKey);
    if (hit) return new Response(hit.body, { status: 200, headers: cabeceras });
  }

  const r2 = await bucket();
  if (!r2 || !(await registrarOperacion("lecturas"))) {
    return pagina("Descarga temporalmente no disponible", "Estamos con una demora para entregar archivos. Probá de nuevo más tarde.", 503);
  }
  const obj = await r2.get(res.key);
  if (!obj) return pagina("Archivo no disponible", "Este archivo ya no está disponible. Escribinos y lo resolvemos.", 404);
  const datos = await obj.arrayBuffer();

  if (cache) {
    // La copia en caché lleva Cache-Control público (es lo que la Cache API
    // necesita para guardarla); el cliente recibe la respuesta privada de arriba.
    const guardar = cache.put(
      cacheKey,
      new Response(datos, { headers: { "Content-Type": "application/pdf", "Cache-Control": "public, max-age=2592000" } }),
    );
    const ctx = (locals as any).cfContext;
    if (ctx?.waitUntil) ctx.waitUntil(guardar);
    else await guardar;
  }

  return new Response(datos, { status: 200, headers: cabeceras });
};
