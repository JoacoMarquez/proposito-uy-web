// Preguntas frecuentes, organizadas por tema (tabs del documento).
// "Todas" se arma automáticamente juntando los otros temas.

export type TemaPregunta = "elaboracion" | "pedidos" | "nutricional";

export interface Pregunta {
  tema: TemaPregunta;
  pregunta: string;
  respuesta: string;
}

export const temas: Record<TemaPregunta, string> = {
  elaboracion: "Elaboración",
  pedidos: "Pedidos",
  nutricional: "Nutricional",
};

// TODO: reemplazar por las preguntas/respuestas reales de la marca.
export const preguntas: Pregunta[] = [
  {
    tema: "elaboracion",
    pregunta: "¿Cómo elaboran los productos?",
    respuesta: "Texto pendiente: describir el proceso de elaboración artesanal.",
  },
  {
    tema: "pedidos",
    pregunta: "¿Cómo hago un pedido?",
    respuesta: "Texto pendiente: explicar el flujo de pedido por WhatsApp.",
  },
  {
    tema: "nutricional",
    pregunta: "¿Dónde veo la información nutricional?",
    respuesta: "Texto pendiente: enlazar las tablas nutricionales.",
  },
];

export function preguntasPorTema(tema: TemaPregunta): Pregunta[] {
  return preguntas.filter((p) => p.tema === tema);
}
