// Lista de favoritos (wishlist) del lado del cliente, persistida en localStorage.
// Emite el evento "favoritos:cambio" para que la UI (badge del header, listados,
// botones de corazón) se actualice. Mismo patrón que el carrito (cart.ts).

export interface ItemFavorito {
  slug: string;
  nombre: string; // nombre completo: "Hummus | Garbanzo"
  variante: string;
  imagen?: string;
  precioDesde: number;
  desde: boolean; // true si el producto tiene más de una presentación
}

const KEY = "favoritos";

export function getFavoritos(): ItemFavorito[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function guardar(items: ItemFavorito[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("favoritos:cambio"));
}

export function esFavorito(slug: string): boolean {
  return getFavoritos().some((i) => i.slug === slug);
}

/** Alterna el favorito. Devuelve true si quedó marcado como favorito. */
export function toggle(item: ItemFavorito): boolean {
  const items = getFavoritos();
  const i = items.findIndex((x) => x.slug === item.slug);
  if (i >= 0) {
    items.splice(i, 1);
    guardar(items);
    return false;
  }
  items.push(item);
  guardar(items);
  return true;
}

export function quitar(slug: string) {
  guardar(getFavoritos().filter((i) => i.slug !== slug));
}

export function contar(): number {
  return getFavoritos().length;
}

export function formatoPrecio(n: number): string {
  return "$U" + n.toLocaleString("es-UY");
}
