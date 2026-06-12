// Procesa una imagen subida desde un form del panel: valida tipo y tamaño,
// la guarda en la base (Neon) y devuelve la URL pública (/api/img/<id>).
// Corre en el Worker de Cloudflare: usa Buffer (nodejs_compat) para el base64.

import { guardarImagen, IMAGEN_MIMES, IMAGEN_MAX_BYTES } from "../db/queries";

export interface ResultadoSubida {
  url: string | null; // URL nueva si se subió un archivo; null si no se subió ninguno
  error?: string; // mensaje si el archivo es inválido
}

const MB = (n: number) => `${Math.round(n / (1024 * 1024))} MB`;

// Lee el archivo del campo `campo` del form. Si no hay archivo (el usuario no
// eligió ninguno), devuelve { url: null } para que el llamador conserve la
// imagen actual. Si hay archivo, lo valida y lo guarda.
export async function procesarImagenSubida(form: FormData, campo = "imagenFile"): Promise<ResultadoSubida> {
  const file = form.get(campo);
  if (!(file instanceof File) || file.size === 0) return { url: null };

  if (!(IMAGEN_MIMES as readonly string[]).includes(file.type)) {
    return { url: null, error: "Formato de imagen no soportado (usá JPG, PNG, WebP, AVIF o GIF)." };
  }
  if (file.size > IMAGEN_MAX_BYTES) {
    return { url: null, error: `La imagen supera el máximo de ${MB(IMAGEN_MAX_BYTES)}. Optimizala antes de subir.` };
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const id = await guardarImagen(base64, file.type);
  return { url: `/api/img/${id}` };
}
