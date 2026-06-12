import type { APIRoute } from "astro";
import { getImagen } from "../../../db/queries";

export const prerender = false;

// Sirve una imagen guardada en la base (Neon). La URL es content-addressed por
// id (cada subida crea una fila nueva), así que el contenido es inmutable y se
// puede cachear de forma agresiva en el navegador y la CDN.
export const GET: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) return new Response("No encontrada", { status: 404 });

  const img = await getImagen(id);
  if (!img) return new Response("No encontrada", { status: 404 });

  const bytes = Buffer.from(img.data, "base64");
  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": img.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
