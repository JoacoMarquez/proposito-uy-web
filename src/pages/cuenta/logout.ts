import type { APIRoute } from "astro";
import { cerrarSesionCliente, CLIENTE_COOKIE } from "../../lib/cliente-auth";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get(CLIENTE_COOKIE)?.value;
  await cerrarSesionCliente(token);
  cookies.delete(CLIENTE_COOKIE, { path: "/" });
  return redirect("/");
};
