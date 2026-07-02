// Configuración global del sitio. Editá estos valores y se reflejan en toda la web.

export const site = {
  nombre: "Propósito UY",
  dominio: "www.propositouy.com",
  // Número de WhatsApp Business en formato internacional sin "+" ni espacios.
  whatsapp: "59897174174",
  whatsappMensajeBase: "¡Hola Propósito! Quiero hacer un pedido:",
  // Mensaje del botón genérico de WhatsApp (footer): consulta/coordinación/comprobante.
  whatsappMensajeConsulta: "Hola! Quiero hacer una consulta: ",
  // Link de "conversación abierta" de WhatsApp Business (para el bloque de Contacto).
  whatsappConversacion: "https://wa.me/message/YWJV7R5QSYRND1",
  // Horario de atención.
  horarioAtencion: "Lunes a viernes de 12:00 a 18:00 hs.",
  // Retiro en planta.
  direccionRetiro: "Volteadores 1742, Punta Gorda, Montevideo",
  telefonoRetiro: "097 174 174",
  redes: {
    instagram: "https://instagram.com/proposito_uy",
  },
  // Imagen por defecto para previews al compartir (Open Graph / Twitter).
  // Tarjeta institucional 1200x630 (isotipo sobre fondo crema). Se regenera con
  // `npm run og:gen` (scripts/generar-og.mjs). (PROP-112 / PROP-114)
  // El ?v= versiona la URL: al cambiar la imagen, subir el número fuerza a
  // WhatsApp/redes a re-descargar el preview (que cachean por URL).
  ogImagen: "/marca/og-proposito.png?v=2",
  // URL de la política de cookies (página legal). El banner muestra el link
  // "Más información" apuntando aquí (PROP-67/PROP-68).
  cookiesPolicyUrl: "/legales/cookies",
  // (Las tablas nutricionales y la grilla de retornabilidad ahora son tablas
  //  on-site editables desde /admin → Contenido; ya no se usan Google Sheets.)
  // Envío
  costoEnvio: 250,
  envioGratisDesde: 3000,
} as const;

// Construye un link wa.me con mensaje opcional prellenado.
export function whatsappLink(mensaje?: string): string {
  const texto = mensaje ?? site.whatsappMensajeBase;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

// Navegación principal (las 7 secciones del documento base).
export const nav = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Tienda", href: "/tienda" },
  { label: "Recetario", href: "/recetario" },
  { label: "Retornables", href: "/retornables" },
  { label: "Preguntas", href: "/preguntas" },
  { label: "Contacto", href: "/contacto" },
] as const;
