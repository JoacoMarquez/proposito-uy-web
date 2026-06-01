# Decisión 0001 — Hosting: Vercel en lugar de Hostinger / WordPress

- **Estado:** Aceptada
- **Fecha:** 2026-05-31
- **Decisión en una línea:** El sitio se aloja en **Vercel** (con base de datos en Neon). **No se usa el hosting de Hostinger ni WordPress** que el cliente tenía contratados.

---

## Contexto

El cliente (Pedro Dieste / Propósito UY) ya contaba con:

- **Hosting en Hostinger** (plan WordPress) pago hasta **2029**.
- **Dominio** `propositouy.com.uy` pago hasta el año siguiente.
- Una instalación de **WordPress** que no llegó a usar (sin conocimiento del CMS).

El proyecto, según el documento base del cliente, no es un catálogo simple: requiere **tienda con carrito, checkout, base de datos, panel de administración propio y envío de mails**. Es decir, una **aplicación a medida**, no un sitio de plantilla.

Además, la preferencia explícita del desarrollo fue trabajar **100% por código** (no configurar el sitio desde una interfaz web tipo WordPress/WooCommerce).

## Opciones consideradas

| Opción | Descripción | Veredicto |
|---|---|---|
| **A. Vercel + Neon (elegida)** | App Astro con render en servidor, base de datos Postgres (Neon), despliegue automático desde GitHub. | ✅ Elegida |
| B. WooCommerce sobre el WordPress de Hostinger | Usar el plugin de tienda de WordPress (carrito/checkout/admin ya hechos). | ❌ Descartada |
| C. Sitio estático subido a Hostinger | Compilar el sitio y subir archivos a `public_html`. | ❌ Descartada |

## Decisión

Se usa **Vercel** para el hosting y **Neon** para la base de datos. El plan de Hostinger y WordPress **no se utilizan** en este proyecto.

## Razones

1. **El proyecto necesita backend.** Carrito, checkout, pedidos, panel admin y mails requieren render en servidor + base de datos. El plan compartido/WordPress de Hostinger no está pensado para correr una app Node/Astro con Postgres de forma cómoda (descarta la opción C).
2. **Decisión de trabajar por código.** WooCommerce implica desarrollar y mantener la tienda desde la interfaz de WordPress, lo opuesto a la preferencia del desarrollo. También suma mantenimiento de plugins y actualizaciones de seguridad (descarta la opción B).
3. **Vercel encaja con el stack.** Está hecho para apps Astro con SSR: despliegue automático en cada cambio, entornos de previsualización y muy buen rendimiento. Plan gratuito suficiente para el volumen actual.
4. **Costo de operación cercano a cero.** Vercel, Neon y Resend tienen plan gratuito; el dominio ya está pago. No hay cuota mensual de hosting.

## Consecuencias

- ✅ El sitio funciona como una app a medida, moderna y rápida, mantenible por código.
- ✅ Sin costos mensuales de hosting hoy.
- ⚠️ **El plan de Hostinger queda pago pero sin uso** para este proyecto (costo ya incurrido por el cliente, hasta 2029).
- El **dominio** `propositouy.com.uy` se apunta a Vercel mediante registros DNS, sin importar dónde esté gestionado.

## Qué hacer con el Hostinger ya pagado

Como el plan ya está abonado, opciones para no desperdiciarlo del todo:

1. **Usarlo para el correo de la marca** (casillas `@propositouy.com.uy`), si el plan incluye email. Es independiente del hosting de la web.
2. **Gestionar el DNS del dominio** desde el panel de Hostinger (apuntando a Vercel), si el dominio está administrado ahí.
3. **No renovarlo** al vencer (2029) si finalmente no se le da uso, evitando el gasto a futuro.

> Nota: el envío de mails transaccionales de la tienda (confirmaciones de pedido) se hace por **Resend**, que es un servicio aparte y no depende de Hostinger.

## Reversibilidad

La decisión es de bajo riesgo de quedar "encerrados": el código es propio y portable. Si en el futuro se quisiera mover el hosting, la app puede desplegarse en otro proveedor con soporte de Node (la base de datos Neon es estándar Postgres y también es portable).
