import { defineMiddleware } from "astro:middleware";
import { validateToken, SESSION_COOKIE } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies } = context;

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
