// Contenido de las páginas legales (PROP-68).
//
// ⚠️ IMPORTANTE: estos textos son una BASE/PLANTILLA adaptada a Propósito UY.
// Deben ser revisados y aprobados por el cliente y/o un asesor legal antes de
// considerarse definitivos (en particular: razón social, RUT, y la designación
// formal del responsable del tratamiento de datos).
import { site } from "./site";

export interface BloqueLegal {
  titulo?: string;
  parrafos?: string[];
  lista?: string[];
}

export interface PaginaLegal {
  slug: string;
  titulo: string;
  resumen: string;
  /** Fecha de última actualización (texto visible). */
  actualizado: string;
  bloques: BloqueLegal[];
}

const ACTUALIZADO = "9 de junio de 2026";

const privacidad: PaginaLegal = {
  slug: "privacidad",
  titulo: "Política de privacidad",
  resumen: "Cómo tratamos tus datos personales en Propósito UY.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      parrafos: [
        `En ${site.nombre} valoramos tu privacidad. Esta política explica qué datos personales recopilamos, con qué finalidad, cómo los protegemos y qué derechos tenés sobre ellos. Al usar ${site.dominio} aceptás las prácticas descritas aquí.`,
      ],
    },
    {
      titulo: "Responsable",
      parrafos: [
        `El responsable del tratamiento de tus datos es ${site.nombre}, con retiro en ${site.direccionRetiro}. Para cualquier consulta sobre tus datos podés contactarnos por WhatsApp o a través de la página de Contacto del sitio.`,
      ],
    },
    {
      titulo: "Qué datos recopilamos",
      lista: [
        "Datos de cuenta (si te registrás): nombre, correo electrónico, celular, contraseña (almacenada de forma encriptada) y las direcciones que guardes.",
        "Datos de pedido: nombre, celular, correo electrónico, dirección de entrega, notas del pedido, modalidad y agenda de entrega y método de pago elegido.",
        "Datos técnicos mínimos necesarios para que el sitio funcione (cookies de sesión). No usamos cookies de seguimiento sin tu consentimiento.",
      ],
    },
    {
      titulo: "Para qué usamos tus datos",
      lista: [
        "Procesar, preparar y entregar tus pedidos.",
        "Gestionar tu cuenta y tu historial de pedidos.",
        "Comunicarnos con vos sobre tu pedido (por ejemplo, confirmaciones por correo o WhatsApp).",
        "Mejorar el funcionamiento del sitio.",
      ],
    },
    {
      titulo: "Con quién compartimos tus datos",
      parrafos: [
        "No vendemos ni alquilamos tus datos personales. Solo los compartimos con proveedores que nos permiten operar el sitio, y únicamente en lo necesario para prestar el servicio:",
      ],
      lista: [
        "Proveedor de hosting y entrega del sitio (Cloudflare).",
        "Proveedor de base de datos donde se almacenan cuentas y pedidos (Neon).",
        "Proveedor de envío de correos electrónicos transaccionales (Resend).",
      ],
    },
    {
      titulo: "Conservación",
      parrafos: [
        "Conservamos tus datos mientras tu cuenta esté activa o mientras sean necesarios para gestionar tus pedidos y cumplir obligaciones legales. Podés solicitar la eliminación de tu cuenta en cualquier momento.",
      ],
    },
    {
      titulo: "Tus derechos",
      parrafos: [
        "Podés solicitar el acceso, la rectificación o la eliminación de tus datos personales, así como oponerte a su tratamiento. Para ejercer estos derechos, contactanos por los canales indicados en la sección Responsable.",
      ],
    },
    {
      titulo: "Seguridad",
      parrafos: [
        "Las contraseñas se almacenan encriptadas (no en texto plano) y la comunicación con el sitio viaja cifrada (HTTPS). Aun así, ningún sistema es 100% infalible: te recomendamos usar una contraseña fuerte y no compartirla.",
      ],
    },
    {
      titulo: "Cambios en esta política",
      parrafos: [
        "Podemos actualizar esta política para reflejar cambios en el servicio o en la normativa. Publicaremos la versión vigente en esta misma página con su fecha de actualización.",
      ],
    },
  ],
};

const terminos: PaginaLegal = {
  slug: "terminos",
  titulo: "Términos y condiciones",
  resumen: "Condiciones de uso del sitio y de compra en Propósito UY.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      parrafos: [
        `Estos términos regulan el uso del sitio ${site.dominio} y la compra de productos de ${site.nombre}. Al navegar o realizar un pedido, aceptás estas condiciones.`,
      ],
    },
    {
      titulo: "Productos y precios",
      parrafos: [
        "Ofrecemos alimentos elaborados de forma artesanal. Los precios se expresan en pesos uruguayos e incluyen los impuestos correspondientes, salvo que se indique lo contrario. Podemos modificar precios y disponibilidad sin previo aviso; el precio aplicable es el vigente al momento de confirmar el pedido.",
      ],
    },
    {
      titulo: "Cuenta de usuario",
      parrafos: [
        "Podés comprar como invitado o crear una cuenta. Sos responsable de mantener la confidencialidad de tus credenciales y de la actividad realizada desde tu cuenta.",
      ],
    },
    {
      titulo: "Pedidos y pagos",
      parrafos: [
        "Un pedido se considera confirmado una vez completado el proceso de compra. Los métodos de pago disponibles son transferencia bancaria (enviando el comprobante por WhatsApp) o efectivo, según se indique en el sitio. Nos reservamos el derecho de cancelar pedidos ante errores evidentes de precio o falta de disponibilidad, comunicándolo al cliente.",
      ],
    },
    {
      titulo: "Entrega y retiro",
      parrafos: [
        `Según la modalidad elegida, el pedido se entrega a domicilio o se retira en ${site.direccionRetiro}. Los días de entrega, la agenda y el costo de envío se informan durante la compra. El sistema de envases retornables se rige por las condiciones publicadas en la sección Retornables.`,
      ],
    },
    {
      titulo: "Cambios y cancelaciones",
      parrafos: [
        "Por tratarse de productos alimenticios, los cambios o cancelaciones dependen del estado de preparación del pedido. Ante cualquier inconveniente, contactanos lo antes posible por WhatsApp para encontrar una solución.",
      ],
    },
    {
      titulo: "Propiedad intelectual",
      parrafos: [
        `La marca, los textos, las fotografías y el diseño del sitio pertenecen a ${site.nombre} y no pueden reproducirse sin autorización.`,
      ],
    },
    {
      titulo: "Responsabilidad",
      parrafos: [
        "Nos esforzamos por mantener la información del sitio correcta y actualizada, pero no garantizamos que esté libre de errores. La información de productos no sustituye el asesoramiento de un profesional de la salud; si tenés alergias o condiciones particulares, revisá los ingredientes antes de consumir.",
      ],
    },
    {
      titulo: "Ley aplicable",
      parrafos: [
        "Estos términos se rigen por las leyes de la República Oriental del Uruguay. Cualquier controversia se someterá a los tribunales competentes de Montevideo.",
      ],
    },
    {
      titulo: "Cambios en los términos",
      parrafos: [
        "Podemos actualizar estos términos en cualquier momento. La versión vigente es la publicada en esta página con su fecha de actualización.",
      ],
    },
  ],
};

const cookies: PaginaLegal = {
  slug: "cookies",
  titulo: "Política de cookies",
  resumen: "Qué cookies usamos y cómo gestionarlas.",
  actualizado: ACTUALIZADO,
  bloques: [
    {
      parrafos: [
        "Las cookies son pequeños archivos que se guardan en tu dispositivo cuando visitás un sitio web. Sirven para que el sitio funcione, recuerde tus preferencias y, con tu permiso, para medir su uso.",
      ],
    },
    {
      titulo: "Cookies que usamos",
      lista: [
        "Esenciales — necesarias para el funcionamiento del sitio. Incluyen las cookies de sesión que te mantienen identificado en tu cuenta o en el panel de administración. No requieren consentimiento porque sin ellas el sitio no puede operar.",
        "Preferencia de consentimiento — guardamos tu elección sobre las cookies (aceptar todo o solo esenciales) para no volver a preguntarte en cada visita.",
        "No esenciales (analítica) — en caso de incorporarse, nos ayudarían a entender cómo se usa el sitio. Solo se activan si das tu consentimiento mediante el banner de cookies.",
      ],
    },
    {
      titulo: "Cómo gestionar tus preferencias",
      parrafos: [
        'La primera vez que entrás al sitio te mostramos un banner para aceptar todas las cookies o solo las esenciales. Podés cambiar tu elección en cualquier momento desde el enlace "Configurar cookies" del pie de página. Además, podés borrar o bloquear cookies desde la configuración de tu navegador.',
      ],
    },
    {
      titulo: "Cambios en esta política",
      parrafos: [
        "Podemos actualizar esta política si cambian las cookies que utilizamos. La versión vigente es la publicada en esta página con su fecha de actualización.",
      ],
    },
  ],
};

export const legales: PaginaLegal[] = [privacidad, terminos, cookies];

// Enlaces para el footer / navegación.
export const navLegales = legales.map((p) => ({
  label: p.titulo,
  href: `/legales/${p.slug}`,
}));
