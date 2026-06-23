import type { APIRoute } from "astro";
import { getProducto, getContenido, crearPedido, type ItemPedido } from "../../db/queries";
import { enviarMailsPedido } from "../../lib/mail";
import { validarAgenda } from "../../lib/agenda";
import { MIX_SLUG, RECARGO_CAJU, mixValido, precioMix, etiquetaMix, type MixDetalle } from "../../lib/barrasMix";

export const prerender = false;

const ENVIO = 250;
const ENVIO_GRATIS_DESDE = 3000;

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

  if (!nombre || !celular || !email || !modalidad || !agenda || !metodoPago) {
    return json({ error: "Faltan datos del pedido." }, 400);
  }
  if (!["entrega", "retiro"].includes(modalidad)) return json({ error: "Modalidad inválida." }, 400);
  const agendaOk = validarAgenda(agenda, fechaAgenda);
  if (!agendaOk) return json({ error: "Elegí un día de agenda válido." }, 400);
  if (modalidad === "entrega" && !direccion) return json({ error: "Falta la dirección de entrega." }, 400);
  if (!Array.isArray(items) || items.length === 0) return json({ error: "El carrito está vacío." }, 400);

  // Recargo de Cajú (Mix) editable desde Contenido › Tienda.
  const tiendaCfg = await getContenido("tienda");
  const recargoCaju = Math.max(0, parseInt(String(tiendaCfg?.recargoCajuMix ?? ""), 10) || RECARGO_CAJU);

  // Revalidar cada ítem contra la base (no confiamos en los precios del cliente).
  const validados: ItemPedido[] = [];
  let subtotal = 0;
  for (const it of items) {
    const prod = await getProducto(String(it?.slug ?? ""));
    if (!prod || !prod.disponible) continue;
    const cantidad = Math.max(1, Math.floor(Number(it?.cantidad) || 0));

    // Caja personalizada de Barras Mix: el precio se recalcula desde la regla,
    // tomando la base del tamaño desde la DB + recargo por barras de Cajú.
    if (prod.slug === MIX_SLUG && it?.mix) {
      const mix = it.mix as MixDetalle;
      if (!mixValido(mix)) continue;
      const base = prod.presentaciones.find((p) => p.label === mix.tamano);
      if (!base) continue;
      const precioUnitario = precioMix(base.precio, mix, recargoCaju);
      subtotal += precioUnitario * cantidad;
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
    subtotal += pres.precio * cantidad;
    validados.push({
      productoSlug: prod.slug,
      nombre: `${prod.nombre} | ${prod.variante}`,
      presentacion: pres.label,
      precioUnitario: pres.precio,
      cantidad,
    });
  }

  if (validados.length === 0) return json({ error: "No hay productos válidos en el carrito." }, 400);

  const costoEnvio = modalidad === "retiro" ? 0 : subtotal >= ENVIO_GRATIS_DESDE ? 0 : ENVIO;
  const total = subtotal + costoEnvio;

  const numero = await crearPedido(
    {
      nombre: String(nombre),
      celular: String(celular),
      email: String(email),
      direccion: modalidad === "entrega" ? String(direccion) : null,
      notas: notas ? String(notas) : null,
      modalidad: String(modalidad),
      agenda: agendaOk.agenda,
      fechaAgenda: agendaOk.fechaAgenda,
      metodoPago: String(metodoPago),
      subtotal,
      costoEnvio,
      total,
      clienteId: locals.cliente?.id ?? null,
    },
    validados,
  );

  // Mails de confirmación (best-effort: no bloquean ni rompen el pedido).
  await enviarMailsPedido({
    numero,
    nombre: String(nombre),
    email: String(email),
    celular: String(celular),
    direccion: modalidad === "entrega" ? String(direccion) : null,
    notas: notas ? String(notas) : null,
    modalidad: String(modalidad),
    agenda: agendaOk.agenda,
    fechaAgenda: agendaOk.fechaAgenda,
    metodoPago: String(metodoPago),
    subtotal,
    costoEnvio,
    total,
    items: validados,
  });

  return json({ numero }, 200);
};
