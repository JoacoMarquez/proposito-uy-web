import type { APIRoute } from "astro";
import { invalidateToken, SESSION_COOKIE } from "../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE)?.value;
  await invalidateToken(token);
  cookies.delete(SESSION_COOKIE, { path: "/" });
  return redirect("/admin/login");
};
