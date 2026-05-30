// Catálogo de productos. Para agregar/editar un producto, modificá esta lista.
// Las páginas de Tienda y Catálogo se generan automáticamente desde acá.

export type Categoria = "secos" | "barras" | "humedos";

export interface Producto {
  slug: string;
  nombre: string; // Ej: "Mix Frutos Secos"
  variante: string; // Ej: "Clásico"
  categoria: Categoria;
  descripcion?: string;
  // imagen: ruta dentro de /src/assets una vez que carguemos las fotos del Drive.
  imagen?: string;
}

export const categorias: Record<Categoria, { nombre: string; descripcion: string }> = {
  secos: {
    nombre: "Secos",
    descripcion: "Frutos secos, galletas y granola para el día a día.",
  },
  barras: {
    nombre: "Barras",
    descripcion: "Barras proteicas artesanales en distintas variedades.",
  },
  humedos: {
    nombre: "Húmedos",
    descripcion: "Hummus y cremas frescas.",
  },
};

export const productos: Producto[] = [
  // Secos
  { slug: "mix-frutos-secos-clasico", nombre: "Mix Frutos Secos", variante: "Clásico", categoria: "secos" },
  { slug: "galletas-artesanales-cracker", nombre: "Galletas Artesanales", variante: "Cracker", categoria: "secos" },
  { slug: "granola-del-dia-clasica", nombre: "Granola Del Día", variante: "Clásica", categoria: "secos" },

  // Barras
  { slug: "barras-proteicas-clasica", nombre: "Barras Proteicas", variante: "Clásica", categoria: "barras" },
  { slug: "barras-proteicas-coco", nombre: "Barras Proteicas", variante: "Coco", categoria: "barras" },
  { slug: "barras-proteicas-chocolate", nombre: "Barras Proteicas", variante: "Chocolate", categoria: "barras" },
  { slug: "barras-proteicas-caju", nombre: "Barras Proteicas", variante: "Cajú", categoria: "barras" },
  { slug: "barras-proteicas-mix", nombre: "Barras Proteicas", variante: "Mix", categoria: "barras" },

  // Húmedos
  { slug: "hummus-garbanzo", nombre: "Hummus", variante: "Garbanzo", categoria: "humedos" },
  { slug: "hummus-lentejon", nombre: "Hummus", variante: "Lentejón", categoria: "humedos" },
  { slug: "hummus-mix", nombre: "Hummus", variante: "Mix", categoria: "humedos" },
  { slug: "crema-caju", nombre: "Crema", variante: "Cajú", categoria: "humedos" },
  { slug: "crema-mani", nombre: "Crema", variante: "Maní", categoria: "humedos" },
];

export function productosPorCategoria(cat: Categoria): Producto[] {
  return productos.filter((p) => p.categoria === cat);
}

export function nombreCompleto(p: Producto): string {
  return `${p.nombre} | ${p.variante}`;
}
