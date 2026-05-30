// Recetario. Cada receta genera su propia página interna.
// Por ahora con título y descripción; sumamos ingredientes/pasos/imagen al cargar contenido.

export interface Receta {
  slug: string;
  titulo: string;
  descripcion?: string;
  imagen?: string;
  ingredientes?: string[];
  pasos?: string[];
}

export const recetas: Receta[] = [
  { slug: "alioli-casero", titulo: "Alioli Casero" },
  { slug: "sopa-cremosa", titulo: "Sopa Cremosa" },
  { slug: "pan-rustico", titulo: "Pan Rústico" },
  { slug: "chia-pudding", titulo: "Chía Pudding" },
  { slug: "trufas-energeticas", titulo: "Trufas Energéticas" },
  { slug: "torta-proteica", titulo: "Torta Proteica" },
  { slug: "snack-nutritivo", titulo: "Snack Nutritivo" },
  { slug: "alfa-prote", titulo: "Alfa Prote" },
];
