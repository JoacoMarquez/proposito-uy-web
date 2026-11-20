// PDFs de Cultivo en Cloudflare R2 (binding `ARCHIVOS`, bucket privado
// "proposito-archivos"). Solo el Worker lee y escribe el bucket, y cada
// operación pasa por acá para contarla y cortar antes de salir del plan
// gratis (topes en ./archivos-limites.ts).
//
// En `astro dev` el adapter de Cloudflare simula el bucket en local
// (.wrangler/state), así que todo funciona sin tocar el R2 real.

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { and, eq, isNotNull, sql, sum } from "drizzle-orm";
import { db } from "../db";
import { descargas, productos, usoArchivos } from "../db/schema";
import { obtenerEnv } from "./env";
import { DESCARGAS_POR_LINK, TOPE_MES, mesActual, validarPdf, type TipoOperacion } from "./archivos-limites";

// Tipado mínimo del binding de R2 (evita depender de @cloudflare/workers-types).
interface R2ObjectBody {
  arrayBuffer(): Promise<ArrayBuffer>;
}
interface R2Bucket {
  put(key: string, value: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
}

export async function bucket(): Promise<R2Bucket | null> {
  const env = await obtenerEnv();
  return ((env as any)?.ARCHIVOS as R2Bucket | undefined) ?? null;
}

// ── Contadores ──

export async function usoDelMes(): Promise<{ escrituras: number; lecturas: number }> {
  const [row] = await db.select().from(usoArchivos).where(eq(usoArchivos.mes, mesActual())).limit(1);
  return { escrituras: row?.escrituras ?? 0, lecturas: row?.lecturas ?? 0 };
}

// Suma una operación al contador del mes. Devuelve false (y no suma) si ya se
// llegó al tope: el llamador NO debe hacer la operación contra R2.
export async function registrarOperacion(tipo: TipoOperacion): Promise<boolean> {
  const mes = mesActual();
  const tope = TOPE_MES[tipo];
  const col = usoArchivos[tipo];
  // Insert-or-increment condicionado al tope, en una sola sentencia.
  const filas = await db
    .insert(usoArchivos)
    .values({ mes, [tipo]: 1 })
    .onConflictDoUpdate({
      target: usoArchivos.mes,
      set: { [tipo]: sql`${col} + 1` },
      setWhere: sql`${col} < ${tope}`,
    })
    .returning({ mes: usoArchivos.mes });
  return filas.length > 0;
}

// Espacio ocupado: la suma de los PDFs asociados a productos (cada producto
// tiene a lo sumo uno, y al reemplazarlo se borra el anterior del bucket).
export async function almacenamientoUsado(): Promise<number> {
  const [row] = await db.select({ total: sum(productos.archivoBytes) }).from(productos);
  return Number(row?.total ?? 0);
}

// ── Subida / borrado (panel) ──

export interface ResultadoPdf {
  archivo: { key: string; nombre: string; bytes: number } | null; // null = no se subió nada
  error?: string;
}

// Lee el PDF del campo `campo` del form, valida topes y lo sube a R2.
// `actual` = PDF que ya tenía el producto (cuenta como espacio que se libera).
// NO borra el anterior: el llamador lo hace recién cuando guardó el producto.
export async function procesarPdfSubido(
  form: FormData,
  actual: { key: string | null; bytes: number | null } | null,
  campo = "archivoFile",
): Promise<ResultadoPdf> {
  const file = form.get(campo);
  if (!(file instanceof File) || file.size === 0) return { archivo: null };

  const r2 = await bucket();
  if (!r2) return { archivo: null, error: "El almacenamiento de archivos (R2) todavía no está configurado." };

  const datos = await file.arrayBuffer();
  const [usado, uso] = await Promise.all([almacenamientoUsado(), usoDelMes()]);
  const error = validarPdf({
    size: datos.byteLength,
    cabecera: new Uint8Array(datos.slice(0, 8)),
    usadoBytes: usado,
    reemplazaBytes: actual?.bytes ?? 0,
    escriturasMes: uso.escrituras,
  });
  if (error) return { archivo: null, error };
  if (!(await registrarOperacion("escrituras"))) {
    return { archivo: null, error: "Se alcanzó el tope mensual de subidas. Probá de nuevo el mes que viene." };
  }

  const key = `pdf/${randomUUID()}.pdf`;
  await r2.put(key, datos, { httpMetadata: { contentType: "application/pdf" } });
  return { archivo: { key, nombre: file.name || "documento.pdf", bytes: datos.byteLength } };
}

// Borrar no cuenta para el plan (las eliminaciones de R2 son gratis).
export async function borrarPdf(key: string | null | undefined): Promise<void> {
  if (!key) return;
  const r2 = await bucket();
  try {
    await r2?.delete(key);
  } catch (e) {
    console.error("[archivos] no se pudo borrar", key, e);
  }
}

// ── Links de descarga ──

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

// Crea un link de descarga para un producto de un pedido. Devuelve el token en
// claro (va en el mail); en la base queda solo su hash.
export async function crearDescarga(pedidoId: number, productoId: number): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await db.insert(descargas).values({ tokenHash: hashToken(token), pedidoId, productoId });
  return token;
}

export type ResultadoDescarga =
  | { ok: true; key: string; nombre: string | null }
  | { ok: false; motivo: "no-existe" | "agotado" };

// Valida el token y consume un uso del link (atómico: no se pasa del tope).
export async function consumirDescarga(token: string): Promise<ResultadoDescarga> {
  if (!/^[\w-]{20,64}$/.test(token)) return { ok: false, motivo: "no-existe" };
  const tokenHash = hashToken(token);
  const [fila] = await db
    .select({ id: descargas.id, usos: descargas.usos, key: productos.archivoKey, nombre: productos.archivoNombre })
    .from(descargas)
    .innerJoin(productos, eq(productos.id, descargas.productoId))
    .where(and(eq(descargas.tokenHash, tokenHash), isNotNull(productos.archivoKey)))
    .limit(1);
  if (!fila?.key) return { ok: false, motivo: "no-existe" };
  const usados = await db
    .update(descargas)
    .set({ usos: sql`${descargas.usos} + 1` })
    .where(and(eq(descargas.id, fila.id), sql`${descargas.usos} < ${DESCARGAS_POR_LINK}`))
    .returning({ usos: descargas.usos });
  if (usados.length === 0) return { ok: false, motivo: "agotado" };
  return { ok: true, key: fila.key, nombre: fila.nombre };
}
