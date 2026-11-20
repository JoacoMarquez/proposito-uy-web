import type { APIRoute } from "astro";
import { getProducto, getContenido, getCategorias, crearPedido, type ItemPedido } from "../../db/queries";
import { esDigital } from "../../lib/cultivo";
import { enviarMailsPedido } from "../../lib/mail";
import { validarAgenda, parseLicencia } from "../../lib/agenda";
import { esSlugMix, RECARGO_CAJU, mixValido, precioMix, etiquetaMix, type MixDetalle } from "../../lib/barrasMix";
import { costoEnvio as calcularEnvio } from "../../lib/envio";

export const prerender = false;

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Datos inválidos." }, 400);
  }

  const { nombre, celular, email, direccion, notas, modalidad, agenda, fechaAgenda, metodoPago, items } = body ?? {};

  if (!nombre || !celular || !email) {
    return json({ error: "Faltan datos del pedido." }, 400);
  }
  if (!Array.isArray(items) || items.length === 0) return json({ error: "El carrito está vacío." }, 400);

  // Contenido editable (Contenido › Tienda): recargo Mix + período de licencia.
  const [tiendaCfg, catsCultivo] = await Promise.all([getContenido("tienda"), getCategorias("cultivo")]);
  const recargoCaju = Math.max(0, parseInt(String(tiendaCfg?.recargoCajuMix ?? ""), 10) || RECARGO_CAJU);
  // Categorías de productos digitales (Cultivo › Conocimiento): sin envío.
  const catsDigitales = new Set(catsCultivo.filter((c) => esDigital(c.tipo)).map((c) => c.slug));

  // Revalidar cada ítem contra la base (no confiamos en los precios del cliente).
  const validados: ItemPedido[] = [];
  let subtotal = 0;
  let subtotalFisico = 0; // solo productos físicos: es lo que cuenta para el envío
  const slugsDigitales = new Set<string>();
  for (const it of items) {
    const prod = await getProducto(String(it?.slug ?? ""));
    if (!prod || !prod.disponible) continue;
    const digital = catsDigitales.has(prod.categoriaSlug);
    // Guía sin PDF cargado: no se vende (no habría qué entregar).
    if (digital && !prod.archivoKey) continue;
    if (digital) slugsDigitales.add(prod.slug);
    // Digital: una sola unidad por compra (es un archivo).
    const cantidad = digital ? 1 : Math.max(1, Math.floor(Number(it?.cantidad) || 0));

    // Caja personalizada de Barras Mix: el precio se recalcula desde la regla,
    // tomando la base del tamaño desde la DB + recargo por barras de Cajú.
    if (esSlugMix(prod.slug) && it?.mix) {
      const mix = it.mix as MixDetalle;
      if (!mixValido(mix)) continue;
      const base = prod.presentaciones.find((p) => p.label === mix.tamano);
      if (!base) continue;
      const precioUnitario = precioMix(base.precio, mix, recargoCaju);
      subtotal += precioUnitario * cantidad;
      subtotalFisico += precioUnitario * cantidad;
      validados.push({
        productoSlug: prod.slug,
        nombre: `${prod.nombre} | ${prod.variante}`,
        presentacion: etiquetaMix(mix),
        precioUnitario,
        cantidad,
      });
      continue;
    }

    const pres = prod.presentaciones.find((p) => p.label === it?.presentacion);
    if (!pres) continue;
    // El mismo PDF dos veces en el carrito no suma: se cobra una sola vez.
    if (digital && validados.some((v) => v.productoSlug === prod.slug && v.presentacion === pres.label)) continue;
    subtotal += pres.precio * cantidad;
    if (!digital) subtotalFisico += pres.precio * cantidad;
    validados.push({
      productoSlug: prod.slug,
      nombre: `${prod.nombre} | ${prod.variante}`,
      presentacion: pres.label,
      precioUnitario: pres.precio,
      cantidad,
    });
  }

  if (validados.length === 0) return json({ error: "No hay productos válidos en el carrito." }, 400);

  // Pedido 100% digital: no hay entrega, retiro ni agenda, y se paga por
  // transferencia (el PDF se envía cuando se confirma el pago).
  const todosDigitales = validados.every((v) => slugsDigitales.has(v.productoSlug));

  let agendaOk: { agenda: string; fechaAgenda: string | null } | null;
  let modalidadFinal: "entrega" | "retiro" | "digital";
  let metodoFinal: string;
  if (todosDigitales) {
    modalidadFinal = "digital";
    agendaOk = { agenda: "digital", fechaAgenda: null };
    metodoFinal = "transferencia";
  } else {
    if (!["entrega", "retiro"].includes(modalidad)) return json({ error: "Elegí entrega a domicilio o retiro en planta." }, 400);
    if (!["transferencia", "efectivo"].includes(metodoPago)) return json({ error: "Elegí un método de pago." }, 400);
    // Rechaza fechas dentro de la licencia (además de ocultarlas en el checkout). (PROP-111)
    agendaOk = validarAgenda(agenda, fechaAgenda, parseLicencia(tiendaCfg));
    if (!agendaOk) return json({ error: "Elegí un día de agenda válido." }, 400);
    if (modalidad === "entrega" && !direccion) return json({ error: "Falta la dirección de entrega." }, 400);
    modalidadFinal = modalidad;
    metodoFinal = String(metodoPago);
  }

  const costoEnvio = calcularEnvio(subtotalFisico, modalidadFinal);
  const total = subtotal + costoEnvio;

  const datos = {
    nombre: String(nombre),
    celular: String(celular),
    email: String(email),
    direccion: modalidadFinal === "entrega" ? String(direccion) : null,
    notas: notas ? String(notas) : null,
    modalidad: modalidadFinal,
    agenda: agendaOk.agenda,
    fechaAgenda: agendaOk.fechaAgenda,
    metodoPago: metodoFinal,
    subtotal,
    costoEnvio,
    total,
  };

  const numero = await crearPedido({ ...datos, clienteId: locals.cliente?.id ?? null }, validados);

  // Mails de confirmación (best-effort: no bloquean ni rompen el pedido).
  await enviarMailsPedido({ numero, ...datos, items: validados });

  return json({ numero }, 200);
};
