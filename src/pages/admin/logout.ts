import type { APIRoute } from "astro";

export const prerender = false;

// Login unificado: cerrar sesión de admin = cerrar la sesión de cliente.
export const GET: APIRoute = async ({ redirect }) => redirect("/cuenta/logout");
