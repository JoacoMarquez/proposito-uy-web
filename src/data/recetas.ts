// Recetario. Contenido real del documento base. Cada receta genera su página interna.
// El orden y los títulos respetan el documento (no existe "Sopa Cremosa"; es "Poke Vegetal").

export interface Rendimiento {
  cantidad: string;
  porcion?: string;
  porciones?: string;
  tiempo: string;
}

export interface Receta {
  slug: string;
  titulo: string;
  descripcion: string;
  productosAliados: string[]; // slugs de productos de la tienda
  almacenamiento?: { envase: string; vidaUtil: string };
  rendimiento?: Rendimiento;
  ingredientes: string[];
  procedimiento: string[];
  imagen?: string;
}

export const recetas: Receta[] = [
  {
    slug: "alioli-casero",
    titulo: "Alioli Casero",
    descripcion:
      "Suave, cremoso y con ese irresistible toque a ajo que despierta los sentidos. El ajo aporta carácter, el limón un frescor vibrante y el aceite de oliva une todo en una emulsión sedosa. Ideal para acompañar con nuestras galletas artesanales en una picada con amigos.",
    productosAliados: ["galletas-artesanales-cracker"],
    almacenamiento: { envase: "Frasco de vidrio con tapa de 250 ml.", vidaUtil: "4 días – Refrigerador." },
    rendimiento: { cantidad: "200 g", porcion: "40 g", porciones: "5 unidades", tiempo: "20 minutos" },
    ingredientes: [
      "130 g (⅓ taza) – Aceite de oliva.",
      "50 g (1 unidad) – Huevo mediano.",
      "15 g (¼ unidad) – Limón.",
      "2,5 g (1 unidad) – Ajo.",
      "2,5 g (1 cucharadita) – Sal marina.",
    ],
    procedimiento: [
      "Reunir todos los utensilios e ingredientes antes de comenzar.",
      "Cortar el ajo y el cuarto de limón con cuchillo y tabla. Ajustar según el nivel de acidez deseado.",
      "En un recipiente mediano, colocar el huevo (a temperatura ambiente), el limón, el ajo y la sal.",
      "Mezclar con mixer hasta obtener una consistencia homogénea, sin pasarse (genera espuma).",
      "Medir el aceite de oliva (más si se prefiere una textura más líquida).",
      "Incorporar el aceite al hilo mientras se mezcla, para una emulsión perfecta. Si se corta, agregar un huevo fresco y volver a mezclar.",
      "Transferir a un frasco de vidrio y refrigerar.",
      "Disfrutar con nuestras Galletas Artesanales, ideales para untar.",
    ],
  },
  {
    slug: "pan-rustico",
    titulo: "Pan Rústico",
    descripcion:
      "Un pan para acompañar comidas compartidas, alternativa casera y nutritiva a los panes tradicionales. Elaborado con harina de trigo sarraceno, avena, huevo, chía hidratada, oliva, levadura y un toque de miel. Ideal para servir con nuestro hummus de garbanzo.",
    productosAliados: ["hummus-garbanzo"],
    almacenamiento: { envase: "Molde cubierto con film.", vidaUtil: "4 días – Refrigerador." },
    rendimiento: { cantidad: "650 g", porcion: "50 g", porciones: "13 unidades", tiempo: "2 h 30 min (incluye leudado, horneado y enfriado)" },
    ingredientes: [
      "200 g (1 taza) – Harina de trigo sarraceno.",
      "180 ml (¾ taza) – Agua tibia.",
      "100 g (½ taza) – Harina de avena.",
      "100 g (2 unidades) – Huevos.",
      "60 g (3 cdas soperas) – Agua (hidratación de chía).",
      "30 g (2 cdas soperas) – Aceite de oliva.",
      "15 g (1 cda sopera) – Semillas de chía.",
      "15 g (1 cda sopera rasa) – Miel.",
      "10 g (1 sobre) – Levadura seca.",
      "8 g (1 cucharadita y ½) – Sal marina.",
    ],
    procedimiento: [
      "Hidratar la chía con 60 g de agua durante 10–15 minutos hasta formar un gel.",
      "Mezclar los secos: harina de sarraceno, harina de avena, levadura y sal.",
      "Incorporar los húmedos: gel de chía, huevos, miel, aceite y 180 ml de agua tibia.",
      "Mezclar hasta obtener una preparación húmeda, espesa y pareja (no es una masa tradicional).",
      "Ajustar la textura con agua tibia de a poco si queda muy seca (máx. ~200 ml).",
      "Preparar el molde con un poco de oliva y papel manteca en cruz.",
      "Verter la mezcla de a poco y alisar la superficie.",
      "Cortar el sobrante de papel y plegar los laterales hacia adentro, dejando una línea central libre.",
      "Dejar leudar 60 minutos.",
      "Precalentar el horno a 160 °C y hornear 28 minutos hasta que esté firme y dorado.",
      "Enfriar en el molde 30 minutos, desmoldar y enfriar completamente antes de cortar.",
      "Cortar en rebanadas y servir con nuestro Hummus | Garbanzo por encima.",
    ],
  },
  {
    slug: "poke-vegetal",
    titulo: "Poke Vegetal",
    descripcion:
      "Propósito empezó vendiendo bowls de ensaladas. Este poke recupera ese origen: base de hojas verdes, vegetales, palta y chía, terminado con nuestro hummus de la casa como aderezo cremoso. Ideal para almorzar liviano.",
    productosAliados: ["hummus-lentejon"],
    almacenamiento: { envase: "Bowl cubierto / recipiente hermético.", vidaUtil: "24 horas – Refrigerador." },
    rendimiento: { cantidad: "365 g", porcion: "365 g", porciones: "1 unidad", tiempo: "30 minutos" },
    ingredientes: [
      "100 g (4 cdas soperas) – Tomates cherry.",
      "80 g (4 cdas soperas) – Zanahoria rallada.",
      "70 g (½ unidad) – Palta.",
      "60 g (3 cdas soperas) – Hummus | Lentejón.",
      "50 g (6 hojas) – Mix de verdes.",
      "5 g (1 cucharadita) – Semillas de chía.",
    ],
    procedimiento: [
      "Lavar las hojas verdes, cortarlas en tiras finas y colocarlas como base en el bowl.",
      "Lavar y rallar la zanahoria; colocarla en un sector del bowl.",
      "Lavar los tomates cherry, cortarlos a la mitad y ubicarlos en otro sector.",
      "Cortar la palta en láminas finas y agregarla (casi al final, para que no se oxide).",
      "Esparcir las semillas de chía por encima de los vegetales.",
      "Distribuir el hummus de lentejón en líneas/vetas sobre la preparación.",
      "Al comer, mezclar suavemente para integrar los sabores.",
    ],
  },
  {
    slug: "chia-pudding",
    titulo: "Chía Pudding",
    descripcion:
      "Una de las formas más simples y nutritivas de preparar un desayuno. Combina la cremosidad del yogurt, la textura suave de la chía hidratada y el frescor de los arándanos, con nuestra granola por encima. Ideal para dejar listo la noche anterior.",
    productosAliados: ["granola-del-dia-clasica"],
    almacenamiento: { envase: "Bollón de vidrio con tapa hermética de 500 ml.", vidaUtil: "24 horas – Refrigerador." },
    rendimiento: { cantidad: "320 g", porcion: "320 g", porciones: "1 unidad", tiempo: "20 min (con 12 h de hidratación)" },
    ingredientes: [
      "160 g (8 cdas soperas) – Yogurt natural.",
      "75 g (5 cdas soperas) – Granola Del Día | Clásica.",
      "60 g (2 cdas soperas) – Arándanos.",
      "25 g (2 cdas soperas) – Semillas de chía.",
    ],
    procedimiento: [
      "Lavar los arándanos y dividirlos en dos tandas.",
      "Mezclar el yogurt, la chía y la primera tanda de arándanos hasta integrar.",
      "Transferir a un bollón de vidrio dejando espacio en la parte superior.",
      "Refrigerar al menos 4 horas, idealmente toda la noche.",
      "Al consumir, agregar la granola y la segunda tanda de arándanos por encima.",
      "Disfrutar directo o mezclar suavemente para integrar.",
    ],
  },
  {
    slug: "snack-nutritivo",
    titulo: "Snack Nutritivo",
    descripcion:
      "Un bowl simple y nutritivo, armado en zonas intercaladas de crema de cajú, mix de frutos secos y banana fresca. Al integrarlo se forman vetas cremosas y zonas crujientes. Snack armado en minutos para consumir en el día.",
    productosAliados: ["crema-caju", "mix-frutos-secos-clasico"],
    almacenamiento: { envase: "Bowl mediano.", vidaUtil: "24 horas – Refrigerador." },
    rendimiento: { cantidad: "220 g", porcion: "220 g", porciones: "1 unidad", tiempo: "20 minutos" },
    ingredientes: [
      "100 g (1 unidad) – Banana.",
      "80 g (4 cdas soperas) – Mix Frutos Secos | Clásico.",
      "40 g (1 cda sopera) – Crema | Cajú.",
    ],
    procedimiento: [
      "Pelar la banana y cortarla en círculos finos.",
      "Elegir un bowl mediano y limpio.",
      "Colocar la banana en un sector del bowl.",
      "Agregar el mix de frutos secos formando un segundo sector.",
      "Agregar la crema de cajú al costado, formando el tercer sector.",
      "Al comer, mezclar suavemente con movimientos envolventes para generar vetas.",
      "Consumir en el momento o conservar refrigerado.",
    ],
  },
  {
    slug: "trufas-energeticas",
    titulo: "Trufas Energéticas",
    descripcion:
      "Pequeños bocados de energía y sabor, elaborados con crema de maní, avena y cacao. Textura suave con el aporte crujiente de los frutos secos. Sin horno y listas en minutos.",
    productosAliados: ["crema-mani"],
    almacenamiento: { envase: "Recipiente hermético.", vidaUtil: "2 semanas – Refrigerador." },
    rendimiento: { cantidad: "360 g (12 trufas)", porcion: "30 g (1 trufa)", porciones: "12 unidades", tiempo: "20 min (con 1 h de refrigeración)" },
    ingredientes: [
      "120 g (½ taza) – Crema | Maní.",
      "100 g (⅓ taza) – Miel.",
      "90 g (1 taza) – Harina de avena.",
      "30 g (1 cda sopera) – Nueces.",
      "20 g (1 cda sopera) – Cacao.",
    ],
    procedimiento: [
      "Combinar la harina de avena, el cacao y las nueces trituradas.",
      "Agregar la crema de maní y la miel; mezclar hasta una masa homogénea.",
      "Formar bolitas con las manos (se puede pesar en 30 g para 12 unidades iguales).",
      "Refrigerar 1 hora sobre papel manteca en un recipiente para que se compacten.",
      "Servir frías como snack energético o postre saludable.",
    ],
  },
  {
    slug: "torta-proteica",
    titulo: "Torta Proteica",
    descripcion:
      "Una torta fría, práctica y nutritiva, con nuestra barra proteica de chocolate como base firme. Por encima, yogurt natural y un toque de semillas de zapallo. Postre proteico sin horno.",
    productosAliados: ["barras-proteicas-chocolate"],
    almacenamiento: { envase: "Molde de torta cubierto con film.", vidaUtil: "1 mes – Congelador." },
    rendimiento: { cantidad: "740 g", porcion: "50 g", porciones: "15 unidades", tiempo: "20 min (con 2 h de refrigeración)" },
    ingredientes: [
      "480 g (12 unidades) – Barras Proteicas | Chocolate.",
      "260 g (1 taza) – Yogurt griego natural.",
      "10 g (½ cda sopera) – Semillas de zapallo.",
    ],
    procedimiento: [
      "Aplastar las barras de chocolate en un molde forrado con papel manteca, formando una base compacta y uniforme.",
      "Extender el yogurt sobre la base de manera pareja con una espátula.",
      "Esparcir las semillas de zapallo por encima.",
      "Llevar al freezer al menos 2 horas hasta que esté firme.",
      "Retirar del molde, dejar ablandar unos minutos y cortar en porciones.",
    ],
  },
  {
    slug: "alfa-prote",
    titulo: "Alfa Prote",
    descripcion:
      "Un alfajor proteico simple y delicioso, con nuestras barras proteicas de chocolate y relleno de crema de cajú. Presentación inspirada en el alfajor tradicional, pero con ingredientes reales.",
    productosAliados: ["barras-proteicas-chocolate", "crema-caju"],
    almacenamiento: { envase: "Recipiente hermético.", vidaUtil: "1 semana – Refrigerador." },
    rendimiento: { cantidad: "180 g", porcion: "60 g", porciones: "3 unidades", tiempo: "15 min (con 1 h de congelador)" },
    ingredientes: [
      "120 g (3 unidades) – Barras Proteicas | Chocolate.",
      "60 g (1 cda sopera y ½) – Crema | Cajú.",
    ],
    procedimiento: [
      "Cortar cada una de las 3 barras de chocolate en dos mitades iguales.",
      "Apoyar cada mitad en un molde circular de 6 cm para formar 6 tapas circulares.",
      "Presionar hasta lograr una forma pareja y compacta.",
      "Congelar las 6 tapas 30 minutos para que tomen rigidez.",
      "Colocar ½ cda sopera de crema de cajú sobre 3 tapas (las bases), sin llegar a los bordes.",
      "Cerrar con las tapas superiores y alisar los costados con espátula.",
      "Congelar los alfajores armados al menos 30 minutos más.",
      "Retirar unos minutos antes de consumir y servir frío (no completamente duro).",
    ],
  },
];

export function getReceta(slug: string): Receta | undefined {
  return recetas.find((r) => r.slug === slug);
}
