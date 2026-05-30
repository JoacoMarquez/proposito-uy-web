// Preguntas frecuentes (contenido real del documento), organizadas por tema.
// Cada pregunta tiene micro-resumen visible y desarrollo al desplegar.

export type TemaPregunta = "pedidos" | "elaboracion" | "nutricional";

export interface Pregunta {
  tema: TemaPregunta;
  pregunta: string;
  microResumen: string;
  desarrollo: string[];
}

export const temas: Record<TemaPregunta, { nombre: string; descripcion: string }> = {
  pedidos: {
    nombre: "Pedidos",
    descripcion:
      "Te explicamos cómo funciona la compra, la agenda de retiros y entregas, para que sea claro y previsible.",
  },
  elaboracion: {
    nombre: "Elaboración",
    descripcion:
      "Te contamos cómo elaboramos nuestros productos, qué ingredientes usamos y qué criterios guían cada decisión.",
  },
  nutricional: {
    nombre: "Nutricional",
    descripcion:
      "Te mostramos cómo leer la información nutricional y qué significa cada tabla para comparar productos con criterio.",
  },
};

export const preguntas: Pregunta[] = [
  // ── PEDIDOS ──
  {
    tema: "pedidos",
    pregunta: "¿Cómo es el paso a paso para comprar en la web?",
    microResumen: "El proceso completo, desde el carrito hasta la recepción de tu pedido.",
    desarrollo: [
      "Paso 0 — Crear tu cuenta o iniciar sesión, para agilizar la compra y consultar tus pedidos.",
      "Paso 1 — Armá tu carrito: elegís productos, seleccionás la presentación, ajustás cantidades y revisás el subtotal.",
      "Paso 2 — Elegí la modalidad: entrega a domicilio o retiro en planta (Punta Gorda, Montevideo).",
      "Paso 3 — Elegí la agenda: miércoles, viernes o coordinación personalizada. Retiros de 12 a 15 h; entregas de 15 a 18 h.",
      "Paso 4 — Dejá aclaraciones en Notas del pedido (sabores de Barras Mix, retornables, referencias).",
      "Paso 5 — Elegí el método de pago: transferencia (enviás comprobante por WhatsApp) o efectivo.",
      "Paso 6 — Recibís o retirás tu pedido en el día agendado.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Qué días y en qué franja horaria trabajamos la distribución?",
    microResumen: "Miércoles y viernes de 12 a 18 hs.",
    desarrollo: [
      "Distribuimos dos veces por semana: miércoles y viernes, de 12:00 a 18:00 hs.",
      "Dentro de esa ventana: retiros de 12:00 a 15:00 y entregas de 15:00 a 18:00.",
      "El retiro se realiza en la planta de Punta Gorda; la dirección se informa al hacer el pedido.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "Si necesito otra cosa, ¿hay flexibilidad?",
    microResumen: "Sí: un ajuste dentro del rango, o “Coordinación personalizada” si no te sirven los días.",
    desarrollo: [
      "Trabajamos con días fijos (miércoles y viernes) para cuidar producción y recorrido.",
      "Si tu pedido entra en esos días, elegí el día y dejá tu preferencia en Notas del pedido. Lo tomamos como preferencia y lo intentamos ajustar.",
      "Si no podés adaptarte, seleccioná “Coordinación personalizada” y coordinamos por WhatsApp una alternativa.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Qué pasa si mi pedido llega en mal estado?",
    microResumen: "Lo resolvemos como vos prefieras: cambio o devolución total.",
    desarrollo: [
      "Empaquetamos cada pedido para que llegue en las mejores condiciones.",
      "Si aún así llega con algún problema, escribinos con tu número de pedido y, si podés, una foto. Resolvemos con reposición del producto o devolución total del monto.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Qué pasa si no estoy cuando llega la entrega (o llego tarde al retiro)?",
    microResumen: "Lo resolvemos, pero necesitamos aviso para no romper el recorrido.",
    desarrollo: [
      "Si no estás en el momento de la entrega o se complica el retiro, lo ideal es avisar apenas puedas.",
      "Reprogramamos dentro de lo posible según el recorrido y la agenda del día.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Cómo cuidamos los productos durante la distribución?",
    microResumen: "Orden, embalaje y cuidado para que llegue como tiene que llegar.",
    desarrollo: [
      "Empaquetamos cada pedido de forma prolija y lo trasladamos con cuidado.",
      "Cadena de frío: para barras y hummus (que se entregan congelados) usamos freezer portátil durante el traslado.",
      "Al recibir, guardá cada producto según corresponda (ambiente / heladera / freezer).",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Cuánto cuesta la entrega?",
    microResumen: "Gratis en zonas cercanas y desde $U3.000. Si no, $U250.",
    desarrollo: [
      "La entrega es gratis en Buceo, Malvín, Punta Gorda y Carrasco, por ser zonas cercanas a nuestra planta.",
      "También es gratis en pedidos de $U3.000 o más, aunque la dirección esté fuera de esas zonas.",
      "Si no se cumple ninguna condición, el costo es de $U250 para otras zonas de Montevideo y Ciudad de la Costa. El costo final siempre se muestra en el checkout.",
    ],
  },
  {
    tema: "pedidos",
    pregunta: "¿Puedo cambiar la agenda después de confirmar el pedido?",
    microResumen: "Sí, pero se coordina por WhatsApp y depende del momento del pedido.",
    desarrollo: [
      "Si necesitás cambiar el día, la modalidad o algún detalle, escribinos por WhatsApp con tu número de pedido.",
      "Los cambios se resuelven según el estado de preparación, la agenda disponible y el recorrido de distribución.",
    ],
  },

  // ── ELABORACIÓN ──
  {
    tema: "elaboracion",
    pregunta: "¿Cómo elaboramos nuestros productos?",
    microResumen: "Artesanal, en tandas chicas, con control real del proceso.",
    desarrollo: [
      "Todos nuestros productos se elaboran de manera artesanal, en pequeñas tandas, priorizando el control del proceso y la calidad final.",
      "No trabajamos con líneas industriales ni producción masiva: cada etapa respeta el ingrediente y el resultado.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Qué significa “ingredientes reales” para nosotros?",
    microResumen: "Menos polvos mágicos y más ingredientes de verdad.",
    desarrollo: [
      "Trabajamos con ingredientes reales, sin conservantes, aditivos, colorantes, aceites industriales ni harinas refinadas.",
      "Todo nuestro catálogo es apto para personas vegetarianas. Creemos que comer simple es comer mejor.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Cómo cuidamos la higiene y la manipulación?",
    microResumen: "Orden, limpieza y un manejo responsable en nuestro trabajo.",
    desarrollo: [
      "Cuidamos cada etapa: limpieza, orden, trazabilidad y manipulación responsable de los alimentos.",
      "La producción se realiza en un entorno controlado, con prácticas constantes de higiene. Nuestro foco no es acelerar: es hacer las cosas bien.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Nuestros productos tienen gluten?",
    microResumen: "Puede haber trazas. No es apto para personas celíacas.",
    desarrollo: [
      "No estamos certificados sin TACC y trabajamos con ingredientes que pueden contener trazas de gluten por contaminación cruzada.",
      "Por eso no recomendamos el consumo en personas celíacas ni en dietas estrictas libres de gluten.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Cuál es nuestro enfoque al tomar decisiones?",
    microResumen: "Transparencia, cuidado y coherencia antes que marketing.",
    desarrollo: [
      "Cada decisión se toma bajo una filosofía de respeto, transparencia y cuidado, priorizando la calidad del alimento final.",
      "Buscamos coherencia entre lo que hacemos, creemos y ofrecemos. Toda la propuesta es apta para vegetarianos (no totalmente vegana: usamos miel y whey en algunos productos).",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Por qué a veces un producto no está disponible? ¿Trabajan con stock?",
    microResumen: "Stock básico + producción por pedido para priorizar frescura.",
    desarrollo: [
      "Manejamos un stock básico, pero en general producimos en base a pedido para que recibas el producto lo más fresco posible.",
      "Si algo no aparece disponible, es porque preferimos pausar antes que forzar producción o bajar calidad.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Por qué usamos frío como método de conservación?",
    microResumen: "Sin conservantes: el frío cuida sin traicionar el alimento.",
    desarrollo: [
      "Para evitar conservantes y mantener el valor nutricional, usamos la conservación por frío como método principal.",
      "Por eso en barras y hummus trabajamos con stock conservado en frío, sin agregar cosas que no aportan valor.",
    ],
  },
  {
    tema: "elaboracion",
    pregunta: "¿Cómo cuidamos nuestros procesos y su impacto en el entorno?",
    microResumen: "Packaging simple, retornables y compostaje para reducir residuos.",
    desarrollo: [
      "Elegimos un packaging simple y minimalista, y buscamos materiales biodegradables cuando es posible.",
      "Sostenemos una política de retornables para reutilizar los frascos de vidrio, y compostamos los residuos orgánicos para el invernadero junto a nuestro espacio de elaboración.",
    ],
  },

  // ── NUTRICIONAL ──
  {
    tema: "nutricional",
    pregunta: "¿Cómo leer nuestras tablas nutricionales?",
    microResumen: "Qué tabla usar para comparar y cuál para tu rutina.",
    desarrollo: [
      "En el link vas a encontrar cuatro tablas: Genérica (por 100 g, ideal para comparar), Sedentarios, Activos y Deportistas.",
      "Regla simple: para comparar productos usá la Genérica (100 g); para una referencia de porción, mirá la tabla de tu perfil.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Qué información aparece en cada tabla?",
    microResumen: "Lo que medimos en nuestras tablas.",
    desarrollo: [
      "Cada tabla detalla, según corresponda: valor energético (kcal), proteínas, grasas totales y saturadas, carbohidratos, fibra y sodio.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Las porciones son fijas?",
    microResumen: "No: son guías. Tu cuerpo tiene la última palabra.",
    desarrollo: [
      "Las porciones son referencias orientativas para equilibrar tu ingesta según tu actividad, apetito y sensaciones.",
      "Si querés comparar entre productos, volvé a la Tabla Genérica (100 g).",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Cuándo conviene consumir cada uno de nuestros productos?",
    microResumen: "Te explicamos cómo aprovechar al máximo nuestros productos.",
    desarrollo: [
      "Barras: ideales post-actividad o en momentos de alta demanda.",
      "Cremas: energía sostenida; mejor por la mañana o antes de la actividad física.",
      "Mix de frutos secos: snack práctico entre comidas o antes/después de entrenar.",
      "Galletas: densas y saciantes, muy bien a media mañana o tarde.",
      "Granola: para romper el ayuno o merienda post-entreno.",
      "Hummus: proteína vegetal y fibra; ideal para la tarde, cena o como acompañamiento.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Cuánto recomendamos por día según tu perfil?",
    microResumen: "Porciones orientativas según tu movimiento diario.",
    desarrollo: [
      "Sedentarios: Barras 20 g · Cremas 20 g · Mix 60 g · Galletas 60 g · Granola 45 g · Hummus 60 g.",
      "Activos: Barras 40 g · Cremas 40 g · Mix 80 g · Galletas 90 g · Granola 60 g · Hummus 80 g.",
      "Deportistas: Barras 80 g · Cremas 60 g · Mix 100 g · Galletas 120 g · Granola 75 g · Hummus 100 g.",
      "Consultá con un profesional si querés algo 100% personalizado. Empezá de a poco y observá cómo te cae.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Cómo empezar si nunca probaste nuestros productos?",
    microResumen: "Probá de a poco, observá cómo te cae y elegí según tu rutina.",
    desarrollo: [
      "No todos los cuerpos digieren igual las fibras, frutos secos, legumbres y semillas. Probá una presentación chica o una porción moderada primero.",
      "Observá señales útiles: digestión, energía, saciedad, descanso y claridad mental.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Por qué los valores pueden variar levemente?",
    microResumen: "Porque trabajamos con ingredientes reales, que varían según las estaciones.",
    desarrollo: [
      "Variaciones de cosecha/proveedor (estación, origen y tierra), ingredientes vivos sin conservantes y ajustes mínimos de receta pueden mover levemente los valores, siempre manteniendo calidad y equilibrio.",
    ],
  },
  {
    tema: "nutricional",
    pregunta: "¿Qué tienen (y qué evitamos) en nuestros productos?",
    microResumen: "Ingredientes reales, decisiones claras y criterios explicados.",
    desarrollo: [
      "Como regla general no usamos conservantes, aditivos, colorantes, aceites industriales, harinas refinadas, azúcar refinada ni endulzantes artificiales.",
      "Cuando buscamos dulzor, usamos miel o dátiles. El aporte proteico de las barras viene de whey sin lactosa. Sobre gluten: puede haber trazas, no apto para celíacos.",
    ],
  },
];

export function preguntasPorTema(tema: TemaPregunta): Pregunta[] {
  return preguntas.filter((p) => p.tema === tema);
}
