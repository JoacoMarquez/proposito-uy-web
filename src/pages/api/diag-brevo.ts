import type { APIRoute } from "astro";

export const prerender = false;

// Diagnóstico temporal: indica desde qué fuente se leen las variables de Brevo
// en producción. NO expone valores secretos (solo presencia y el List ID).
export const GET: APIRoute = ({ locals }) => {
  const r = ((locals as any)?.runtime?.env ?? {}) as Record<string, unknown>;
  const has = (o: Record<string, unknown>, k: string) => Boolean(o?.[k]);
  const im = import.meta.env as Record<string, unknown>;
  const body = {
    runtime: { apiKey: has(r, "BREVO_API_KEY"), listId: has(r, "BREVO_LIST_ID"), listVal: r?.BREVO_LIST_ID ?? null },
    processEnv: { apiKey: !!process.env.BREVO_API_KEY, listId: !!process.env.BREVO_LIST_ID },
    importMeta: { apiKey: has(im, "BREVO_API_KEY"), listId: has(im, "BREVO_LIST_ID") },
    // nombres presentes en el runtime (para detectar typos), sin valores
    runtimeKeysRelevantes: Object.keys(r).filter((k) => /BREVO|DATABASE|RESEND|MAIL/i.test(k)),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
