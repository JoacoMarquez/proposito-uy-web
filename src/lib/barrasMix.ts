// Lógica compartida (cliente + servidor) del configurador de Barras Mix (PROP-31).
// El precio se recalcula SIEMPRE en el servidor al crear el pedido; este módulo
// es la única fuente de verdad de la regla para que ambos lados coincidan.

export const MIX_SLUG = "barras-proteicas-mix";
export const RECARGO_CAJU = 16; // $U extra por cada barra de Cajú

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

export function cantidadTamano(label: string): number | null {
  return TAMANOS_MIX.find((t) => t.label === label)?.cantidad ?? null;
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
export function precioMix(basePrecio: number, mix: MixDetalle): number {
  return basePrecio + RECARGO_CAJU * (Number(mix?.sabores?.caju) || 0);
}

// Etiqueta legible para el carrito/pedido, ej. "x12 · 4 Clásica, 4 Coco, 4 Cajú".
export function etiquetaMix(mix: MixDetalle): string {
  const detalle = SABORES_MIX.filter((s) => (Number(mix?.sabores?.[s.key]) || 0) > 0)
    .map((s) => `${mix.sabores[s.key]} ${s.label}`)
    .join(", ");
  return `${mix.tamano} · ${detalle}`;
}
