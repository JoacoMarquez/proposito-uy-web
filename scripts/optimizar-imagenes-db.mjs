// Optimiza las imágenes guardadas en la base (tabla `imagenes`): las
// redimensiona y convierte a WebP con sharp, y actualiza la fila en su lugar
// (misma URL /api/img/<id>, así no hay que tocar productos/recetas/páginas).
//
// Las fotos subidas desde el panel entran sin procesar (el Worker no puede
// correr sharp), así que algunas pesan >1 MB. Esto reduce la transferencia
// de Neon (que es lo que agota el cupo del plan gratuito) y acelera la web.
//
// Uso:
//   node scripts/optimizar-imagenes-db.mjs --dry-run     # muestra qué haría, no escribe
//   node scripts/optimizar-imagenes-db.mjs               # optimiza de verdad
//   DATABASE_URL=postgres://... node scripts/optimizar-imagenes-db.mjs   # otra base (ej. prod)
//
// Opciones: [ancho máx] [calidad] [umbral KB]  →  default 1200px, 80, 150 KB.

import { readFileSync, existsSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import sharp from "sharp";

const args = process.argv.slice(2).filter((a) => a !== "--dry-run");
const DRY = process.argv.includes("--dry-run");
const MAX_ANCHO = Number(args[0]) || 1200; // px; no agranda imágenes más chicas
const CALIDAD = Number(args[1]) || 80; // calidad WebP (0-100)
const UMBRAL = (Number(args[2]) || 150) * 1024; // solo optimiza si pesa más que esto

// DATABASE_URL del entorno, o del .env del proyecto como fallback.
let databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl && existsSync(".env")) {
  const m = readFileSync(".env", "utf8").match(/^DATABASE_URL\s*=\s*"?([^"\n]+)"?/m);
  if (m) databaseUrl = m[1];
}
if (!databaseUrl) {
  console.error("✗ Falta DATABASE_URL (en el entorno o en .env).");
  process.exit(1);
}

const kb = (n) => (n / 1024).toFixed(1) + " KB";
const sql = neon(databaseUrl);

const filas = await sql`SELECT id, mime, length(data) AS len FROM imagenes ORDER BY id`;
console.log(`${filas.length} imagen(es) en la base. Optimizando las de más de ${kb(UMBRAL)} (máx ${MAX_ANCHO}px, calidad ${CALIDAD})${DRY ? " — DRY RUN, no escribe nada" : ""}\n`);

let totalIn = 0;
let totalOut = 0;
let optimizadas = 0;

for (const { id, mime, len } of filas) {
  const bytesAprox = Math.round(len * 0.75); // base64 → bytes reales
  if (mime === "image/gif") {
    console.log(`  #${id}  ${kb(bytesAprox)}  GIF — se deja igual (puede tener animación)`);
    continue;
  }
  if (bytesAprox < UMBRAL) continue;

  const [{ data }] = await sql`SELECT data FROM imagenes WHERE id = ${id}`;
  const original = Buffer.from(data, "base64");
  const optimizada = await sharp(original)
    .rotate() // respeta la orientación EXIF
    .resize({ width: MAX_ANCHO, withoutEnlargement: true })
    .webp({ quality: CALIDAD })
    .toBuffer();

  if (optimizada.length >= original.length) {
    console.log(`  #${id}  ${kb(original.length)}  ya estaba óptima — se deja igual`);
    continue;
  }

  if (!DRY) {
    await sql`UPDATE imagenes SET data = ${optimizada.toString("base64")}, mime = 'image/webp' WHERE id = ${id}`;
  }
  totalIn += original.length;
  totalOut += optimizada.length;
  optimizadas++;
  console.log(`  #${id}  ${kb(original.length)} → ${kb(optimizada.length)}  (−${Math.round((1 - optimizada.length / original.length) * 100)}%)`);
}

if (optimizadas === 0) {
  console.log("\nNo había imágenes para optimizar.");
} else {
  console.log(`\n${DRY ? "Se optimizarían" : "Optimizadas"} ${optimizadas} imagen(es): ${kb(totalIn)} → ${kb(totalOut)}  (−${Math.round((1 - totalOut / totalIn) * 100)}%)`);
}
