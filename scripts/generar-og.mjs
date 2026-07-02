// Genera la imagen de previsualización al compartir (Open Graph) — PROP-112.
//
// Compone una tarjeta institucional de 1200×630 (relación 1.91:1, el tamaño
// recomendado para Open Graph / Twitter Cards) con el fondo crema de la marca y
// el isotipo (trilobulado) centrado. El título y la descripción del link ya
// comunican el nombre de la marca, así que alcanza con el isotipo para una
// tarjeta sobria y no una foto suelta de producto al compartir el link (PROP-114).
//
// Salida: public/marca/og-proposito.png (PNG por compatibilidad amplia con
// WhatsApp, Facebook, X/Twitter, iMessage, etc.).
//
// Uso:
//   node scripts/generar-og.mjs        (o:  npm run og:gen)

import sharp from "sharp";

const ANCHO = 1200;
const ALTO = 630;
const FONDO = "#fbf8ef"; // crema (--color-crema), fondo de página de la marca
const ISOTIPO = "public/marca/proposito-isotipo.webp"; // trilobulado verde sobre transparente
// Caja donde entra el isotipo (ya recortado su padding transparente). Presente
// pero sobrio, con márgenes amplios en el lienzo de 1200×630.
const CAJA_ISOTIPO = { width: 470, height: 350 };
const SALIDA = "public/marca/og-proposito.png";

async function main() {
  const isotipo = await sharp(ISOTIPO)
    .trim() // recorta el padding transparente del webp para controlar el tamaño visible
    .resize({ ...CAJA_ISOTIPO, fit: "inside", withoutEnlargement: false })
    .toBuffer();

  const info = await sharp({
    create: { width: ANCHO, height: ALTO, channels: 4, background: FONDO },
  })
    .composite([{ input: isotipo, gravity: "center" }])
    .png()
    .toFile(SALIDA);

  console.log(`✓ OG generada → ${SALIDA}  (${info.width}×${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
}

main().catch((e) => {
  console.error("✗ Error generando la OG:", e);
  process.exit(1);
});
