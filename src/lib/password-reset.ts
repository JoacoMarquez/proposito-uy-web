// "Olvidé mi contraseña" para admin y cliente. Genera un token de un solo uso
// (guardamos solo su hash), con vencimiento, y permite fijar una contraseña nueva.

import { randomBytes, createHash } from "node:crypto";
import { eq, and, isNull, gt } from "drizzle-orm";
import { db } from "../db";
import {
  passwordResets,
  adminUsers,
  adminSessions,
  clientes,
  clienteSessions,
} from "../db/schema";
import { hashPassword } from "./auth";

export type TipoCuenta = "admin" | "cliente";
const VENCIMIENTO_MIN = 60; // el link vale 1 hora

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function existeCuenta(tipo: TipoCuenta, email: string): Promise<boolean> {
  if (tipo === "admin") {
    const [u] = await db.select({ id: adminUsers.id }).from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    return Boolean(u);
  }
  const [c] = await db.select({ id: clientes.id }).from(clientes).where(eq(clientes.email, email)).limit(1);
  return Boolean(c);
}

// Crea un token si la cuenta existe. Devuelve el token en claro (para el link) o
// null si no hay cuenta con ese email (el llamador igual muestra mensaje genérico).
export async function crearReset(tipo: TipoCuenta, emailRaw: string): Promise<string | null> {
  const email = emailRaw.trim().toLowerCase();
  if (!email || !(await existeCuenta(tipo, email))) return null;
  const token = randomBytes(32).toString("hex");
  const expiraEn = new Date(Date.now() + VENCIMIENTO_MIN * 60 * 1000);
  await db.insert(passwordResets).values({ tipo, email, tokenHash: hashToken(token), expiraEn });
  return token;
}

// Devuelve el reset válido (no usado, no vencido) o null.
export async function validarReset(token: string) {
  if (!token) return null;
  const [r] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.tokenHash, hashToken(token)),
        isNull(passwordResets.usadoEn),
        gt(passwordResets.expiraEn, new Date()),
      ),
    )
    .limit(1);
  return r ?? null;
}

// Fija la contraseña nueva, marca el token como usado e invalida las sesiones
// existentes de esa cuenta. Devuelve el tipo de cuenta o un error.
export async function consumirReset(
  token: string,
  nuevaPassword: string,
): Promise<{ tipo?: TipoCuenta; error?: string }> {
  if (!nuevaPassword || nuevaPassword.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }
  const r = await validarReset(token);
  if (!r) return { error: "El enlace no es válido o ya venció. Pedí uno nuevo." };

  const passwordHash = await hashPassword(nuevaPassword);
  if (r.tipo === "admin") {
    const [u] = await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.email, r.email)).returning({ id: adminUsers.id });
    if (u) await db.delete(adminSessions).where(eq(adminSessions.userId, u.id));
  } else {
    const [c] = await db.update(clientes).set({ passwordHash }).where(eq(clientes.email, r.email)).returning({ id: clientes.id });
    if (c) await db.delete(clienteSessions).where(eq(clienteSessions.clienteId, c.id));
  }
  await db.update(passwordResets).set({ usadoEn: new Date() }).where(eq(passwordResets.id, r.id));
  return { tipo: r.tipo as TipoCuenta };
}

// HTML simple del mail de reseteo.
export function htmlMailReset(link: string): string {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1f2a24">
    <h2 style="color:#3a4a3f">Restablecer tu contraseña</h2>
    <p>Recibimos un pedido para restablecer la contraseña de tu cuenta en Propósito UY.</p>
    <p style="margin:24px 0">
      <a href="${link}" style="background:#3a4a3f;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none">Crear nueva contraseña</a>
    </p>
    <p style="font-size:13px;color:#6b7770">El enlace vence en 1 hora. Si no pediste esto, podés ignorar este mail.</p>
    <p style="font-size:12px;color:#9aa39d;word-break:break-all">${link}</p>
  </div>`;
}
