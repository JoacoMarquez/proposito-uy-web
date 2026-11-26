// "Asesoramiento por WhatsApp incluido": característica de producto que se
// activa desde el panel (ej. Bancal | Madera). Muestra un distintivo en la
// tarjeta y la ficha, y un recuadro explicativo en la ficha. No es instalación
// presencial: es orientación por WhatsApp, incluida en el precio.

export const ASESORAMIENTO_DISTINTIVO = "Asesoramiento por WhatsApp incluido";

export const ASESORAMIENTO_TEXTO_POR_DEFECTO =
  "Te acompañamos con orientación personalizada por WhatsApp para elegir dónde instalar el producto y cómo comenzar a utilizarlo, sin costo adicional.";

// Texto del recuadro: el propio del producto o, si quedó vacío, el por defecto.
export function textoAsesoramiento(texto: string | null | undefined): string {
  return String(texto ?? "").trim() || ASESORAMIENTO_TEXTO_POR_DEFECTO;
}
