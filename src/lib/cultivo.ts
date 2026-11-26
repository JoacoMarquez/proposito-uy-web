// Sección Cultivo: plantines e insumos.
//
// Las categorías de Cultivo viven en la misma tabla `categorias` que las de la
// Tienda, diferenciadas por `seccion = "cultivo"`, y cada una tiene un `tipo`
// que define qué tarjetas informativas muestra la ficha. Todos los productos
// son físicos: usan el mismo carrito, pedidos y entregas que la Tienda.
// Lógica pura (sin DB) para poder testearla y usarla en cliente y servidor.

export type Seccion = "tienda" | "cultivo";
export type TipoCultivo = "plantines" | "insumos";

export const TIPOS_CULTIVO: TipoCultivo[] = ["plantines", "insumos"];

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
};

// Presentaciones con las que arranca un producto nuevo, por tipo.
export const PRESENTACIONES_INICIALES: Partial<Record<TipoCultivo, string[]>> = {
  plantines: ["2 L", "5 L"],
};

// En Insumos el título de cada tarjeta también se edita por producto (tierra,
// compost y recipientes tienen características distintas). Se guarda en
// `especificaciones` con la clave `titulo_<key>`; si queda vacío se usa el título por defecto.
export function titulosEditables(tipo: string | null | undefined): boolean {
  return tipo === "insumos";
}

export const claveTitulo = (key: string) => `titulo_${key}`;

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
  const editables = titulosEditables(tipo);
  return ESPECIFICACIONES[tipo]
    .map((c) => ({
      label: (editables && String(v[claveTitulo(c.key)] ?? "").trim()) || c.label,
      valor: String(v[c.key] ?? "").trim(),
    }))
    .filter((t) => t.valor !== "");
}

// Normaliza lo que llega del formulario del panel: solo claves del tipo, sin vacíos.
export function limpiarEspecificaciones(
  tipo: string | null | undefined,
  entrada: Record<string, unknown>,
): Record<string, string> {
  if (!esTipoCultivo(tipo)) return {};
  const editables = titulosEditables(tipo);
  const out: Record<string, string> = {};
  for (const c of ESPECIFICACIONES[tipo]) {
    const val = String(entrada[c.key] ?? "").trim();
    if (val) out[c.key] = val;
    if (editables) {
      const titulo = String(entrada[claveTitulo(c.key)] ?? "").trim();
      if (titulo && titulo !== c.label) out[claveTitulo(c.key)] = titulo;
    }
  }
  return out;
}

// Rutas públicas según la sección de la categoría.
export function rutaSeccion(seccion: string | null | undefined): string {
  return seccion === "cultivo" ? "/cultivo" : "/tienda";
}

export function nombreSeccion(seccion: string | null | undefined): string {
  return seccion === "cultivo" ? "Cultivo" : "Tienda";
}

// "También puede interesarte" (consigna de Pedro, 25/11): 3 productos de
// Cultivo que crucen categorías. Viendo un Insumo → 2 Plantines + 1 Insumo;
// viendo un Plantín → 2 Insumos + 1 Plantín. Sin repetir el actual ni
// duplicados, priorizando los disponibles. Si no alcanza para esa
// distribución, se completa con otros disponibles de Cultivo y, en último
// caso, con agotados. Respeta el orden recibido (el del panel).
export function recomendados<T extends { slug: string; categoriaSlug: string; disponible: boolean }>(
  actual: { slug: string; categoriaSlug: string },
  candidatos: T[],
  cantidad = 3,
): T[] {
  const otros = candidatos.filter((p) => p.slug !== actual.slug);
  const disponibles = otros.filter((p) => p.disponible);
  const deOtraCat = disponibles.filter((p) => p.categoriaSlug !== actual.categoriaSlug);
  const mismaCat = disponibles.filter((p) => p.categoriaSlug === actual.categoriaSlug);

  const out: T[] = [];
  const sumar = (lista: T[], hasta: number) => {
    for (const p of lista) {
      if (out.length >= hasta) break;
      if (!out.some((x) => x.slug === p.slug)) out.push(p);
    }
  };
  const deOtra = Math.min(cantidad - 1, 2); // 2 de la otra categoría (con 3 lugares)
  sumar(deOtraCat, deOtra);
  sumar(mismaCat, out.length + (cantidad - deOtra)); // 1 de la misma
  sumar(disponibles, cantidad); // faltantes: cualquier otro disponible
  sumar(otros, cantidad); // último recurso: agotados
  return out;
}
