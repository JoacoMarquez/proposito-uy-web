// Autenticación del panel /admin: hash de contraseñas (scrypt) + sesiones por cookie.
// Sin dependencias externas: usa el módulo crypto nativo de Node.

import { scrypt, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { adminUsers, adminSessions } from "../db/schema";

const scryptAsync = promisify(scrypt);
export const SESSION_COOKIE = "admin_session";
const SESSION_DIAS = 30;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, "hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return keyBuf.length === buf.length && timingSafeEqual(keyBuf, buf);
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: number): Promise<{ token: string; expira: Date }> {
  const token = randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_DIAS);
  await db.insert(adminSessions).values({ id: hashToken(token), userId, expiraEn: expira });
  return { token, expira };
}

export async function validateToken(token: string | undefined) {
  if (!token) return null;
  const id = hashToken(token);
  const [s] = await db.select().from(adminSessions).where(eq(adminSessions.id, id)).limit(1);
  if (!s) return null;
  if (s.expiraEn < new Date()) {
    await db.delete(adminSessions).where(eq(adminSessions.id, id));
    return null;
  }
  const [u] = await db.select().from(adminUsers).where(eq(adminUsers.id, s.userId)).limit(1);
  return u ?? null;
}

export async function invalidateToken(token: string | undefined) {
  if (!token) return;
  await db.delete(adminSessions).where(eq(adminSessions.id, hashToken(token)));
}
