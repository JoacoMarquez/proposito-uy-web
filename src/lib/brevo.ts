// Sincroniza suscriptores del newsletter con una lista de contactos de Brevo.
// Es "best-effort": si falta la API key/List ID o Brevo falla, no rompe la
// suscripción (igual que mail.ts con Resend). Corre en el Worker (fetch).

type EnvLike = Record<string, unknown> | undefined;

// Astro v6 + Cloudflare: las vars/secrets del dashboard se leen desde
// "cloudflare:workers". En local (astro dev / scripts tsx) ese módulo no existe,
// así que caemos a process.env / import.meta.env (.env).
async function obtenerEnv(): Promise<EnvLike> {
  try {
    const mod: any = await import(/* @vite-ignore */ "cloudflare:workers");
    if (mod?.env) return mod.env as EnvLike;
  } catch {
    // no estamos en el runtime de Cloudflare
  }
  return undefined;
}

function leer(env: EnvLike, key: string): string | undefined {
  const v =
    env?.[key] ??
    (globalThis as any)?.process?.env?.[key] ??
    (import.meta.env as Record<string, unknown>)?.[key];
  return v == null ? undefined : String(v);
}

const BREVO_CONTACTS = "https://api.brevo.com/v3/contacts";

export type ResultadoBrevo = "ok" | "sin-config" | "error";

async function brevoConfig() {
  const env = await obtenerEnv();
  const apiKey = leer(env, "BREVO_API_KEY");
  const listId = parseInt(leer(env, "BREVO_LIST_ID") ?? "", 10);
  return { apiKey, listId, ok: Boolean(apiKey) && Number.isInteger(listId) };
}

// Crea (o actualiza) el contacto en la lista configurada. `updateEnabled: true`
// evita el error si el contacto ya existía: lo suma a la lista igual.
export async function agregarContactoBrevo(email: string): Promise<ResultadoBrevo> {
  const { apiKey, listId, ok } = await brevoConfig();
  if (!ok) return "sin-config";

  try {
    const res = await fetch(BREVO_CONTACTS, {
      method: "POST",
      headers: {
        "api-key": apiKey!,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true }),
    });
    if (res.ok) return "ok"; // 201 creado / 204 actualizado
    console.error("[brevo] respuesta", res.status, await res.text());
    return "error";
  } catch (e) {
    console.error("[brevo] error al agregar contacto:", e);
    return "error";
  }
}

// Saca el contacto de la lista (no borra el contacto de Brevo, solo lo quita
// de la lista del newsletter). Best-effort.
export async function quitarContactoBrevo(email: string): Promise<ResultadoBrevo> {
  const { apiKey, listId, ok } = await brevoConfig();
  if (!ok) return "sin-config";

  try {
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts/remove`, {
      method: "POST",
      headers: {
        "api-key": apiKey!,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ emails: [email] }),
    });
    if (res.ok) return "ok";
    console.error("[brevo] quitar respuesta", res.status, await res.text());
    return "error";
  } catch (e) {
    console.error("[brevo] error al quitar contacto:", e);
    return "error";
  }
}
