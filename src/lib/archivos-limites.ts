// Topes de uso de R2 (lógica pura, testeable). R2 no tiene un límite de gasto
// propio, así que lo imponemos acá con margen sobre el plan gratis:
//   gratis/mes: 10 GB guardados · 1 M operaciones clase A · 10 M clase B.
// El bucket es privado: solo el Worker lo toca, así que estos topes alcanzan.

export const MB = 1024 * 1024;
export const GB = 1024 * MB;

export const PDF_MAX_BYTES = 20 * MB; // por archivo
export const ALMACENAMIENTO_MAX_BYTES = 8 * GB; // total (2 GB de margen)
export const ESCRITURAS_MES_MAX = 800_000; // clase A (gratis: 1 M)
export const LECTURAS_MES_MAX = 8_000_000; // clase B (gratis: 10 M)
export const DESCARGAS_POR_LINK = 10;

export type TipoOperacion = "escrituras" | "lecturas";

export const TOPE_MES: Record<TipoOperacion, number> = {
  escrituras: ESCRITURAS_MES_MAX,
  lecturas: LECTURAS_MES_MAX,
};

// Mes de facturación de Cloudflare (UTC), como "YYYY-MM".
export function mesActual(d = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatoBytes(n: number): string {
  if (n >= GB) return `${(n / GB).toFixed(1)} GB`;
  if (n >= MB) return `${(n / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(n / 1024))} KB`;
}

// ¿Los primeros bytes son de un PDF? ("%PDF-"). No alcanza con el MIME del
// navegador, que se puede falsear.
export function esPdf(cabecera: Uint8Array): boolean {
  const firma = [0x25, 0x50, 0x44, 0x46, 0x2d];
  return firma.every((b, i) => cabecera[i] === b);
}

// Valida un PDF a subir. `usadoBytes` = lo que ya ocupa el bucket;
// `reemplazaBytes` = lo que libera el archivo que se reemplaza (si hay).
export function validarPdf(opts: {
  size: number;
  cabecera: Uint8Array;
  usadoBytes: number;
  reemplazaBytes?: number;
  escriturasMes: number;
}): string | null {
  if (opts.size <= 0) return "El archivo está vacío.";
  if (!esPdf(opts.cabecera)) return "El archivo tiene que ser un PDF.";
  if (opts.size > PDF_MAX_BYTES) return `El PDF supera el máximo de ${formatoBytes(PDF_MAX_BYTES)}. Comprimilo antes de subirlo.`;
  const total = opts.usadoBytes - (opts.reemplazaBytes ?? 0) + opts.size;
  if (total > ALMACENAMIENTO_MAX_BYTES) {
    return `No hay espacio: se usan ${formatoBytes(opts.usadoBytes)} de ${formatoBytes(ALMACENAMIENTO_MAX_BYTES)}. Borrá PDFs que no uses.`;
  }
  if (opts.escriturasMes >= ESCRITURAS_MES_MAX) return "Se alcanzó el tope mensual de subidas. Probá de nuevo el mes que viene.";
  return null;
}

// Nombre de descarga seguro para Content-Disposition (sin comillas ni saltos).
export function nombreDescarga(nombre: string | null | undefined): string {
  const limpio = String(nombre ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w.\- ]+/g, "")
    .trim();
  const base = limpio || "documento";
  return base.toLowerCase().endsWith(".pdf") ? base : `${base}.pdf`;
}
