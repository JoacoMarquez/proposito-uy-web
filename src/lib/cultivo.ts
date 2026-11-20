// Sección Cultivo: plantines, insumos y conocimiento (guías en PDF).
//
// Las categorías de Cultivo viven en la misma tabla `categorias` que las de la
// Tienda, diferenciadas por `seccion = "cultivo"`, y cada una tiene un `tipo`
// que define qué tarjetas informativas muestra la ficha y si lleva PDF.
// Lógica pura (sin DB) para poder testearla y usarla en cliente y servidor.

export type Seccion = "tienda" | "cultivo";
export type TipoCultivo = "plantines" | "insumos" | "conocimiento";

export const TIPOS_CULTIVO: TipoCultivo[] = ["plantines", "insumos", "conocimiento"];

export interface CampoEspecificacion {
  key: string;
  label: string;
  ayuda?: string;
}

// Las seis tarjetas informativas de la ficha, por tipo (consigna de Pedro).
export const ESPECIFICACIONES: Record<TipoCultivo, CampoEspecificacion[]> = {
  plantines: [
    { key: "especie", label: "Especie" },
    { key: "presentacion", label: "Presentación" },
    { key: "exposicionSolar", label: "Exposición solar" },
    { key: "riego", label: "Riego" },
    { key: "suelo", label: "Suelo" },
    { key: "trasplante", label: "Trasplante" },
  ],
  insumos: [
    { key: "materiales", label: "Materiales" },
    { key: "caracteristicas", label: "Características" },
    { key: "presentacion", label: "Presentación" },
    { key: "aplicacion", label: "Aplicación" },
    { key: "recomendaciones", label: "Recomendaciones" },
    { key: "informacionAdicional", label: "Información adicional" },
  ],
  conocimiento: [
    { key: "descripcion", label: "Descripción" },
    { key: "extension", label: "Extensión", ayuda: "Cantidad de páginas. Ej: 24 páginas." },
    { key: "idioma", label: "Idioma" },
    { key: "entrega", label: "Entrega" },
    { key: "version", label: "Versión" },
    { key: "aplicacion", label: "Aplicación" },
  ],
};

export function esTipoCultivo(v: unknown): v is TipoCultivo {
  return typeof v === "string" && (TIPOS_CULTIVO as string[]).includes(v);
}

// Tarjetas a mostrar en la ficha: las del tipo, en orden, solo las cargadas.
export function tarjetasEspecificacion(
  tipo: string | null | undefined,
  valores: Record<string, string> | null | undefined,
): { label: string; valor: string }[] {
  if (!esTipoCultivo(tipo)) return [];
  const v = valores ?? {};
  return ESPECIFICACIONES[tipo]
    .map((c) => ({ label: c.label, valor: String(v[c.key] ?? "").trim() }))
    .filter((t) => t.valor !== "");
}

// Normaliza lo que llega del formulario del panel: solo claves del tipo, sin vacíos.
export function limpiarEspecificaciones(
  tipo: string | null | undefined,
  entrada: Record<string, unknown>,
): Record<string, string> {
  if (!esTipoCultivo(tipo)) return {};
  const out: Record<string, string> = {};
  for (const c of ESPECIFICACIONES[tipo]) {
    const val = String(entrada[c.key] ?? "").trim();
    if (val) out[c.key] = val;
  }
  return out;
}

// Producto 100% digital: no requiere envío físico (guías de Conocimiento).
export function esDigital(tipo: string | null | undefined): boolean {
  return tipo === "conocimiento";
}

// ¿La categoría lleva un PDF asociado? Plantines: ficha de regalo. Conocimiento: el producto.
export function llevaPdf(tipo: string | null | undefined): boolean {
  return tipo === "plantines" || tipo === "conocimiento";
}

// Distintivo que se muestra en la tarjeta y en la ficha del producto.
// En Plantines solo aparece si ya se cargó la ficha PDF (`tienePdf`).
export function distintivoCultivo(tipo: string | null | undefined, enFicha = false, tienePdf = true): string | null {
  if (tipo === "plantines" && !tienePdf) return null;
  if (tipo === "plantines") return enFicha ? "Incluye ficha de cultivo en PDF." : "Incluye ficha de cultivo.";
  if (tipo === "conocimiento") return "Entrega digital en PDF";
  return null;
}

// Rutas públicas según la sección de la categoría.
export function rutaSeccion(seccion: string | null | undefined): string {
  return seccion === "cultivo" ? "/cultivo" : "/tienda";
}

export function nombreSeccion(seccion: string | null | undefined): string {
  return seccion === "cultivo" ? "Cultivo" : "Tienda";
}

// "También puede interesarte": otros productos de Cultivo, priorizando los de
// otras categorías (la consigna pide mezclar), respetando el orden recibido.
export function recomendados<T extends { slug: string; categoriaSlug: string; disponible: boolean }>(
  actual: { slug: string; categoriaSlug: string },
  candidatos: T[],
  cantidad = 3,
): T[] {
  const otros = candidatos.filter((p) => p.slug !== actual.slug && p.disponible);
  const deOtraCat = otros.filter((p) => p.categoriaSlug !== actual.categoriaSlug);
  const mismaCat = otros.filter((p) => p.categoriaSlug === actual.categoriaSlug);
  // Intercala: primero uno de otra categoría, luego de la misma, para variar.
  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (out.length < cantidad && (i < deOtraCat.length || j < mismaCat.length)) {
    if (i < deOtraCat.length) out.push(deOtraCat[i++]);
    if (out.length < cantidad && j < mismaCat.length) out.push(mismaCat[j++]);
  }
  return out;
}
