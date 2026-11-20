// Entrega de PDFs de Cultivo por mail cuando se confirma el pago de un pedido:
// - Plantines: la ficha de cultivo de regalo.
// - Conocimiento: la guía comprada.
// Se manda un link de descarga personal por producto (ver lib/archivos.ts).

import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { categorias, pedidos, productos } from "../db/schema";
import { getPedidoById } from "../db/queries";
import { site } from "../data/site";
import { enviarMailBrevo } from "./brevo";
import { crearDescarga } from "./archivos";
import { DESCARGAS_POR_LINK } from "./archivos-limites";
import { llevaPdf } from "./cultivo";

export interface PdfDePedido {
  productoId: number;
  nombre: string; // "Cultivos | Fichas"
  tipo: string; // "plantines" | "conocimiento"
}

// Productos del pedido que tienen un PDF para entregar.
export async function pdfsDelPedido(slugs: string[]): Promise<PdfDePedido[]> {
  if (slugs.length === 0) return [];
  const filas = await db
    .select({
      id: productos.id,
      nombre: productos.nombre,
      variante: productos.variante,
      archivoKey: productos.archivoKey,
      tipo: categorias.tipo,
    })
    .from(productos)
    .innerJoin(categorias, eq(categorias.slug, productos.categoriaSlug))
    .where(inArray(productos.slug, [...new Set(slugs)]));
  return filas
    .filter((f) => f.archivoKey && llevaPdf(f.tipo))
    .map((f) => ({ productoId: f.id, nombre: `${f.nombre} | ${f.variante}`, tipo: f.tipo! }));
}

function htmlPdfs(nombre: string, numero: string, links: { pdf: PdfDePedido; url: string }[]): string {
  const VERDE = "#2D392C";
  const CREMA = "#FBF8EF";
  const GRIS = "#6b6b63";
  const filas = links
    .map(
      ({ pdf, url }) => `
      <tr><td style="padding:10px 0;border-bottom:1px solid #eee">
        <p style="margin:0;color:${VERDE};font-weight:bold">${pdf.nombre}</p>
        <p style="margin:2px 0 8px;color:${GRIS};font-size:13px">${pdf.tipo === "plantines" ? "Ficha de cultivo (de regalo con tu plantín)" : "Guía digital"}</p>
        <a href="${url}" style="display:inline-block;background:${VERDE};color:#fff;text-decoration:none;padding:8px 16px;border-radius:999px;font-size:14px">Descargar PDF</a>
      </td></tr>`,
    )
    .join("");
  return `<div style="background:${CREMA};padding:24px;font-family:Arial,Helvetica,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px">
      <h1 style="color:${VERDE};font-size:20px;margin:0 0 4px">${site.nombre} · Cultivo</h1>
      <h2 style="color:${VERDE};font-size:16px;margin:0 0 16px">Tus archivos del pedido ${numero}</h2>
      <p style="color:${VERDE}">¡Hola, ${nombre}! Confirmamos tu pago. Acá tenés tus PDFs:</p>
      <table style="width:100%;font-size:14px">${filas}</table>
      <p style="color:${GRIS};font-size:12px;margin-top:16px">Cada link es personal y sirve para ${DESCARGAS_POR_LINK} descargas. Guardá el archivo en tu dispositivo.</p>
    </div>
  </div>`;
}

export type ResultadoEntrega = "enviado" | "sin-pdfs" | "error";

// Crea los links y manda el mail. `origen` = dominio desde el que se arma el
// link (el de la request del panel). Marca el pedido como enviado si salió.
export async function enviarPdfsPedido(pedidoId: number, origen: string): Promise<ResultadoEntrega> {
  const pedido = await getPedidoById(pedidoId);
  if (!pedido) return "error";
  const pdfs = await pdfsDelPedido(pedido.items.map((i) => i.productoSlug));
  if (pdfs.length === 0) return "sin-pdfs";

  const links = [];
  for (const pdf of pdfs) {
    const token = await crearDescarga(pedido.id, pdf.productoId);
    links.push({ pdf, url: `${origen}/api/descarga/${token}` });
  }
  const ok = await enviarMailBrevo({
    to: pedido.email,
    subject: `Tus PDFs del pedido ${pedido.numero} · ${site.nombre}`,
    html: htmlPdfs(pedido.nombre, pedido.numero, links),
  });
  if (!ok) return "error";
  await db.update(pedidos).set({ pdfEnviadoEn: new Date() }).where(eq(pedidos.id, pedido.id));
  return "enviado";
}
