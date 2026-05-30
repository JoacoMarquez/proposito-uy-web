// Capa de acceso a datos. Las páginas y el panel leen el contenido desde acá.

import { db } from "./index";
import { productos, presentaciones, categorias, recetas, preguntas } from "./schema";
import { asc, eq } from "drizzle-orm";
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
  return (await getProductos()).filter((p) => p.categoriaSlug === cat);
}

export async function getDestacados(): Promise<ProductoFull[]> {
  return (await getProductos()).filter((p) => p.destacado);
}

// ── Categorías ──
export async function getCategorias(): Promise<Categoria[]> {
  return db.select().from(categorias).orderBy(asc(categorias.orden));
}

export async function getCategoria(slug: string): Promise<Categoria | undefined> {
  const [c] = await db.select().from(categorias).where(eq(categorias.slug, slug)).limit(1);
  return c;
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
