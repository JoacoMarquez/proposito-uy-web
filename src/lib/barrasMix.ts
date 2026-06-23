// Lógica compartida (cliente + servidor) del configurador de Barras Mix (PROP-31).
// El precio se recalcula SIEMPRE en el servidor al crear el pedido; este módulo
// es la única fuente de verdad de la regla para que ambos lados coincidan.

export const MIX_SLUG = "B-BP-MX";
export const RECARGO_CAJU = 20; // $U extra por barra de Cajú (default; editable en Contenido › Tienda)

// Tamaños de referencia. La capacidad real se deriva de los dígitos del label
// (ver cantidadTamano), para que cliente y servidor coincidan aunque Pedro
// renombre una presentación en el panel (ej. "Caja x12").
export const TAMANOS_MIX = [
  { label: "x12", cantidad: 12 },
  { label: "x24", cantidad: 24 },
  { label: "x48", cantidad: 48 },
] as const;

export const SABORES_MIX = [
  { key: "clasica", label: "Clásica" },
  { key: "coco", label: "Coco" },
  { key: "chocolate", label: "Chocolate" },
  { key: "caju", label: "Cajú" },
] as const;

export type SaborKey = (typeof SABORES_MIX)[number]["key"];
export type SaboresMix = Record<SaborKey, number>;

export interface MixDetalle {
  tamano: string; // label de tamaño, ej. "x12"
  sabores: SaboresMix;
}

// Capacidad de la caja a partir del label, derivada de sus dígitos (ej. "x12" → 12,
// "Caja x24" → 24). Misma regla que usa el cliente, evitando que un cambio de label
// haga que el servidor descarte el mix en silencio.
export function cantidadTamano(label: string): number | null {
  const n = parseInt(String(label ?? "").replace(/\D/g, ""), 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function totalBarras(sabores: SaboresMix): number {
  return SABORES_MIX.reduce((n, s) => n + (Number(sabores?.[s.key]) || 0), 0);
}

// La caja es válida si los sabores (no negativos) suman exactamente el tamaño.
export function mixValido(mix: MixDetalle): boolean {
  const cant = cantidadTamano(mix?.tamano);
  if (cant == null) return false;
  for (const s of SABORES_MIX) {
    const n = Number(mix?.sabores?.[s.key]);
    if (!Number.isFinite(n) || n < 0 || !Number.isInteger(n)) return false;
  }
  return totalBarras(mix.sabores) === cant;
}

// Precio unitario de la caja: base del tamaño + recargo por barras de Cajú.
// `recargo` es configurable (Contenido › Tienda); cae al default si no se pasa.
export function precioMix(basePrecio: number, mix: MixDetalle, recargo: number = RECARGO_CAJU): number {
  return basePrecio + recargo * (Number(mix?.sabores?.caju) || 0);
}

// Etiqueta legible para el carrito/pedido, ej. "x12 · 4 Clásica, 4 Coco, 4 Cajú".
export function etiquetaMix(mix: MixDetalle): string {
  const detalle = SABORES_MIX.filter((s) => (Number(mix?.sabores?.[s.key]) || 0) > 0)
    .map((s) => `${mix.sabores[s.key]} ${s.label}`)
    .join(", ");
  return `${mix.tamano} · ${detalle}`;
}
