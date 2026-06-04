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

  // Protección del panel /admin.
  if (url.pathname.startsWith("/admin")) {
    const esLogin = url.pathname === "/admin/login";
    const token = cookies.get(SESSION_COOKIE)?.value;
    const user = await validateToken(token);
    context.locals.adminUser = user ? { id: user.id, email: user.email } : null;

    if (!user && !esLogin) return context.redirect("/admin/login");
    if (user && esLogin) return context.redirect("/admin");
  }

  return next();
});
