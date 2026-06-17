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
          { key: "heroImagen", label: "Imagen de portada", tipo: "imagen", ayuda: "Se muestra arriba de todo en la página de inicio." },
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
      heroImagen: "/inicio/portada.webp",
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
  {
    slug: "contacto",
    titulo: "Contacto",
    descripcion: "Título, texto de presentación y leyendas de la página de contacto.",
    secciones: [
      {
        titulo: "Textos",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "parrafo", label: "Párrafo de presentación", tipo: "richtext" },
          { key: "textoBotonWhatsapp", label: "Texto del botón de WhatsApp", tipo: "text" },
          { key: "textoHorario", label: "Leyenda de horario", tipo: "text", ayuda: "Se le agrega automáticamente el horario configurado." },
          { key: "textoRedes", label: "Leyenda de redes", tipo: "text", ayuda: "Antes del enlace a Instagram." },
        ],
      },
    ],
    defaults: {
      titulo: "Estamos para escucharte",
      parrafo:
        "Nuestro enfoque está en la calidad de lo que hacemos, por eso cada consulta, comentario o sugerencia nos importa. Nos ayuda a mejorar, crecer y ofrecerte un producto y servicio que realmente aporten valor.",
      textoBotonWhatsapp: "Contacto directo a WhatsApp",
      textoHorario: "Te recordamos que nuestro horario de atención es de",
      textoRedes: "También nos encontrás en",
    },
  },
  {
    slug: "tienda",
    titulo: "Tienda",
    descripcion: "Encabezado de la tienda y el bloque de Catálogo.",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "intro", label: "Texto de introducción", tipo: "text" },
        ],
      },
      {
        titulo: "Bloque Catálogo",
        campos: [
          { key: "catalogoImagen", label: "Imagen del bloque", tipo: "imagen", ayuda: "Imagen del recuadro “Catálogo”." },
          { key: "catalogoTitulo", label: "Título del bloque", tipo: "text" },
          { key: "catalogoDescripcion", label: "Descripción del bloque", tipo: "text" },
        ],
      },
    ],
    defaults: {
      titulo: "Tienda",
      intro: "Elegí una categoría o mirá el catálogo completo.",
      catalogoImagen: "/marca/proposito-isotipo.webp",
      catalogoTitulo: "Catálogo",
      catalogoDescripcion: "Todos los productos en un solo lugar.",
    },
  },
  {
    slug: "recetario",
    titulo: "Recetario",
    descripcion: "Encabezado del recetario.",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "intro", label: "Texto de introducción", tipo: "richtext" },
          { key: "leyendaAutor", label: "Leyenda de autor (en cada receta)", tipo: "text" },
        ],
      },
    ],
    defaults: {
      titulo: "Recetario",
      intro:
        "Te invitamos a poner las manos en la masa y preparar recetas simples, ricas y nutritivas con nuestros productos.",
      leyendaAutor: "Por Propósito UY",
    },
  },
  {
    slug: "preguntas",
    titulo: "Preguntas",
    descripcion: "Encabezado de la página de preguntas. Las preguntas se editan en la sección Preguntas.",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "intro", label: "Texto de introducción", tipo: "richtext" },
        ],
      },
    ],
    defaults: {
      titulo: "Preguntas",
      intro:
        "Acá reunimos lo más consultado por ustedes: cómo funcionan los pedidos, cómo elaboramos nuestros productos y cómo leer la información nutricional. Todo claro, directo y simple.",
    },
  },
  {
    slug: "footer",
    titulo: "Pie de página",
    descripcion: "Textos del pie de página (visible en todo el sitio).",
    secciones: [
      {
        titulo: "Marca y newsletter",
        campos: [
          { key: "tagline", label: "Frase bajo el nombre", tipo: "text" },
          { key: "newsletterLabel", label: "Título del newsletter", tipo: "text" },
          { key: "newsletterPlaceholder", label: "Placeholder del email", tipo: "text" },
          { key: "newsletterBoton", label: "Texto del botón", tipo: "text" },
        ],
      },
      {
        titulo: "Pie",
        campos: [
          { key: "copyright", label: "Línea de copyright", tipo: "text" },
          { key: "fraseFinal", label: "Frase final", tipo: "text" },
        ],
      },
    ],
    defaults: {
      tagline: "Alimentos con propósito.",
      newsletterLabel: "Sumate a las novedades",
      newsletterPlaceholder: "Tu email",
      newsletterBoton: "Suscribirme",
      copyright: "© 2026 Propósito UY. Todos los derechos reservados.",
      fraseFinal: "Alimentos reales, honestos y nutritivos elaborados en Montevideo, Uruguay.",
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
