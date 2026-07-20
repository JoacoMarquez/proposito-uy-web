// Esquema declarativo del contenido editable de cada página (la ÚNICA fuente de
// verdad de "qué es editable"). Define, por página, los campos que el panel
// /admin/contenido autogenera, y los `defaults` = los literales que hoy están
// hardcodeados en los .astro. Las páginas leen con getContenido(slug), que
// mezcla estos defaults con lo guardado en la tabla `paginas` (DB). Si no hay
// fila/valor, cae al default → el sitio se ve idéntico al actual.
//
// Para hacer editable un texto nuevo: agregá el campo acá (con su default) y
// reemplazá el literal del .astro por {c.<key>}. No hace falta tocar el editor.

export type CampoTipo = "text" | "richtext" | "link" | "ruta" | "imagen" | "tabla" | "fecha" | "checkbox" | "lista";

export interface CampoSimple {
  key: string;
  label: string;
  ayuda?: string;
  // "link" = URL libre (externa). "ruta" = página interna del sitio (desplegable).
  // "tabla" = grilla editable { columnas, filas } (valores/filas/columnas).
  // "fecha" = input date (YYYY-MM-DD). "checkbox" = booleano ("si" / "").
  tipo: "text" | "richtext" | "link" | "ruta" | "imagen" | "tabla" | "fecha" | "checkbox";
}

// Forma de los valores de un campo tipo "tabla".
export interface TablaValor {
  columnas: string[];
  filas: string[][];
}

// Páginas internas seleccionables para los campos tipo "ruta" (links de botones).
export const RUTAS_SITIO: { value: string; label: string }[] = [
  { value: "/", label: "Inicio" },
  { value: "/tienda", label: "Tienda" },
  { value: "/tienda/catalogo", label: "Catálogo" },
  { value: "/recetario", label: "Recetario" },
  { value: "/retornables", label: "Retornables" },
  { value: "/preguntas", label: "Preguntas" },
  { value: "/nosotros", label: "Nosotros" },
  { value: "/contacto", label: "Contacto" },
  { value: "/favoritos", label: "Favoritos" },
  { value: "/carrito", label: "Carrito" },
];

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
  ayudaSeccion?: string; // nota explicativa bajo el título de la sección (opcional)
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
          { key: "heroCtaLink", label: "Link del botón", tipo: "ruta" },
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
      {
        titulo: "Atajos (3 accesos rápidos)",
        campos: [
          { key: "atajo1Titulo", label: "Atajo 1 · Título", tipo: "text" },
          { key: "atajo1Href", label: "Atajo 1 · Link", tipo: "ruta" },
          { key: "atajo1Imagen", label: "Atajo 1 · Imagen", tipo: "imagen" },
          { key: "atajo2Titulo", label: "Atajo 2 · Título", tipo: "text" },
          { key: "atajo2Href", label: "Atajo 2 · Link", tipo: "ruta" },
          { key: "atajo2Imagen", label: "Atajo 2 · Imagen", tipo: "imagen" },
          { key: "atajo3Titulo", label: "Atajo 3 · Título", tipo: "text" },
          { key: "atajo3Href", label: "Atajo 3 · Link", tipo: "ruta" },
          { key: "atajo3Imagen", label: "Atajo 3 · Imagen", tipo: "imagen" },
        ],
      },
      {
        titulo: "Bloques solo mobile (Catálogo y Contacto)",
        campos: [
          { key: "catalogoImagen", label: "Catálogo · Imagen (solo mobile)", tipo: "imagen", ayuda: "Solo se muestra en celular, en la grilla de Categorías." },
          { key: "contactoImagen", label: "Contacto · Imagen (solo mobile)", tipo: "imagen", ayuda: "Solo se muestra en celular, en la grilla de Atajos." },
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
      atajo1Titulo: "Recetario",
      atajo1Href: "/recetario",
      atajo1Imagen: "",
      atajo2Titulo: "Retornables",
      atajo2Href: "/retornables",
      atajo2Imagen: "",
      atajo3Titulo: "Preguntas",
      atajo3Href: "/preguntas",
      atajo3Imagen: "",
      catalogoImagen: "",
      contactoImagen: "",
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
    descripcion: "Encabezado, bloque de Catálogo y horarios de retiro/entrega del checkout.",
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
      {
        titulo: "Horarios de retiro y entrega",
        campos: [
          { key: "horarioRetiro", label: "Retiro en planta", tipo: "text", ayuda: "Franja que se muestra en el checkout (miércoles y viernes). Ej: 12:00 a 15:00" },
          { key: "horarioEntrega", label: "Entrega a domicilio", tipo: "text", ayuda: "Franja que se muestra en el checkout (miércoles y viernes). Ej: 15:00 a 18:00" },
        ],
      },
      {
        titulo: "Numeración de pedidos",
        campos: [
          { key: "pedidoNumeroInicial", label: "Número inicial de pedido", tipo: "text", ayuda: "El próximo pedido tomará este número (ej: 170 → P-170) y de ahí sigue correlativo. Si ya hay pedidos más altos, continúa desde el mayor." },
        ],
      },
      {
        titulo: "Barras Proteicas Mix",
        campos: [
          { key: "recargoCajuMix", label: "Recargo por barra de Cajú ($U)", tipo: "text", ayuda: "Extra que se suma por cada barra de Cajú elegida en la caja Mix. Ej: 20" },
        ],
      },
      {
        titulo: "Licencia / pausa de pedidos",
        campos: [
          { key: "licenciaActiva", label: "Estamos de licencia", tipo: "checkbox", ayuda: "Al activarlo, el checkout no ofrece fechas de entrega/retiro dentro del período y avisa a los clientes. Los pedidos se agendan para después del regreso." },
          { key: "licenciaDesde", label: "Desde", tipo: "fecha", ayuda: "Primer día de la licencia (inclusive)." },
          { key: "licenciaHasta", label: "Hasta (regreso)", tipo: "fecha", ayuda: "Último día de la licencia (inclusive). Las entregas se retoman después de esta fecha." },
        ],
      },
    ],
    defaults: {
      titulo: "Tienda",
      intro: "Elegí una categoría o mirá el catálogo completo.",
      catalogoImagen: "/marca/proposito-isotipo.webp",
      catalogoTitulo: "Catálogo",
      catalogoDescripcion: "Todos los productos en un solo lugar.",
      horarioRetiro: "12:00 a 15:00",
      horarioEntrega: "15:00 a 18:00",
      pedidoNumeroInicial: "1",
      recargoCajuMix: "20",
      licenciaActiva: "",
      licenciaDesde: "",
      licenciaHasta: "",
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
  {
    slug: "nosotros",
    titulo: "Nosotros",
    descripcion: "Declaración, promesas y los 5 valores (el ícono de cada valor queda fijo).",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [{ key: "declaracionIntro", label: "Declaración (texto destacado)", tipo: "richtext" }],
      },
      {
        titulo: "Nuestras promesas",
        campos: [
          { key: "tituloPromesas", label: "Título", tipo: "text" },
          { key: "subtituloPromesas", label: "Subtítulo", tipo: "richtext" },
        ],
      },
      {
        titulo: "Los valores en acción",
        campos: [
          { key: "tituloValoresAccion", label: "Título", tipo: "text" },
          { key: "subtituloValoresAccion", label: "Subtítulo", tipo: "richtext" },
        ],
      },
      {
        titulo: "Contenido real",
        campos: [
          { key: "contenidoRealTitulo", label: "Título", tipo: "text" },
          { key: "contenidoRealTexto", label: "Texto (un párrafo por línea)", tipo: "richtext" },
        ],
      },
      {
        titulo: "Valor 1",
        campos: [
          { key: "valor1Titulo", label: "Título", tipo: "text" },
          { key: "valor1Detalle", label: "Detalle", tipo: "text" },
          { key: "valor1Imagen", label: "Imagen", tipo: "imagen" },
        ],
      },
      {
        titulo: "Valor 2",
        campos: [
          { key: "valor2Titulo", label: "Título", tipo: "text" },
          { key: "valor2Detalle", label: "Detalle", tipo: "text" },
          { key: "valor2Imagen", label: "Imagen", tipo: "imagen" },
        ],
      },
      {
        titulo: "Valor 3",
        campos: [
          { key: "valor3Titulo", label: "Título", tipo: "text" },
          { key: "valor3Detalle", label: "Detalle", tipo: "text" },
          { key: "valor3Imagen", label: "Imagen", tipo: "imagen" },
        ],
      },
      {
        titulo: "Valor 4",
        campos: [
          { key: "valor4Titulo", label: "Título", tipo: "text" },
          { key: "valor4Detalle", label: "Detalle", tipo: "text" },
          { key: "valor4Imagen", label: "Imagen", tipo: "imagen" },
        ],
      },
      {
        titulo: "Valor 5",
        campos: [
          { key: "valor5Titulo", label: "Título", tipo: "text" },
          { key: "valor5Detalle", label: "Detalle", tipo: "text" },
          { key: "valor5Imagen", label: "Imagen", tipo: "imagen" },
        ],
      },
    ],
    defaults: {
      declaracionIntro:
        "Creemos que lo que comemos puede transformar nuestra forma de vivir. Por eso, cada parte de nuestro trabajo está guiada por una promesa: cuidar lo que comés.",
      tituloPromesas: "Nuestras promesas",
      subtituloPromesas:
        "Es nuestro compromiso con ustedes, los que nos apoyan y nos hacen dar latido a nuestro proyecto.",
      tituloValoresAccion: "Los valores en acción",
      subtituloValoresAccion: "Los valores no son solo palabras, sino parte del trabajo cotidiano.",
      contenidoRealTitulo: "Contenido real",
      contenidoRealTexto:
        "Todo el contenido visual de esta web nace de elaboraciones hechas por nosotros: no son renders ni fotos generadas con IA.\nLas recetas y productos fueron preparados, fotografiados y seleccionados en sesiones propias de contenido, con nuestros productos y espacio de trabajo.\nLo que ves busca representar lo que realmente hacemos: alimentos simples, cuidados y posibles de preparar o recibir tal como se muestran.\nTambién cuidamos que la comunicación sea directa. Si nos escribís por WhatsApp, del otro lado te responde una persona.",
      valor1Titulo: "Cercanía",
      valor1Detalle: "Cocinar como para alguien querido.",
      valor1Imagen: "/valores/real-cercania.webp",
      valor2Titulo: "Autenticidad",
      valor2Detalle: "Ser como somos, y que eso se note en nuestra forma.",
      valor2Imagen: "/valores/real-autenticidad.webp",
      valor3Titulo: "Responsabilidad",
      valor3Detalle: "Cuidar nuestros procesos, tu cuerpo y nuestro entorno.",
      valor3Imagen: "/valores/real-responsabilidad.webp",
      valor4Titulo: "Transparencia",
      valor4Detalle: "Mostrarte nuestra esencia, lo que nos motiva y cómo trabajamos.",
      valor4Imagen: "/valores/real-transparencia.webp",
      valor5Titulo: "Alineación",
      valor5Detalle: "Mantener la coherencia entre lo que hacemos, decimos y creemos.",
      valor5Imagen: "/valores/real-alineacion.webp",
    },
  },
  {
    slug: "retornables",
    titulo: "Retornables",
    descripcion: "Encabezado, bloque de la grilla y las 7 preguntas (acordeones).",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "intro", label: "Texto de introducción", tipo: "richtext" },
          { key: "heroImagen", label: "Imagen", tipo: "imagen" },
          { key: "heroAlt", label: "Texto alternativo de la imagen", tipo: "text" },
        ],
      },
      {
        titulo: "Grilla de retornabilidad",
        campos: [
          { key: "grillaTitulo", label: "Título del bloque", tipo: "text" },
          { key: "grillaDescripcion", label: "Descripción del bloque", tipo: "text" },
        ],
        ayudaSeccion:
          "La tabla se arma automáticamente con los productos que tengan cargado “Frascos p/ 1 gratis” en sus presentaciones (Productos → editar). No se edita desde acá.",
      },
      { titulo: "Acordeón 1", campos: [
        { key: "acordeon1Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon1Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 2", campos: [
        { key: "acordeon2Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon2Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 3", campos: [
        { key: "acordeon3Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon3Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 4", campos: [
        { key: "acordeon4Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon4Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 5", campos: [
        { key: "acordeon5Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon5Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 6", campos: [
        { key: "acordeon6Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon6Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
      { titulo: "Acordeón 7", campos: [
        { key: "acordeon7Titulo", label: "Pregunta", tipo: "text" },
        { key: "acordeon7Cuerpo", label: "Respuesta (un párrafo por línea)", tipo: "richtext" },
      ] },
    ],
    defaults: {
      titulo: "Retornables",
      intro:
        "Creemos en envases que vuelven. Devolver nuestros frascos de vidrio es una forma simple y concreta de cuidar el planeta y participar de un sistema más consciente con nuestro entorno.",
      heroImagen: "/retornables/retornables.webp",
      heroAlt: "Frascos de vidrio retornables de Propósito",
      grillaTitulo: "Grilla de retornabilidad",
      grillaDescripcion: "Cantidad de envases por producto para acceder a la bonificación.",
      grillaTabla: {
        columnas: ["Productos", "Frascos para 1 gratis"],
        filas: [
          ["Hummus | Lentejón - 280 g", "5"],
          ["Hummus | Garbanzo - 280 g", "5"],
          ["Crema | Cajú - 180 g", "6"],
          ["Crema | Cajú - 330 g", "9"],
          ["Crema | Maní - 390 g", "6"],
          ["Crema | Maní - 1 kg", "6"],
        ],
      },
      acordeon1Titulo: "¿Qué envases participan?",
      acordeon1Cuerpo:
        "Participan únicamente frascos de vidrio retornables. Por eso el sistema aplica exclusivamente a productos de la categoría Húmedos. No aplican bolsas kraft ni otros envases.\nProductos incluidos: Crema | Cajú (180 g y 330 g), Crema | Maní (390 g y 1 kg), Hummus | Garbanzo (280 g) y Hummus | Lentejón (280 g).",
      acordeon2Titulo: "¿Cómo funciona el sistema?",
      acordeon2Cuerpo:
        "Se activa cuando hacés un pedido y querés devolver envases de vidrio acumulados en compras anteriores.\nPara usar el beneficio, indicalo en el campo Notas del pedido antes de finalizar: qué envases vas a devolver y qué bonificación corresponde según la grilla vigente.\nEjemplo: “Quiero devolver los frascos necesarios de Crema | Maní - 390 g para recibir 1 Crema | Maní - 390 g gratis.” No agregás al carrito el producto gratis; solo cargás lo que comprás.\nLa devolución se organiza por tipo de producto: los envases no se suman entre productos distintos, y la bonificación aplica solo al alcanzar la cantidad completa requerida.",
      acordeon3Titulo: "Límite de devolución por pedido",
      acordeon3Cuerpo:
        "Para cuidar la manipulación y evitar roturas, se admite como máximo una bonificación por tipo de producto en cada pedido.\nSi querés seguir devolviendo más envases del mismo tipo, podés hacerlo en pedidos posteriores.",
      acordeon4Titulo: "Condiciones para la devolución",
      acordeon4Cuerpo:
        "Para que un envase pueda reutilizarse debe entregarse: limpio y sin restos de alimento; sin fisuras, golpes ni óxido; con tapa en buen estado; y transportado de forma segura (caja, bolsa resistente o recipiente que evite golpes).\nLos envases que no cumplan estas condiciones no podrán ingresar al circuito ni computarse para la bonificación.",
      acordeon5Titulo: "¿Qué hacemos con los envases?",
      acordeon5Cuerpo:
        "Una vez recibidos, pasan por un proceso de limpieza, desinfección y control, y vuelven a incorporarse al circuito productivo.\nCada envase reutilizado reduce la necesidad de producir uno nuevo y disminuye el impacto ambiental.",
      acordeon6Titulo: "¿Por qué lo hacemos?",
      acordeon6Cuerpo:
        "Para nosotros, optimiza el uso de recursos y reduce el impacto ambiental, permitiéndonos sostener una producción más consciente.\nPara vos, es un beneficio claro y directo, y una forma de participar de un sistema coherente con lo que consumís.",
      acordeon7Titulo: "Validez",
      acordeon7Cuerpo:
        "Aplica únicamente a frascos de vidrio de productos de la categoría Húmedos.\nEl beneficio se gestiona junto con tu pedido: indicalo en Notas del pedido, aclarando qué producto y presentación querés bonificar. Ante cualquier duda, consultanos antes de finalizar la compra.",
    },
  },
  {
    slug: "ajustes",
    titulo: "Ajustes generales",
    descripcion: "Datos de contacto que se muestran en el sitio (WhatsApp, horario, Instagram, retiro).",
    secciones: [
      {
        titulo: "Contacto y redes",
        campos: [
          { key: "whatsappConversacion", label: "Link de WhatsApp (conversación)", tipo: "link", ayuda: "Botón “Contacto directo a WhatsApp” de la página de Contacto." },
          { key: "horarioAtencion", label: "Horario de atención", tipo: "text" },
          { key: "instagram", label: "Link de Instagram", tipo: "link" },
        ],
      },
      {
        titulo: "Retiro en planta",
        campos: [
          { key: "direccionRetiro", label: "Dirección de retiro", tipo: "text" },
        ],
      },
      {
        titulo: "Datos bancarios",
        campos: [
          { key: "bancoNombre", label: "Banco", tipo: "text", ayuda: "Se muestran en la confirmación de pedidos con pago por transferencia." },
          { key: "bancoTipoCuenta", label: "Tipo de cuenta", tipo: "text", ayuda: "Ej: CA $ (caja de ahorro en pesos)." },
          { key: "bancoNumeroCuenta", label: "N° de cuenta", tipo: "text" },
          { key: "bancoTitular", label: "Titular", tipo: "text" },
        ],
      },
    ],
    defaults: {
      whatsappConversacion: "https://wa.me/message/YWJV7R5QSYRND1",
      horarioAtencion: "Lunes a viernes de 12:00 a 18:00 hs.",
      instagram: "https://instagram.com/proposito_uy",
      direccionRetiro: "Volteadores 1742, Punta Gorda, Montevideo",
      bancoNombre: "BROU",
      bancoTipoCuenta: "CA $",
      bancoNumeroCuenta: "110522297-00001",
      bancoTitular: "Pedro Dieste",
    },
  },
  {
    slug: "nutricional",
    titulo: "Tabla nutricional",
    descripcion: "Página de información nutricional (la abre el botón de Preguntas).",
    secciones: [
      {
        titulo: "Encabezado",
        campos: [
          { key: "titulo", label: "Título", tipo: "text" },
          { key: "intro", label: "Texto de introducción", tipo: "richtext" },
        ],
      },
      {
        titulo: "Tabla",
        campos: [{ key: "tabla", label: "Tabla nutricional", tipo: "tabla" }],
      },
    ],
    defaults: {
      titulo: "Tabla nutricional",
      intro: "Información nutricional de nuestros productos (valores por la porción indicada).",
      tabla: {
        columnas: [
          "Categoría",
          "Productos",
          "Porción (g/ml)",
          "Valor Energético (Kcal)",
          "Proteína (g)",
          "Grasas Totales (g)",
          "Saturadas (g)",
          "Carbohidratos (g)",
          "Fibra (g)",
          "Sodio (mg)",
        ],
        filas: [
          ["BARRAS", "Barras Proteicas | Clásicas", "100", "499", "37,98", "27,48", "3,66", "18,66", "5,9", "107,3"],
          ["", "Barras Proteicas | Coco", "100", "503", "33,77", "30,26", "6,43", "18,63", "6,3", "87,3"],
          ["", "Barras Proteicas | Chocolate", "100", "488", "31,82", "32,92", "6,63", "19,90", "9,2", "70,4"],
          ["", "Barras Proteicas | Cajú", "100", "499", "28,73", "28,95", "5,12", "28,66", "3,8", "78,0"],
          ["HÚMEDOS", "Hummus | Lentejón", "100", "169", "9,60", "4,69", "0,71", "23,19", "1,6", "401,6"],
          ["", "Hummus | Garbanzo", "100", "279", "5,44", "21,79", "3,54", "16,57", "4,6", "369,1"],
          ["", "Crema | Maní", "100", "608", "26,80", "52,00", "6,80", "4,00", "11,2", "0,0"],
          ["", "Crema | Cajú", "100", "589", "18,75", "48,27", "8,46", "20,63", "6,3", "0,0"],
          ["SECOS", "Granola Del Día | Clásica", "100", "364", "10,54", "11,03", "2,44", "58,14", "46,3", "21,6"],
          ["", "Galletas Artesanales | Cracker", "100", "313", "7,06", "16,56", "2,63", "37,90", "4,7", "822,8"],
          ["", "Mix Frutos Secos | Clásico", "100", "443", "13,23", "31,79", "5,44", "31,76", "6,0", "1,1"],
        ],
      },
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
