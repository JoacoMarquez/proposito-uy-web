// Pipeline de optimización de imágenes (PROP-61).
//
// Toma las imágenes originales de un directorio fuente, las redimensiona y las
// convierte a WebP optimizado, escribiéndolas en el directorio destino.
// Pre-optimizar evita depender de transformaciones en runtime (límite/costo en
// Cloudflare) y aligera las páginas.
//
// Uso:
//   npm run img:optim                                  # fuente: imagenes-fuente/ → destino: public/productos/
//   npm run img:optim -- <fuente> <destino> [ancho] [calidad]
//
// Ejemplos:
//   npm run img:optim -- imagenes-fuente public/productos
//   npm run img:optim -- imagenes-fuente public/productos 1000 82

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const [, , srcArg, destArg, anchoArg, calidadArg] = process.argv;
const SRC = srcArg || "imagenes-fuente";
const DEST = destArg || "public/productos";
const MAX_ANCHO = Number(anchoArg) || 800; // px; no agranda imágenes más chicas
const CALIDAD = Number(calidadArg) || 80; // calidad WebP (0-100)

const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tiff"]);
const kb = (n) => (n / 1024).toFixed(1) + " KB";

async function main() {
  if (!existsSync(SRC)) {
    console.error(`✗ No existe el directorio fuente "${SRC}". Crealo y poné ahí las imágenes originales.`);
    process.exit(1);
  }
  await mkdir(DEST, { recursive: true });

  const files = (await readdir(SRC)).filter((f) => EXT.has(path.extname(f).toLowerCase()));
  if (files.length === 0) {
    console.log(`No hay imágenes para optimizar en "${SRC}".`);
    return;
  }

  console.log(`Optimizando ${files.length} imagen(es): ${SRC} → ${DEST}  (máx ${MAX_ANCHO}px, calidad ${CALIDAD})\n`);

  let totalIn = 0;
  let totalOut = 0;
  for (const file of files) {
    const inPath = path.join(SRC, file);
    const base = path.basename(file, path.extname(file));
    const outPath = path.join(DEST, base + ".webp");

    const inSize = (await stat(inPath)).size;
    const info = await sharp(inPath)
      .rotate() // respeta la orientación EXIF
      .resize({ width: MAX_ANCHO, withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toFile(outPath);
    const outSize = (await stat(outPath)).size;

    totalIn += inSize;
    totalOut += outSize;
    const pct = inSize ? Math.round((1 - outSize / inSize) * 100) : 0;
    console.log(`✓ ${file} → ${base}.webp  ${kb(inSize)} → ${kb(outSize)}  (${info.width}×${info.height}, ${pct >= 0 ? "-" : "+"}${Math.abs(pct)}%)`);
  }

  const pctTotal = totalIn ? Math.round((1 - totalOut / totalIn) * 100) : 0;
  console.log(`\nTotal: ${kb(totalIn)} → ${kb(totalOut)} (${pctTotal >= 0 ? "-" : "+"}${Math.abs(pctTotal)}%) en ${files.length} imagen(es).`);
}

main().catch((e) => {
  console.error("✗ Error:", e);
  process.exit(1);
});
