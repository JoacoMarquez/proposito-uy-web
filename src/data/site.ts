// Configuración global del sitio. Editá estos valores y se reflejan en toda la web.

export const site = {
  nombre: "Propósito UY",
  dominio: "propositouy.com.uy",
  // TODO: poner el número real de WhatsApp Business en formato internacional sin "+" ni espacios.
  // Ej: Uruguay 099 123 456 -> "59899123456"
  whatsapp: "59800000000",
  // Texto que aparece prellenado al abrir WhatsApp desde un producto.
  whatsappMensajeBase: "¡Hola Propósito! Quiero hacer un pedido:",
  redes: {
    instagram: "https://instagram.com/propositouy",
  },
  // TODO: enlace a las tablas nutricionales (PDF/Drive/imagen). Aparece en Preguntas → Nutricional.
  tablasNutricionalesUrl: "#",
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
