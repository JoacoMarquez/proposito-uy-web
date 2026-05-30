// Catálogo de productos con datos reales del documento base.
// Para agregar/editar un producto, modificá esta lista. Las páginas de Tienda,
// Catálogo y las fichas individuales se generan automáticamente desde acá.

export type Categoria = "secos" | "humedos" | "barras";

export interface Presentacion {
  label: string; // Ej: "½ kg", "x12", "280 g"
  precio: number; // en pesos uruguayos
}

export interface Producto {
  slug: string;
  nombre: string; // Ej: "Mix Frutos Secos"
  variante: string; // Ej: "Clásico"
  categoria: Categoria;
  descripcion: string;
  textoInformativo?: string; // Ej: aviso de producto congelado
  ingredientes: string;
  packaging: string;
  conservacion: string;
  uso?: string;
  vencimiento: string;
  tamanoUnitario?: string;
  contenido?: string; // para cajas combinadas
  presentaciones: Presentacion[];
  productoAliado?: string; // slug del producto aliado
  nota?: string; // aclaración extra (ej: Barras Mix)
  destacado?: boolean; // aparece en "Los más pedidos"
  // imagen: se completará al cargar las fotos del Drive.
  imagen?: string;
}

export interface EditorialCategoria {
  descripcionGeneral: string;
  caracteristicas: string[];
  notasCreador: string[];
}

export const categorias: Record<
  Categoria,
  { nombre: string; descripcion: string; editorial: EditorialCategoria }
> = {
  secos: {
    nombre: "Secos",
    descripcion: "Nuestra dispensa para acompañar tu rutina.",
    editorial: {
      descripcionGeneral:
        "Una dispensa de secos pensada para que puedas disfrutar a diario sin cansarte. Dentro de esta categoría conviven tres tipos de productos: frutos secos, galletas y granola.",
      caracteristicas: [
        "Sin lácteos",
        "Sin azúcar agregada",
        "Sin aceites industriales",
        "Sin harinas refinadas",
        "Sin aditivos ni conservantes",
      ],
      notasCreador: [
        "Esta categoría nació con una idea simple: armar una dispensa para todos los días que se sienta hogareña, práctica y hecha con criterio.",
        "La Granola Del Día nació buscando un equilibrio real entre sabor, nutrición y textura. Rica, sí, pero sin empalagar, elaborada exclusivamente con dulzores naturales. Por eso el nombre: está pensada para el consumo cotidiano.",
        "Las Galletas Artesanales son el producto más antiguo del catálogo y nacieron de una necesidad concreta: algo crocante, saciante y hecho a mano, con ingredientes nobles.",
        "El Mix de Frutos Secos fue pensado como snack práctico y nutritivo para el día a día. Cada ingrediente fue seleccionado para ofrecer una combinación equilibrada, rica y de muy buena calidad.",
      ],
    },
  },
  humedos: {
    nombre: "Húmedos",
    descripcion: "La frescura de nuestra identidad.",
    editorial: {
      descripcionGeneral:
        "Elaboraciones que nacen del equilibrio entre sabor, nutrición y nobleza. Dentro de esta categoría conviven dos familias distintas: Hummus, elaboraciones frescas a base de legumbres; y Cremas, untables obtenidos a partir de la molienda de frutos secos.",
      caracteristicas: [
        "Sin lácteos",
        "Sin azúcar agregada",
        "Sin aceites industriales",
        "Sin aditivos ni conservantes",
        "Sin tostar ni procesar excesivamente",
      ],
      notasCreador: [
        "Esta categoría nació para resolver algo simple: tener aliados reales en tus comidas. Untables que suman sabor y nutrición sin volverse pesados.",
        "Los Hummus fueron el punto de partida: aliados saludables en picadas o almuerzos, con un sabor honesto, la suavidad justa y sin perder profundidad.",
        "Las Cremas nacieron con la idea de lograr un untable suave, con un tostado leve que respete la nobleza del fruto seco. La de maní se elabora 100% pura; en la de cajú se incorpora un toque de aceite de oliva para una textura más cremosa.",
      ],
    },
  },
  barras: {
    nombre: "Barras",
    descripcion: "Lo opuesto a una barra seca y artificial. Cremosa. Rica. Real.",
    editorial: {
      descripcionGeneral:
        "Energía real en formato simple. Nada de texturas secas ni sabores artificiales: solo lo esencial. Dentro de esta categoría conviven dos familias de productos: barras a base de crema de maní y una barra a base de crema de cajú.",
      caracteristicas: [
        "Sin lácteos",
        "Sin azúcar agregada",
        "Sin harinas refinadas",
        "Sin aceites industriales",
        "Sin aditivos ni conservantes",
      ],
      notasCreador: [
        "Esta categoría nació de la necesidad de encontrar una opción proteica que no solo sea funcional, sino también rica y placentera de comer.",
        "La base fue la Clásica, y con el tiempo sumamos Coco y Chocolate para ofrecer perfiles distintos sin cambiar la esencia.",
        "Para quienes no toleran el maní o prefieren el cajú, creamos la versión de Cajú, sin resignar textura ni rendimiento. Creemos que menos es mucho más.",
      ],
    },
  },
};

// Textos reutilizables
const CONSERVA_AMBIENTE =
  "Se almacena a temperatura ambiente, en lugar seco y sin exposición solar.";
const CONGELADO_INFO =
  "Este producto se entrega congelado. Se elabora y se congela en producción para conservarlo de forma segura, sin conservantes, y para que te llegue siempre en su mejor punto.";
const CONSERVA_HUMEDO_FRIO =
  "Se almacena congelado hasta su consumo. Una vez descongelado: mantener refrigerado y consumir dentro de 5 días. No volver a congelar.";
const VENC_BOLSA = "Ver vencimiento en la parte de abajo de la bolsa, según lote.";
const VENC_TAPA = "Ver vencimiento en la tapa del frasco, según lote.";

// Datos comunes a todas las Barras Proteicas
const barraComun = {
  textoInformativo: CONGELADO_INFO,
  packaging: "Bolsas de polipropileno PP dentro de caja de cartón.",
  conservacion: "Se almacena congelado hasta su consumo.",
  uso: "Para que quede en su punto ideal: bajala del freezer a la heladera 15 minutos antes de consumir, o 5 minutos a temperatura ambiente.",
  vencimiento: "Ver vencimiento en lengüeta de la caja, según lote.",
  tamanoUnitario: "40 g",
} as const;

export const productos: Producto[] = [
  // ── SECOS ──────────────────────────────────────────────
  {
    slug: "mix-frutos-secos-clasico",
    nombre: "Mix Frutos Secos",
    variante: "Clásico",
    categoria: "secos",
    descripcion:
      "Un mix de frutos secos nobles, con un perfil equilibrado y funcional. El aliado notable que te acompaña a todos lados.",
    ingredientes: "Castañas de cajú, nueces mariposa, dátiles medjoul y semillas de zapallo.",
    packaging: "Bolsa de aluminio kraft con válvula.",
    conservacion: CONSERVA_AMBIENTE,
    uso: "Ideal para tener a mano cuando necesitás una opción práctica entre comidas.",
    vencimiento: VENC_BOLSA,
    presentaciones: [{ label: "½ kg", precio: 580 }],
    productoAliado: "crema-caju",
  },
  {
    slug: "galletas-artesanales-cracker",
    nombre: "Galletas Artesanales",
    variante: "Cracker",
    categoria: "secos",
    descripcion:
      "Son ideales para acompañar comidas o picadas. Su perfil es crocante, versátil y saciante.",
    ingredientes:
      "Harina de trigo sarraceno, agua, harina de avena, aceite de oliva, chía y sal marina.",
    packaging: "Bolsa kraft con visor y cierre plegable.",
    conservacion: CONSERVA_AMBIENTE,
    uso: "Mantener la bolsa bien cerrada.",
    vencimiento: VENC_BOLSA,
    presentaciones: [
      { label: "½ kg", precio: 440 },
      { label: "1 kg", precio: 840 },
    ],
    productoAliado: "hummus-garbanzo",
    destacado: true,
  },
  {
    slug: "granola-del-dia-clasica",
    nombre: "Granola Del Día",
    variante: "Clásica",
    categoria: "secos",
    descripcion:
      "Para los amantes de la granola tradicional, la de siempre que nunca falla. Nutritiva y equilibrada, gracias a los frutos secos que suman textura y sabor.",
    ingredientes:
      "Avena arrollada, copos de maíz, miel, dátiles medjoul, castañas de cajú, nueces mariposa y semillas de zapallo.",
    packaging: "Bolsa de aluminio kraft con válvula.",
    conservacion: CONSERVA_AMBIENTE,
    uso: "Si se compacta, sacudir suavemente antes de servir.",
    vencimiento: VENC_BOLSA,
    presentaciones: [
      { label: "½ kg", precio: 460 },
      { label: "1 kg", precio: 860 },
    ],
    productoAliado: "crema-mani",
    destacado: true,
  },

  // ── HÚMEDOS ────────────────────────────────────────────
  {
    slug: "hummus-garbanzo",
    nombre: "Hummus",
    variante: "Garbanzo",
    categoria: "humedos",
    descripcion:
      "El sabor tradicional del hummus. Sabroso, simple y honesto, con el equilibrio justo entre cremosidad y frescura.",
    textoInformativo: CONGELADO_INFO,
    ingredientes: "Garbanzo, aceite de oliva, agua, limón, ajo, sal marina y pimentón dulce.",
    packaging: "Frasco de vidrio.",
    conservacion: CONSERVA_HUMEDO_FRIO,
    uso: "Al envasar, se congela con una capa de aceite de oliva para mejorar su cremosidad al descongelar. Se recomienda mezclar antes de consumir.",
    vencimiento: VENC_TAPA,
    presentaciones: [
      { label: "280 g", precio: 320 },
      { label: "Caja 280 g x6", precio: 1560 },
    ],
    productoAliado: "galletas-artesanales-cracker",
    destacado: true,
  },
  {
    slug: "hummus-lentejon",
    nombre: "Hummus",
    variante: "Lentejón",
    categoria: "humedos",
    descripcion:
      "Un hummus muy liviano, pensado para comer seguido. Hecho con una receta propia de la casa, de textura fluida y sabor especiado, ideal como aderezo en ensaladas.",
    textoInformativo: CONGELADO_INFO,
    ingredientes: "Lentejones, aceite de oliva, limón, agua, sal marina, albahaca y tomillo.",
    packaging: "Frasco de vidrio.",
    conservacion: CONSERVA_HUMEDO_FRIO,
    uso: "Al descongelarse, puede presentar una textura más fluida, propia de su receta. Se recomienda mezclar suavemente antes de consumir.",
    vencimiento: VENC_TAPA,
    presentaciones: [
      { label: "280 g", precio: 280 },
      { label: "Caja 280 g x6", precio: 1320 },
    ],
  },
  {
    slug: "hummus-mix",
    nombre: "Hummus",
    variante: "Mix",
    categoria: "humedos",
    descripcion:
      "Una caja combinada para tener tus hummus prontos en el freezer: 3 frascos de cada sabor. Variedad, practicidad y ahorro en una misma presentación.",
    textoInformativo: CONGELADO_INFO,
    ingredientes: "Disponibles en la ficha individual de cada versión.",
    packaging: "Frasco de vidrio.",
    conservacion: CONSERVA_HUMEDO_FRIO,
    uso: "Pensado para tener variedad lista en el freezer. Se descongela solo el frasco que se vaya a consumir, alternando entre Hummus | Garbanzo y Hummus | Lentejón.",
    vencimiento: VENC_TAPA,
    contenido: "3 frascos de Hummus | Garbanzo 280 g + 3 frascos de Hummus | Lentejón 280 g.",
    presentaciones: [{ label: "Caja 280 g x6", precio: 1440 }],
    productoAliado: "galletas-artesanales-cracker",
  },
  {
    slug: "crema-caju",
    nombre: "Crema",
    variante: "Cajú",
    categoria: "humedos",
    descripcion:
      "Untable de carácter suave y naturalmente dulce, elaborado a partir de castañas de cajú tostadas, con un pequeño toque de oliva para alcanzar una textura más cremosa.",
    ingredientes: "Castañas de cajú tostadas y aceite de oliva.",
    packaging: "Frasco de vidrio.",
    conservacion: CONSERVA_AMBIENTE,
    uso: "Si se separa el aceite de forma natural, mezclar antes de consumir.",
    vencimiento: VENC_TAPA,
    presentaciones: [
      { label: "180 g", precio: 380 },
      { label: "330 g", precio: 600 },
    ],
    productoAliado: "mix-frutos-secos-clasico",
  },
  {
    slug: "crema-mani",
    nombre: "Crema",
    variante: "Maní",
    categoria: "humedos",
    descripcion:
      "100% pura, elaborada únicamente a partir de maní levemente tostado, pensada para acompañar desayunos o darle cuerpo a preparaciones dulces y saladas.",
    ingredientes: "Maní repelado tostado.",
    packaging: "Frasco de vidrio.",
    conservacion: CONSERVA_AMBIENTE,
    uso: "Si se separa el aceite de forma natural, mezclar antes de consumir.",
    vencimiento: VENC_TAPA,
    presentaciones: [
      { label: "390 g", precio: 320 },
      { label: "1 kg", precio: 640 },
    ],
    productoAliado: "granola-del-dia-clasica",
    destacado: true,
  },

  // ── BARRAS ─────────────────────────────────────────────
  {
    slug: "barras-proteicas-clasica",
    nombre: "Barras Proteicas",
    variante: "Clásica",
    categoria: "barras",
    descripcion:
      "El complemento ideal para quienes buscan una opción funcional sin sabores agregados.",
    ingredientes: "Crema de maní, whey protein y miel.",
    presentaciones: [
      { label: "x12", precio: 528 },
      { label: "x24", precio: 1008 },
      { label: "x48", precio: 1920 },
    ],
    destacado: true,
    ...barraComun,
  },
  {
    slug: "barras-proteicas-coco",
    nombre: "Barras Proteicas",
    variante: "Coco",
    categoria: "barras",
    descripcion:
      "La incorporación del coco rallado le da una textura levemente más fibrosa y un sabor distinto, sin perder la cremosidad.",
    ingredientes: "Crema de maní, miel, whey protein y coco rallado.",
    presentaciones: [
      { label: "x12", precio: 528 },
      { label: "x24", precio: 1008 },
      { label: "x48", precio: 1920 },
    ],
    ...barraComun,
  },
  {
    slug: "barras-proteicas-chocolate",
    nombre: "Barras Proteicas",
    variante: "Chocolate",
    categoria: "barras",
    descripcion:
      "Para los fanáticos del chocolate real. Hecha con cacao, lo cual le aporta un perfil más intenso y corpulento.",
    ingredientes: "Crema de maní, miel, whey protein y cacao.",
    presentaciones: [
      { label: "x12", precio: 528 },
      { label: "x24", precio: 1008 },
      { label: "x48", precio: 1920 },
    ],
    ...barraComun,
  },
  {
    slug: "barras-proteicas-caju",
    nombre: "Barras Proteicas",
    variante: "Cajú",
    categoria: "barras",
    descripcion:
      "Nació como un sustituto perfecto de la crema de maní, para quienes procesan mejor o disfrutan más del cajú como ingrediente base de la barra.",
    ingredientes: "Crema de cajú, miel, whey protein y castañas de cajú.",
    presentaciones: [
      { label: "x12", precio: 768 },
      { label: "x24", precio: 1488 },
      { label: "x48", precio: 2880 },
    ],
    ...barraComun,
  },
  {
    slug: "barras-proteicas-mix",
    nombre: "Barras Proteicas",
    variante: "Mix",
    categoria: "barras",
    descripcion:
      "Podés combinar nuestras barras proteicas como prefieras, eligiendo los sabores que querés incluir en tu caja.",
    ingredientes: "Disponibles en la ficha individual de cada versión.",
    presentaciones: [
      { label: "x12", precio: 648 },
      { label: "x24", precio: 1248 },
      { label: "x48", precio: 2400 },
    ],
    nota: "Precio base para una caja con sabores Clásica, Coco y/o Chocolate. Cada barra de Cajú suma $U16. Indicanos el detalle de sabores al hacer el pedido por WhatsApp.",
    ...barraComun,
  },
];

// Helpers
export function productosPorCategoria(cat: Categoria): Producto[] {
  return productos.filter((p) => p.categoria === cat);
}

export function nombreCompleto(p: Producto): string {
  return `${p.nombre} | ${p.variante}`;
}

export function precioDesde(p: Producto): number {
  return Math.min(...p.presentaciones.map((pr) => pr.precio));
}

export function formatoPrecio(precio: number): string {
  return `$U${precio.toLocaleString("es-UY")}`;
}

export function getProducto(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug);
}

export const destacados = productos.filter((p) => p.destacado);
