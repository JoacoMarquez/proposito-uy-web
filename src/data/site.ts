// Configuración global del sitio. Editá estos valores y se reflejan en toda la web.

export const site = {
  nombre: "Propósito UY",
  dominio: "propositouy.com.uy",
  // Número de WhatsApp Business en formato internacional sin "+" ni espacios.
  whatsapp: "59897174174",
  whatsappMensajeBase: "¡Hola Propósito! Quiero hacer un pedido:",
  // Link de "conversación abierta" de WhatsApp Business (para el bloque de Contacto).
  whatsappConversacion: "https://wa.me/message/YWJV7R5QSYRND1",
  // Horario de atención.
  horarioAtencion: "Lunes a viernes de 12:00 a 18:00 hs.",
  // Retiro en planta.
  direccionRetiro: "Volteadores 1742, Punta Gorda, Montevideo",
  telefonoRetiro: "097 174 174",
  redes: {
    instagram: "https://instagram.com/propositouy",
  },
  // Grilla de retornabilidad (documento externo del cliente).
  grillaRetornablesUrl:
    "https://docs.google.com/spreadsheets/d/1bUN7BbojfdpoWQeLc0byjdodWaWVOXTOUTKMG5ltcYQ/edit?usp=sharing",
  // TODO: enlace a las tablas nutricionales (no estaba en el documento).
  tablasNutricionalesUrl: "#",
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
