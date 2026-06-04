// Autenticación de cuentas de cliente (registro, login, sesiones por cookie).
// Reutiliza el hash de contraseñas (scrypt) de lib/auth.ts.

import { randomBytes, createHash } from "node:crypto";
import { eq, and, desc } from "drizzle-orm";
import { db } from "../db";
import { clientes, clienteSessions, pedidos, type Cliente } from "../db/schema";
import { hashPassword, verifyPassword } from "./auth";

export const CLIENTE_COOKIE = "cliente_session";
const SESSION_DIAS = 30;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function getClientePorEmail(email: string): Promise<Cliente | undefined> {
  const [c] = await db
    .select()
    .from(clientes)
    .where(eq(clientes.email, email.trim().toLowerCase()))
    .limit(1);
  return c;
}

export async function registrarCliente(data: {
  email: string;
  password: string;
  nombre: string;
  celular?: string | null;
}): Promise<{ cliente?: Cliente; error?: string }> {
  const email = data.email.trim().toLowerCase();
  if (!email || !data.password || !data.nombre) return { error: "Faltan datos." };
  if (data.password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres." };
  if (await getClientePorEmail(email)) return { error: "Ya existe una cuenta con ese email." };
  const passwordHash = await hashPassword(data.password);
  const [cliente] = await db
    .insert(clientes)
    .values({ email, passwordHash, nombre: data.nombre.trim(), celular: data.celular?.trim() || null })
    .returning();
  return { cliente };
}

export async function loginCliente(email: string, password: string): Promise<Cliente | null> {
  const cliente = await getClientePorEmail(email);
  if (!cliente || !(await verifyPassword(password, cliente.passwordHash))) return null;
  return cliente;
}

export async function crearSesionCliente(clienteId: number): Promise<{ token: string; expira: Date }> {
  const token = randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_DIAS);
  await db.insert(clienteSessions).values({ id: hashToken(token), clienteId, expiraEn: expira });
  return { token, expira };
}

export async function validarSesionCliente(token: string | undefined): Promise<Cliente | null> {
  if (!token) return null;
  const id = hashToken(token);
  const [s] = await db.select().from(clienteSessions).where(eq(clienteSessions.id, id)).limit(1);
  if (!s) return null;
  if (s.expiraEn < new Date()) {
    await db.delete(clienteSessions).where(eq(clienteSessions.id, id));
    return null;
  }
  const [c] = await db.select().from(clientes).where(eq(clientes.id, s.clienteId)).limit(1);
  return c ?? null;
}

export async function cerrarSesionCliente(token: string | undefined): Promise<void> {
  if (!token) return;
  await db.delete(clienteSessions).where(eq(clienteSessions.id, hashToken(token)));
}

// Actualiza datos del perfil (nombre, celular, direcciones).
export async function actualizarCliente(
  id: number,
  data: { nombre?: string; celular?: string | null; direcciones?: string[] },
): Promise<void> {
  await db.update(clientes).set(data).where(eq(clientes.id, id));
}

export async function getClientePorId(id: number): Promise<Cliente | undefined> {
  const [c] = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return c;
}

// Pedidos del cliente (más recientes primero).
export async function getPedidosDeCliente(clienteId: number) {
  return db.select().from(pedidos).where(eq(pedidos.clienteId, clienteId)).orderBy(desc(pedidos.id));
}

// Cambia la agenda de un pedido del cliente, solo si está pendiente. Devuelve true si actualizó.
export async function cambiarAgendaPedido(
  pedidoId: number,
  clienteId: number,
  agenda: string,
  fechaAgenda: string | null,
): Promise<boolean> {
  const r = await db
    .update(pedidos)
    .set({ agenda, fechaAgenda })
    .where(
      and(eq(pedidos.id, pedidoId), eq(pedidos.clienteId, clienteId), eq(pedidos.estado, "pendiente")),
    )
    .returning({ id: pedidos.id });
  return r.length > 0;
}
