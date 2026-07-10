import { defineMiddleware } from "astro:middleware";
import { validarSesionCliente, CLIENTE_COOKIE } from "./lib/cliente-auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;

  // Sesión de cliente (solo si hay cookie → no consulta la base en el build/prerender).
  const clienteToken = cookies.get(CLIENTE_COOKIE)?.value;
  const cliente = clienteToken ? await validarSesionCliente(clienteToken) : null;
  context.locals.cliente = cliente
    ? { id: cliente.id, email: cliente.email, nombre: cliente.nombre }
    : null;

  // Login unificado: el admin es un cliente con permiso `esAdmin`. La misma
  // sesión de cliente determina el acceso al panel; no hay login aparte.
  context.locals.adminUser = cliente?.esAdmin ? { id: cliente.id, email: cliente.email } : null;

  // Protección del panel /admin: requiere sesión de cliente con permiso admin.
  if (url.pathname.startsWith("/admin") && !context.locals.adminUser) {
    return context.redirect("/cuenta/login");
  }

  return next();
});
