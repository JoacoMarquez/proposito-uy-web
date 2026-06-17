// Esquema declarativo del contenido editable de cada página (la ÚNICA fuente de
// verdad de "qué es editable"). Define, por página, los campos que el panel
// /admin/contenido autogenera, y los `defaults` = los literales que hoy están
// hardcodeados en los .astro. Las páginas leen con getContenido(slug), que
// mezcla estos defaults con lo guardado en la tabla `paginas` (DB). Si no hay
// fila/valor, cae al default → el sitio se ve idéntico al actual.
//
// Para hacer editable un texto nuevo: agregá el campo acá (con su default) y
// reemplazá el literal del .astro por {c.<key>}. No hace falta tocar el editor.

export type CampoTipo = "text" | "richtext" | "link" | "imagen" | "lista";

export interface CampoSimple {
  key: string;
  label: string;
  ayuda?: string;
  tipo: "text" | "richtext" | "link" | "imagen";
}

export interface CampoLista {
  key: string;
  label: string;
  ayuda?: string;
  tipo: "lista";
  item: CampoSimple[]; // sub-campos de cada fila (sin anidar listas)
}

export type Campo = CampoSimple | CampoLista;

export interface Seccion {
  titulo: string;
  campos: Campo[];
}

export interface EsquemaPagina {
  slug: string;
  titulo: string; // etiqueta para la lista del panel
  descripcion?: string;
  secciones: Seccion[];
  defaults: Record<string, unknown>;
}

export const ESQUEMA_PAGINAS: EsquemaPagina[] = [
  {
    slug: "inicio",
    titulo: "Inicio",
    descripcion: "Portada, frase principal, títulos de sección y textos de presentación.",
    secciones: [
      {
        titulo: "Portada",
        campos: [
          { key: "heroAlt", label: "Texto alternativo de la imagen", tipo: "text", ayuda: "Descripción de la imagen de portada (accesibilidad / SEO)." },
          { key: "presentacionFrase", label: "Frase principal", tipo: "text" },
          { key: "heroCtaTexto", label: "Texto del botón", tipo: "text" },
          { key: "heroCtaLink", label: "Link del botón", tipo: "link", ayuda: "Ej: /tienda" },
        ],
      },
      {
        titulo: "Títulos de sección",
        campos: [
          { key: "tituloCategorias", label: "Título de Categorías", tipo: "text" },
          { key: "tituloAtajos", label: "Título de Atajos", tipo: "text" },
          { key: "tituloDestacados", label: "Título de Los más pedidos", tipo: "text" },
        ],
      },
      {
        titulo: "Texto de presentación",
        campos: [
          { key: "presentacionP1", label: "Párrafo principal", tipo: "richtext" },
          { key: "presentacionP2", label: "Párrafo secundario", tipo: "richtext" },
        ],
      },
    ],
    defaults: {
      heroAlt: "Propósito — cuidamos lo que comés",
      presentacionFrase: "Elaboramos alimentos artesanales para acompañar tu rutina.",
      heroCtaTexto: "Ver catálogo",
      heroCtaLink: "/tienda",
      tituloCategorias: "Categorías",
      tituloAtajos: "Atajos",
      tituloDestacados: "Los más pedidos por ustedes",
      presentacionP1: "Queremos resolver tus desayunos, meriendas y picadas con alimentos que tu cuerpo pueda reconocer.",
      presentacionP2: "Nuestras elaboraciones nacen de una decisión innegociable: usar únicamente ingredientes naturales.",
    },
  },
];

// Devuelve el esquema de una página, o undefined si el slug no existe.
export function esquemaDePagina(slug: string): EsquemaPagina | undefined {
  return ESQUEMA_PAGINAS.find((e) => e.slug === slug);
}

// Aplana los campos editables de una página (recorre secciones). Útil para el
// POST del editor: por ahora solo campos simples; las listas se manejan aparte.
export function camposSimples(esquema: EsquemaPagina): CampoSimple[] {
  return esquema.secciones
    .flatMap((s) => s.campos)
    .filter((c): c is CampoSimple => c.tipo !== "lista");
}
