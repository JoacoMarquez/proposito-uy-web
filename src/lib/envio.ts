// Lógica de costo de envío y nota informativa (PROP-109).
//
// Única fuente de verdad: los valores viven en `site.ts` (costoEnvio /
// envioGratisDesde). Antes la fórmula estaba duplicada y hardcodeada en el
// checkout (cliente) y en /api/pedidos (server); ahora ambos usan esto, así la
// nota que ve el cliente nunca puede diferir de lo que efectivamente se cobra.

import { site } from "../data/site";

export const COSTO_ENVIO = site.costoEnvio;
export const ENVIO_GRATIS_DESDE = site.envioGratisDesde;

export type Modalidad = "entrega" | "retiro";

/** Costo de envío para un subtotal y modalidad dados.
 *  0 si retira en planta o si el subtotal alcanza el mínimo de envío gratis. */
export function costoEnvio(subtotal: number, modalidad: Modalidad): number {
  if (modalidad === "retiro") return 0;
  return subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
}

/** Texto de la nota de envío para mostrar antes de confirmar el pedido.
 *  `formato` formatea importes (ej. formatoPrecio del carrito).
 *  Devuelve null cuando no corresponde mostrarla (retiro en planta). */
export function notaEnvio(
  subtotal: number,
  modalidad: Modalidad,
  formato: (n: number) => string,
): string | null {
  if (modalidad === "retiro") return null;
  if (subtotal >= ENVIO_GRATIS_DESDE) return "🎉 ¡Tu pedido tiene envío gratis!";
  const falta = ENVIO_GRATIS_DESDE - subtotal;
  return `Te faltan ${formato(falta)} para envío gratis (desde ${formato(ENVIO_GRATIS_DESDE)}).`;
}
