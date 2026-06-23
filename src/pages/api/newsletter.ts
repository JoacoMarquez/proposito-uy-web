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

  try {
    const r = await suscribirNewsletter(email);
    // Sincroniza con Brevo (no bloquea ni rompe si Brevo falla o no está configurado).
    await agregarContactoBrevo(email).catch(() => {});
    return json({
      ok: true,
      mensaje:
        r === "duplicado"
          ? "¡Ese email ya estaba suscrito! Gracias."
          : "¡Listo! Te suscribiste a las novedades.",
    });
  } catch (e) {
    console.error("[newsletter] error al guardar suscriptor:", e);
    return json({ error: "No pudimos registrar tu suscripción. Probá de nuevo." }, 500);
  }
};
