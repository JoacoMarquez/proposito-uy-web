import { defineMiddleware } from "astro:middleware";
import { validateToken, SESSION_COOKIE } from "./lib/auth";
import { validarSesionCliente, CLIENTE_COOKIE } from "./lib/cliente-auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;

  // Sesión de cliente (solo si hay cookie → no consulta la base en el build/prerender).
  const clienteToken = cookies.get(CLIENTE_COOKIE)?.value;
  const cliente = clienteToken ? await validarSesionCliente(clienteToken) : null;
  context.locals.cliente = cliente
    ? { id: cliente.id, email: cliente.email, nombre: cliente.nombre }
    : null;

  // Sesión de admin: se valida siempre que exista la cookie (una sola consulta,
  // y solo para quien la tiene). Así el sitio público puede ofrecer un acceso
  // directo al panel a los administradores logueados, sin costo para el resto.
  const adminToken = cookies.get(SESSION_COOKIE)?.value;
  const adminUser = adminToken ? await validateToken(adminToken) : null;
  context.locals.adminUser = adminUser ? { id: adminUser.id, email: adminUser.email } : null;

  // Protección del panel /admin.
  if (url.pathname.startsWith("/admin")) {
    // Páginas públicas del panel: login y recuperación de contraseña.
    const esPublica =
      url.pathname === "/admin/login" ||
      url.pathname === "/admin/recuperar" ||
      url.pathname === "/admin/restablecer";

    if (!adminUser && !esPublica) return context.redirect("/admin/login");
    if (adminUser && url.pathname === "/admin/login") return context.redirect("/admin");
  }

  return next();
});
