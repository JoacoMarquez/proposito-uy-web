import type { APIRoute } from "astro";
import { getProducto, crearPedido, type ItemPedido } from "../../db/queries";
import { enviarMailsPedido } from "../../lib/mail";

export const prerender = false;

const ENVIO = 250;
const ENVIO_GRATIS_DESDE = 3000;

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Valida la agenda: "coordinacion" (sin fecha) o un día puntual habilitado
// (miércoles/viernes, futuro). No confiamos en el tipo que manda el cliente:
// lo derivamos del día de la semana de la fecha elegida.
function validarAgenda(
  agenda: unknown,
  fechaAgenda: unknown,
): { agenda: string; fechaAgenda: string | null } | null {
  if (agenda === "coordinacion") return { agenda: "coordinacion", fechaAgenda: null };
  if (typeof fechaAgenda !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fechaAgenda)) return null;
  const d = new Date(fechaAgenda + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);
  if (d < hoy) return null; // no permitir fechas pasadas
  const wd = d.getUTCDay(); // 3 = miércoles, 5 = viernes
  if (wd !== 3 && wd !== 5) return null;
  return { agenda: wd === 3 ? "miercoles" : "viernes", fechaAgenda };
}

export const POST: APIRoute = async ({ request }) => {
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

  // Revalidar cada ítem contra la base (no confiamos en los precios del cliente).
  const validados: ItemPedido[] = [];
  let subtotal = 0;
  for (const it of items) {
    const prod = await getProducto(String(it?.slug ?? ""));
    if (!prod || !prod.disponible) continue;
    const pres = prod.presentaciones.find((p) => p.label === it?.presentacion);
    if (!pres) continue;
    const cantidad = Math.max(1, Math.floor(Number(it?.cantidad) || 0));
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
