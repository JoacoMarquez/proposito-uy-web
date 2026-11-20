// Las páginas del panel de productos (lista, editor, ordenar, categorías) viven
// en src/pages/admin/[seccion]/ y sirven a dos secciones: /admin/productos
// (Tienda) y /admin/cultivo (Cultivo). Esto traduce el parámetro de la URL.

import type { Seccion } from "./cultivo";

export interface SeccionAdmin {
  seccion: Seccion;
  base: string; // "/admin/productos" | "/admin/cultivo"
  titulo: string; // título de la lista
}

const SECCIONES: Record<string, SeccionAdmin> = {
  productos: { seccion: "tienda", base: "/admin/productos", titulo: "Productos" },
  cultivo: { seccion: "cultivo", base: "/admin/cultivo", titulo: "Cultivo" },
};

export function seccionAdmin(param: string | undefined): SeccionAdmin | null {
  return (param && SECCIONES[param]) || null;
}

export function baseAdmin(seccion: string | null | undefined): string {
  return seccion === "cultivo" ? SECCIONES.cultivo.base : SECCIONES.productos.base;
}
