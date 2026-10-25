// Talles de barra (S = 40 g, L = 80 g). No hay columna propia en la base: el talle
// se indica anteponiendo "S" o "L" al label de la presentación desde el panel
// (ej. "S x12", "L x12"). Si un producto tiene presentaciones de ambos talles, la
// ficha muestra el selector y filtra las presentaciones del talle elegido.

export const TALLES = [
  { key: "S", nombre: "Barra S", peso: "40 g" },
  { key: "L", nombre: "Barra L", peso: "80 g" },
] as const;

export type TalleKey = (typeof TALLES)[number]["key"];

// Separa el prefijo de talle del resto del label: "L x12" → { talle: "L", resto: "x12" }.
// Sin prefijo → talle null y el label intacto.
export function separarTalle(label: string): { talle: TalleKey | null; resto: string } {
  const m = String(label ?? "").match(/^\s*([SL])(?:\s+|$)(.*)$/i);
  if (!m) return { talle: null, resto: String(label ?? "") };
  return { talle: m[1].toUpperCase() as TalleKey, resto: m[2].trim() };
}

// Talles presentes en las presentaciones, en el orden de TALLES.
export function tallesDe(presentaciones: { label: string }[]): TalleKey[] {
  const usados = new Set(presentaciones.map((p) => separarTalle(p.label).talle));
  return TALLES.map((t) => t.key).filter((k) => usados.has(k));
}
