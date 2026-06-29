// Genera la imagen de previsualización al compartir (Open Graph) — PROP-112.
//
// Compone una tarjeta institucional de 1200×630 (relación 1.91:1, el tamaño
// recomendado para Open Graph / Twitter Cards) con el fondo crema de la marca y
// el logo centrado. El logo ya incluye el nombre y el tagline "cuidamos lo que
// comés", así que el resultado muestra la identidad de la marca y no una foto
// suelta de producto al compartir el link.
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
const LOGO = "public/marca/proposito-logo.webp"; // verde sobre transparente, con tagline
const ANCHO_LOGO = 660; // px; deja márgenes cómodos a los lados
const SALIDA = "public/marca/og-proposito.png";

async function main() {
  const logo = await sharp(LOGO)
    .resize({ width: ANCHO_LOGO, withoutEnlargement: false })
    .toBuffer();

  const info = await sharp({
    create: { width: ANCHO, height: ALTO, channels: 4, background: FONDO },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(SALIDA);

  console.log(`✓ OG generada → ${SALIDA}  (${info.width}×${info.height}, ${(info.size / 1024).toFixed(1)} KB)`);
}

main().catch((e) => {
  console.error("✗ Error generando la OG:", e);
  process.exit(1);
});
