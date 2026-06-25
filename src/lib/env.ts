// Lectura uniforme de variables de entorno / secrets entre el runtime de
// Cloudflare Workers (Astro v6: los secrets vienen de "cloudflare:workers") y
// el entorno local (astro dev / scripts tsx: process.env / import.meta.env / .env).
//
// En el Worker, process.env NO trae los secrets del dashboard; hay que leerlos
// del módulo "cloudflare:workers". Centralizar esto acá evita que cada módulo
// que use secrets (mail, brevo, …) se olvide de soportar ambos entornos.

type EnvLike = Record<string, unknown> | undefined;

// Devuelve el objeto `env` del runtime de Cloudflare, o undefined si no estamos
// dentro del Worker (local). El import es dinámico porque el módulo no existe
// fuera del runtime de Cloudflare.
export async function obtenerEnv(): Promise<EnvLike> {
  try {
    const mod: any = await import(/* @vite-ignore */ "cloudflare:workers");
    if (mod?.env) return mod.env as EnvLike;
  } catch {
    // no estamos en el runtime de Cloudflare
  }
  return undefined;
}

// Lee una clave priorizando el env de Cloudflare y cayendo a process.env /
// import.meta.env. Devuelve undefined si no está definida en ningún lado.
export function leerEnv(env: EnvLike, key: string): string | undefined {
  const v =
    env?.[key] ??
    (globalThis as any)?.process?.env?.[key] ??
    (import.meta.env as Record<string, unknown>)?.[key];
  return v == null ? undefined : String(v);
}
