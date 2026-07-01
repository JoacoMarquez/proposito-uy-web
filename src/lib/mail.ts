// Mails transaccionales del pedido vía Brevo (mismo proveedor que el newsletter y
// el reseteo de contraseña; reusa enviarMailBrevo). Es "best-effort": si Brevo no
// está configurado o falla, no rompe el pedido, solo omite el envío.

import { site } from "../data/site";
import { formatoPrecio } from "../db/queries";
import { obtenerEnv, leerEnv } from "./env";
import { enviarMailBrevo } from "./brevo";

export interface PedidoMail {
  numero: string;
  nombre: string;
  email: string;
  celular: string;
  direccion: string | null;
  notas: string | null;
  modalidad: string; // "entrega" | "retiro"
  agenda: string; // "miercoles" | "viernes" | "coordinacion"
  fechaAgenda: string | null;
  metodoPago: string; // "transferencia" | "efectivo"
  subtotal: number;
  costoEnvio: number;
  total: number;
  items: { nombre: string; presentacion: string; precioUnitario: number; cantidad: number }[];
}

const VERDE = "#2D392C";
const CREMA = "#FBF8EF";
const GRIS = "#6b6b63";

function agendaTexto(p: PedidoMail): string {
  if (p.fechaAgenda) {
    const t = new Date(p.fechaAgenda + "T12:00:00Z").toLocaleDateString("es-UY", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  if (p.agenda === "coordinacion") return "Coordinación personalizada";
  return p.agenda === "miercoles" ? "Miércoles" : p.agenda === "viernes" ? "Viernes" : p.agenda;
}

function filasItems(p: PedidoMail): string {
  return p.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:6px 0;color:${VERDE}">${i.cantidad}× ${i.nombre} <span style="color:${GRIS}">(${i.presentacion})</span></td>
          <td style="padding:6px 0;text-align:right;color:${VERDE}">${formatoPrecio(i.precioUnitario * i.cantidad)}</td>
        </tr>`,
    )
    .join("");
}

function bloqueTotales(p: PedidoMail): string {
  return `
    <table style="width:100%;border-top:1px solid #eee;margin-top:8px;font-size:14px">
      ${filasItems(p)}
      <tr><td style="padding-top:8px;color:${GRIS}">Subtotal</td><td style="padding-top:8px;text-align:right;color:${VERDE}">${formatoPrecio(p.subtotal)}</td></tr>
      <tr><td style="color:${GRIS}">Envío</td><td style="text-align:right;color:${VERDE}">${p.costoEnvio === 0 ? "Gratis" : formatoPrecio(p.costoEnvio)}</td></tr>
      <tr><td style="font-weight:bold;color:${VERDE}">Total</td><td style="text-align:right;font-weight:bold;color:${VERDE}">${formatoPrecio(p.total)}</td></tr>
    </table>`;
}

function instruccionesPago(p: PedidoMail): string {
  if (p.metodoPago === "transferencia") {
    return `<p style="margin:4px 0;color:${VERDE}">Para confirmar tu pedido, realizá la transferencia y enviá el comprobante por WhatsApp al ${site.telefonoRetiro} indicando tu número de pedido <b>${p.numero}</b>.</p>`;
  }
  return `<p style="margin:4px 0;color:${VERDE}">Vas a abonar en efectivo al momento de la entrega o el retiro.</p>`;
}

function layout(titulo: string, cuerpo: string): string {
  return `<div style="background:${CREMA};padding:24px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px">
      <h1 style="color:${VERDE};font-size:20px;margin:0 0 4px">${site.nombre}</h1>
      <h2 style="color:${VERDE};font-size:16px;margin:0 0 16px">${titulo}</h2>
      ${cuerpo}
      <p style="color:${GRIS};font-size:12px;margin-top:24px">Alimentos reales, honestos y nutritivos elaborados en Montevideo, Uruguay.</p>
    </div>
  </div>`;
}

function htmlConfirmacion(p: PedidoMail): string {
  const cuerpo = `
    <p style="color:${VERDE}">¡Gracias, ${p.nombre}! Recibimos tu pedido <b>${p.numero}</b>.</p>
    ${bloqueTotales(p)}
    <table style="width:100%;margin-top:16px;font-size:14px">
      <tr><td style="color:${GRIS}">Modalidad</td><td style="text-align:right;color:${VERDE}">${p.modalidad === "entrega" ? "Entrega a domicilio" : "Retiro en planta"}</td></tr>
      <tr><td style="color:${GRIS}">Agenda</td><td style="text-align:right;color:${VERDE}">${agendaTexto(p)}</td></tr>
      ${p.direccion ? `<tr><td style="color:${GRIS}">Dirección</td><td style="text-align:right;color:${VERDE}">${p.direccion}</td></tr>` : ""}
      ${p.modalidad === "retiro" ? `<tr><td style="color:${GRIS}">Retiro en</td><td style="text-align:right;color:${VERDE}">${site.direccionRetiro}</td></tr>` : ""}
    </table>
    <div style="background:${CREMA};border-radius:12px;padding:14px;margin-top:16px">
      <p style="margin:0 0 4px;font-weight:bold;color:${VERDE}">${p.metodoPago === "transferencia" ? "Pago por transferencia" : "Pago en efectivo"}</p>
      ${instruccionesPago(p)}
    </div>
    ${p.agenda === "coordinacion" ? `<p style="color:${GRIS};font-size:14px;margin-top:12px">Seleccionaste coordinación personalizada: coordinamos por WhatsApp el día y horario.</p>` : ""}`;
  return layout(`Pedido ${p.numero} recibido`, cuerpo);
}

function htmlAviso(p: PedidoMail): string {
  const cuerpo = `
    <p style="color:${VERDE}"><b>Nuevo pedido ${p.numero}</b></p>
    <table style="width:100%;font-size:14px">
      <tr><td style="color:${GRIS}">Cliente</td><td style="text-align:right;color:${VERDE}">${p.nombre}</td></tr>
      <tr><td style="color:${GRIS}">Celular</td><td style="text-align:right;color:${VERDE}">${p.celular}</td></tr>
      <tr><td style="color:${GRIS}">Email</td><td style="text-align:right;color:${VERDE}">${p.email}</td></tr>
      <tr><td style="color:${GRIS}">Modalidad</td><td style="text-align:right;color:${VERDE}">${p.modalidad === "entrega" ? "Entrega a domicilio" : "Retiro en planta"}</td></tr>
      <tr><td style="color:${GRIS}">Agenda</td><td style="text-align:right;color:${VERDE}">${agendaTexto(p)}</td></tr>
      ${p.direccion ? `<tr><td style="color:${GRIS}">Dirección</td><td style="text-align:right;color:${VERDE}">${p.direccion}</td></tr>` : ""}
      <tr><td style="color:${GRIS}">Pago</td><td style="text-align:right;color:${VERDE}">${p.metodoPago}</td></tr>
      ${p.notas ? `<tr><td style="color:${GRIS}">Notas</td><td style="text-align:right;color:${VERDE}">${p.notas}</td></tr>` : ""}
    </table>
    ${bloqueTotales(p)}`;
  return layout(`Nuevo pedido — ${p.nombre}`, cuerpo);
}

// Envía la confirmación al cliente y, si hay MAIL_ADMIN, un aviso/respaldo a
// Propósito con los datos del pedido (PROP-108). Nunca lanza.
export async function enviarMailsPedido(p: PedidoMail): Promise<void> {
  // En el Worker los secrets vienen de "cloudflare:workers" (no de process.env).
  const env = await obtenerEnv();
  const admin = leerEnv(env, "MAIL_ADMIN");
  try {
    // Confirmación al cliente.
    await enviarMailBrevo({
      to: p.email,
      subject: `Pedido ${p.numero} recibido · ${site.nombre}`,
      html: htmlConfirmacion(p),
    });
    // Aviso/respaldo al administrador. replyTo = cliente, para responderle directo.
    if (admin) {
      await enviarMailBrevo({
        to: admin,
        subject: `Nuevo pedido ${p.numero} — ${p.nombre}`,
        html: htmlAviso(p),
        replyTo: p.email,
      });
    }
  } catch (e) {
    console.error("[mail] Error en enviarMailsPedido:", e);
  }
}
