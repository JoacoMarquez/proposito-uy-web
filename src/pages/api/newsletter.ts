import type { APIRoute } from "astro";
import { suscribirNewsletter } from "../../db/queries";
import { agregarContactoBrevo } from "../../lib/brevo";

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Datos inválidos." }, 400);
  }

  const email = String(body?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return json({ error: "Ingresá un email válido." }, 400);
  }

  // Brevo es la fuente de verdad de la lista de mailing. agregarContactoBrevo
  // usa updateEnabled, así que es idempotente: si el contacto ya está lo deja
  // igual, y si lo borraste a mano en Brevo lo vuelve a agregar. Por eso la
  // respuesta depende de Brevo y no de la base: antes la base "recordaba"
  // suscriptores que ya no estaban en Brevo y la web quedaba desincronizada.
  const brevo = await agregarContactoBrevo(email).catch((e) => {
    console.error("[newsletter] excepción al sincronizar con Brevo:", e);
    return "error" as const;
  });

  // Backup local (best-effort): registro histórico de quién se suscribió. No
  // decide la respuesta; si falla, se loguea pero no rompe la suscripción.
  await suscribirNewsletter(email).catch((e) => {
    console.error("[newsletter] no se pudo guardar el backup en la base:", e);
  });

  if (brevo === "error") {
    console.error("[newsletter] Brevo rechazó la suscripción de:", email);
    return json({ error: "No pudimos suscribirte ahora. Probá de nuevo en un rato." }, 502);
  }
  if (brevo === "sin-config") {
    // Brevo no está configurado (faltan secrets). Igual quedó en la base, así
    // que para el usuario el resultado es válido, pero lo dejamos en los logs.
    console.warn("[newsletter] Brevo sin configurar: el email solo se guardó en la base:", email);
  }

  return json({ ok: true, mensaje: "¡Listo! Te suscribiste a las novedades." });
};
