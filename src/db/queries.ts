// Capa de acceso a datos. Las páginas y el panel leen el contenido desde acá.

import { db } from "./index";
import { productos, presentaciones, categorias, recetas, preguntas, pedidos, pedidoItems, suscriptores, imagenes, paginas } from "./schema";
import { esquemaDePagina } from "./paginas-esquema";
import { asc, desc, eq } from "drizzle-orm";
import type { Producto, Presentacion, Categoria, Receta, Pregunta } from "./schema";

export type { Categoria, Receta, Pregunta } from "./schema";
export type ProductoFull = Producto & { presentaciones: Presentacion[] };

// ── Productos ──
export async function getProductos(): Promise<ProductoFull[]> {
  const [prods, pres] = await Promise.all([
    db.select().from(productos).orderBy(asc(productos.orden)),
    db.select().from(presentaciones).orderBy(asc(presentaciones.orden)),
  ]);
  return prods.map((p) => ({
    ...p,
    presentaciones: pres.filter((x) => x.productoId === p.id),
  }));
}

export async function getProducto(slug: string): Promise<ProductoFull | undefined> {
  const [p] = await db.select().from(productos).where(eq(productos.slug, slug)).limit(1);
  if (!p) return undefined;
  const pres = await db
    .select()
    .from(presentaciones)
    .where(eq(presentaciones.productoId, p.id))
    .orderBy(asc(presentaciones.orden));
  return { ...p, presentaciones: pres };
}

export async function getProductosPorCategoria(cat: string): Promise<ProductoFull[]> {
  // En la tienda pública se ordenan por `ordenCategoria` (reordenable desde el
  // panel), independiente del orden global usado en "Los más pedidos".
  return (await getProductos())
    .filter((p) => p.categoriaSlug === cat)
    .sort((a, b) => a.ordenCategoria - b.ordenCategoria);
}

// Guarda el orden de los productos dentro de una categoría (arrastre en el
// panel). `idsEnOrden` = ids en el orden deseado; se les asigna 0..n en
// `ordenCategoria`, sin tocar el orden global ni otras categorías.
export async function actualizarOrdenCategoria(idsEnOrden: number[]): Promise<void> {
  await Promise.all(
    idsEnOrden.map((id, i) =>
      db.update(productos).set({ ordenCategoria: i }).where(eq(productos.id, id)),
    ),
  );
}

export async function getDestacados(): Promise<ProductoFull[]> {
  return (await getProductos()).filter((p) => p.destacado);
}

// Reordena SOLO los destacados ("Los más pedidos" del inicio) entre sí.
// Permuta entre ellos los valores de `orden` que ya ocupan, sin tocar el resto
// del catálogo: cada producto no destacado conserva su orden, y los destacados
// quedan en la secuencia recibida (idsEnOrden = ids en el orden deseado).
export async function actualizarOrdenDestacados(idsEnOrden: number[]): Promise<void> {
  const dest = await db
    .select({ id: productos.id, orden: productos.orden })
    .from(productos)
    .where(eq(productos.destacado, true));
  const slots = dest.map((d) => d.orden).sort((a, b) => a - b);
  await Promise.all(
    idsEnOrden.map((id, i) =>
      slots[i] === undefined
        ? Promise.resolve()
        : db.update(productos).set({ orden: slots[i] }).where(eq(productos.id, id)),
    ),
  );
}

// ── Categorías ──
export async function getCategorias(): Promise<Categoria[]> {
  return db.select().from(categorias).orderBy(asc(categorias.orden));
}

export async function getCategoria(slug: string): Promise<Categoria | undefined> {
  const [c] = await db.select().from(categorias).where(eq(categorias.slug, slug)).limit(1);
  return c;
}

// Edición de contenido de una categoría (no se crean/eliminan: son fijas).
export interface CategoriaContenidoInput {
  nombre: string;
  descripcion: string;
  descripcionGeneral: string;
  caracteristicas: string[];
  notasCreador: string[];
  imagen: string | null;
}

export async function actualizarCategoria(slug: string, data: CategoriaContenidoInput): Promise<void> {
  await db.update(categorias).set(data).where(eq(categorias.slug, slug));
}

// ── Recetas ──
export async function getRecetas(): Promise<Receta[]> {
  return db.select().from(recetas).orderBy(asc(recetas.orden));
}

export async function getReceta(slug: string): Promise<Receta | undefined> {
  const [r] = await db.select().from(recetas).where(eq(recetas.slug, slug)).limit(1);
  return r;
}

// ── Preguntas ──
export async function getPreguntas(): Promise<Pregunta[]> {
  return db.select().from(preguntas).orderBy(asc(preguntas.orden));
}

export const TEMAS_PREGUNTA = ["pedidos", "elaboracion", "nutricional"] as const;

export interface PreguntaInput {
  tema: string;
  pregunta: string;
  microResumen: string;
  desarrollo: string[];
  orden: number;
}

export async function getPreguntaById(id: number): Promise<Pregunta | undefined> {
  const [p] = await db.select().from(preguntas).where(eq(preguntas.id, id)).limit(1);
  return p;
}

export async function upsertPregunta(id: number | null, data: PreguntaInput): Promise<number> {
  if (id) {
    await db.update(preguntas).set(data).where(eq(preguntas.id, id));
    return id;
  }
  const [p] = await db.insert(preguntas).values(data).returning({ id: preguntas.id });
  return p.id;
}

export async function deletePregunta(id: number): Promise<void> {
  await db.delete(preguntas).where(eq(preguntas.id, id));
}

// ── Mutaciones (panel admin) ──
export interface ProductoInput {
  slug: string;
  nombre: string;
  variante: string;
  categoriaSlug: string;
  descripcion: string;
  textoInformativo: string | null;
  ingredientes: string;
  packaging: string;
  conservacion: string;
  uso: string | null;
  vencimiento: string;
  tamanoUnitario: string | null;
  contenido: string | null;
  nota: string | null;
  productoAliadoSlug: string | null;
  destacado: boolean;
  disponible: boolean;
  imagen: string | null;
  imagen2: string | null;
}

export async function getProductoById(id: number): Promise<ProductoFull | undefined> {
  const [p] = await db.select().from(productos).where(eq(productos.id, id)).limit(1);
  if (!p) return undefined;
  const pres = await db
    .select()
    .from(presentaciones)
    .where(eq(presentaciones.productoId, id))
    .orderBy(asc(presentaciones.orden));
  return { ...p, presentaciones: pres };
}

export async function upsertProducto(
  id: number | null,
  data: ProductoInput,
  pres: { label: string; precio: number; frascosGratis: number | null }[],
): Promise<number> {
  let prodId = id;
  if (id) {
    await db.update(productos).set(data).where(eq(productos.id, id));
  } else {
    const [r] = await db.insert(productos).values(data).returning({ id: productos.id });
    prodId = r.id;
  }
  await db.delete(presentaciones).where(eq(presentaciones.productoId, prodId!));
  if (pres.length) {
    await db.insert(presentaciones).values(
      pres.map((p, i) => ({
        productoId: prodId!,
        label: p.label,
        precio: p.precio,
        frascosGratis: p.frascosGratis,
        orden: i,
      })),
    );
  }
  return prodId!;
}

export async function deleteProducto(id: number): Promise<void> {
  await db.delete(productos).where(eq(productos.id, id));
}

export interface RecetaInput {
  slug: string;
  titulo: string;
  descripcion: string;
  productosAliados: string[];
  almacenamientoEnvase: string | null;
  almacenamientoVidaUtil: string | null;
  rendimiento: Record<string, any> | null;
  ingredientes: string[];
  procedimiento: string[];
  materiales: string[];
  notas: string[];
  imagen: string | null;
  imagen2: string | null;
  orden: number;
}

export async function getRecetaById(id: number): Promise<Receta | undefined> {
  const [r] = await db.select().from(recetas).where(eq(recetas.id, id)).limit(1);
  return r;
}

// Guarda el nuevo orden de varias recetas (reordenamiento por arrastre).
export async function actualizarOrdenRecetas(ordenes: { id: number; orden: number }[]): Promise<void> {
  await Promise.all(
    ordenes.map((o) => db.update(recetas).set({ orden: o.orden }).where(eq(recetas.id, o.id))),
  );
}

export async function upsertReceta(id: number | null, data: RecetaInput): Promise<number> {
  if (id) {
    await db.update(recetas).set(data).where(eq(recetas.id, id));
    return id;
  }
  const [r] = await db.insert(recetas).values(data).returning({ id: recetas.id });
  return r.id;
}

export async function deleteReceta(id: number): Promise<void> {
  await db.delete(recetas).where(eq(recetas.id, id));
}

// ── Pedidos ──
export interface NuevoPedido {
  nombre: string;
  celular: string;
  email: string;
  direccion: string | null;
  notas: string | null;
  modalidad: string;
  agenda: string;
  fechaAgenda: string | null;
  metodoPago: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  clienteId?: number | null;
}
export interface ItemPedido {
  productoSlug: string;
  nombre: string;
  presentacion: string;
  precioUnitario: number;
  cantidad: number;
}

// Próximo número de pedido correlativo "P-N". N arranca en el "número inicial"
// configurable (Contenido → Tienda) y sigue desde el mayor correlativo ya usado.
export async function proximoNumeroPedido(): Promise<string> {
  const tienda = await getContenido("tienda");
  const inicial = Math.max(1, parseInt(String(tienda.pedidoNumeroInicial ?? "1"), 10) || 1);
  const filas = await db.select({ numero: pedidos.numero }).from(pedidos);
  let maxN = inicial - 1;
  for (const f of filas) {
    const m = /^P-(\d+)$/.exec(f.numero);
    if (m) maxN = Math.max(maxN, parseInt(m[1], 10));
  }
  return "P-" + (maxN + 1);
}

export async function crearPedido(data: NuevoPedido, items: ItemPedido[]): Promise<string> {
  // Reintenta si dos pedidos casi simultáneos calculan el mismo número (unique).
  for (let intento = 0; intento < 5; intento++) {
    const numero = await proximoNumeroPedido();
    try {
      const [row] = await db.insert(pedidos).values({ numero, ...data }).returning({ id: pedidos.id });
      await db.insert(pedidoItems).values(items.map((i) => ({ pedidoId: row.id, ...i })));
      return numero;
    } catch (e: any) {
      const colision = e?.code === "23505" || /unique|duplicad|duplicate/i.test(String(e?.message ?? ""));
      if (!colision || intento === 4) throw e;
    }
  }
  throw new Error("No se pudo generar el número de pedido.");
}

export async function getPedidoByNumero(numero: string) {
  const [p] = await db.select().from(pedidos).where(eq(pedidos.numero, numero)).limit(1);
  if (!p) return undefined;
  const items = await db.select().from(pedidoItems).where(eq(pedidoItems.pedidoId, p.id));
  return { ...p, items };
}

export async function getPedidos() {
  return db.select().from(pedidos).orderBy(desc(pedidos.id));
}

export async function getPedidoById(id: number) {
  const [p] = await db.select().from(pedidos).where(eq(pedidos.id, id)).limit(1);
  if (!p) return undefined;
  const items = await db.select().from(pedidoItems).where(eq(pedidoItems.pedidoId, p.id));
  return { ...p, items };
}

export const ESTADOS_PEDIDO = ["pendiente", "confirmado", "entregado", "cancelado"] as const;
export const ESTADOS_PAGO = ["pendiente", "pagado"] as const;

export async function actualizarEstadoPedido(id: number, estado: string) {
  await db.update(pedidos).set({ estado }).where(eq(pedidos.id, id));
}

export async function actualizarEstadoPago(id: number, estadoPago: string) {
  await db.update(pedidos).set({ estadoPago }).where(eq(pedidos.id, id));
}

// Elimina un pedido (para borrar pruebas, duplicados o cargas por error).
// Los pedido_items se borran en cascada (FK onDelete: "cascade"). (PROP-110)
export async function eliminarPedido(id: number): Promise<void> {
  await db.delete(pedidos).where(eq(pedidos.id, id));
}

// ── Contenido editable de páginas (CMS liviano) ──
// Mezcla los defaults del esquema (los literales actuales) con lo guardado en la
// tabla `paginas`. Toda clave no guardada cae a su default → nada se rompe aunque
// la tabla esté vacía. Las páginas .astro llaman getContenido("inicio"), etc.
export async function getContenido(slug: string): Promise<Record<string, any>> {
  const defaults = esquemaDePagina(slug)?.defaults ?? {};
  const [row] = await db.select().from(paginas).where(eq(paginas.slug, slug)).limit(1);
  const guardado = (row?.bloques as Record<string, unknown> | undefined) ?? {};
  return { ...defaults, ...guardado };
}

// Guarda (o actualiza) el contenido de una página. Upsert por slug
// (onConflictDoUpdate). Llamado desde /admin/contenido/[slug].
export async function upsertPagina(slug: string, bloques: Record<string, unknown>): Promise<void> {
  await db
    .insert(paginas)
    .values({ slug, bloques })
    .onConflictDoUpdate({ target: paginas.slug, set: { bloques, actualizadoEn: new Date() } });
}

// ── Newsletter ──
// Inserta el suscriptor. Devuelve "duplicado" si el email ya estaba registrado.
export async function suscribirNewsletter(email: string): Promise<"ok" | "duplicado"> {
  const [row] = await db
    .insert(suscriptores)
    .values({ email: email.trim().toLowerCase() })
    .onConflictDoNothing({ target: suscriptores.email })
    .returning({ id: suscriptores.id });
  return row ? "ok" : "duplicado";
}

export async function estaSuscripto(email: string): Promise<boolean> {
  const [row] = await db
    .select({ id: suscriptores.id })
    .from(suscriptores)
    .where(eq(suscriptores.email, email.trim().toLowerCase()))
    .limit(1);
  return Boolean(row);
}

export async function desuscribirNewsletter(email: string): Promise<void> {
  await db.delete(suscriptores).where(eq(suscriptores.email, email.trim().toLowerCase()));
}

// ── Imágenes (subidas desde el panel, guardadas en la base) ──
// Tipos permitidos y tamaño máximo del archivo subido (validación compartida
// entre el form del panel y, si hiciera falta, otros llamadores).
export const IMAGEN_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"] as const;
export const IMAGEN_MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export async function guardarImagen(dataBase64: string, mime: string): Promise<number> {
  const [row] = await db.insert(imagenes).values({ data: dataBase64, mime }).returning({ id: imagenes.id });
  return row.id;
}

export async function getImagen(id: number): Promise<{ data: string; mime: string } | undefined> {
  const [row] = await db
    .select({ data: imagenes.data, mime: imagenes.mime })
    .from(imagenes)
    .where(eq(imagenes.id, id))
    .limit(1);
  return row;
}

// ── Helpers (puros) ──
export function nombreCompleto(p: { nombre: string; variante: string }): string {
  return `${p.nombre} | ${p.variante}`;
}

export function precioDesde(p: ProductoFull): number {
  return Math.min(...p.presentaciones.map((pr) => pr.precio));
}

export function formatoPrecio(precio: number): string {
  return `$U${precio.toLocaleString("es-UY")}`;
}

// ── Retornables ──
// Precio equivalente por unidad aprovechando la devolución: devolviendo
// `frascos` envases recibís 1 unidad gratis, así que por cada `frascos + 1`
// unidades pagás solo `frascos`. Efectivo = precio · frascos / (frascos + 1).
export function precioRetornable(precio: number, frascos: number): number {
  if (frascos <= 0) return precio;
  return Math.round((precio * frascos) / (frascos + 1));
}

// ¿El producto tiene al menos una presentación retornable?
export function esRetornable(p: ProductoFull): boolean {
  return p.presentaciones.some((pr) => pr.frascosGratis != null && pr.frascosGratis > 0);
}

export interface FilaRetornable {
  producto: string; // "Crema | Cajú - 330 g"
  frascos: number;
}

// Arma la grilla de retornabilidad automáticamente desde los productos: una
// fila por cada presentación que tenga `frascosGratis` cargado. Reemplaza la
// tabla que antes se mantenía a mano en el panel. Se ordena de menor a mayor
// cantidad de frascos (y por nombre a igual cantidad, para que sea estable).
export async function getGrillaRetornables(): Promise<FilaRetornable[]> {
  const prods = await getProductos();
  const filas: FilaRetornable[] = [];
  for (const p of prods) {
    for (const pr of p.presentaciones) {
      if (pr.frascosGratis != null && pr.frascosGratis > 0) {
        filas.push({ producto: `${nombreCompleto(p)} - ${pr.label}`, frascos: pr.frascosGratis });
      }
    }
  }
  return filas.sort(
    (a, b) => a.frascos - b.frascos || a.producto.localeCompare(b.producto, "es"),
  );
}
