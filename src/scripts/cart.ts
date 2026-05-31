// Carrito del lado del cliente, persistido en localStorage.
// Emite el evento "carrito:cambio" para que la UI (badge, listados) se actualice.

export interface ItemCarrito {
  slug: string;
  nombre: string; // nombre completo: "Hummus | Garbanzo"
  presentacion: string; // label de la presentación
  precio: number; // precio unitario al momento de agregar (se revalida en el server)
  cantidad: number;
}

const KEY = "carrito";

export function getCarrito(): ItemCarrito[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function guardar(items: ItemCarrito[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("carrito:cambio"));
}

export function agregar(item: ItemCarrito) {
  const items = getCarrito();
  const ex = items.find((i) => i.slug === item.slug && i.presentacion === item.presentacion);
  if (ex) ex.cantidad += item.cantidad;
  else items.push(item);
  guardar(items);
}

export function setCantidad(slug: string, presentacion: string, cantidad: number) {
  const items = getCarrito()
    .map((i) => (i.slug === slug && i.presentacion === presentacion ? { ...i, cantidad } : i))
    .filter((i) => i.cantidad > 0);
  guardar(items);
}

export function quitar(slug: string, presentacion: string) {
  guardar(getCarrito().filter((i) => !(i.slug === slug && i.presentacion === presentacion)));
}

export function limpiar() {
  guardar([]);
}

export function contar(): number {
  return getCarrito().reduce((n, i) => n + i.cantidad, 0);
}

export function subtotal(): number {
  return getCarrito().reduce((n, i) => n + i.precio * i.cantidad, 0);
}

export function formatoPrecio(n: number): string {
  return "$U" + n.toLocaleString("es-UY");
}
