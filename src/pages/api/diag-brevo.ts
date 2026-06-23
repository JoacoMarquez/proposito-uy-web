import type { APIRoute } from "astro";

export const prerender = false;

// Diagnóstico temporal: de dónde se leen las vars de Brevo. No expone valores.
export const GET: APIRoute = async () => {
  const out: Record<string, unknown> = {};
  try {
    const mod: any = await import(/* @vite-ignore */ "cloudflare:workers");
    const r = (mod?.env ?? {}) as Record<string, unknown>;
    out.cfWorkers = {
      apiKey: Boolean(r.BREVO_API_KEY),
      listId: Boolean(r.BREVO_LIST_ID),
      listVal: r.BREVO_LIST_ID ?? null,
    };
    out.cfWorkersKeys = Object.keys(r).filter((k) => /BREVO|DATABASE|RESEND|MAIL/i.test(k));
  } catch (e) {
    out.cfWorkersError = String(e);
  }
  try {
    const pe = (globalThis as any)?.process?.env;
    out.processEnv = {
      existe: Boolean(pe),
      apiKey: Boolean(pe?.BREVO_API_KEY),
      listId: Boolean(pe?.BREVO_LIST_ID),
      database: Boolean(pe?.DATABASE_URL),
    };
  } catch (e) {
    out.processError = String(e);
  }
  try {
    const im = import.meta.env as Record<string, unknown>;
    out.importMeta = { apiKey: Boolean(im?.BREVO_API_KEY), listId: Boolean(im?.BREVO_LIST_ID) };
  } catch (e) {
    out.importMetaError = String(e);
  }
  return new Response(JSON.stringify(out, null, 2), {
    headers: { "Content-Type": "application/json" },
  });
};
