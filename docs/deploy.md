# Deploy

La web se despliega a **Cloudflare Workers** automáticamente en cada push a `main`
mediante la **integración Git de Cloudflare** (Workers Builds), configurada en el
dashboard de Cloudflare. No hay GitHub Action: el build y el deploy los maneja
Cloudflare directamente al detectar el push.

> Worker en producción: **proposito-uy-web** · URL por defecto del proyecto en
> `*.workers.dev` (ver dashboard).

## Cómo está configurado

- **Cloudflare → Workers & Pages → proposito-uy-web → Settings → Build**:
  conectado al repo `JoacoMarquez/proposito-uy-web`, rama `main`.
  Build command: `npm run build`. Deploy con la config de `wrangler.jsonc`.

## Secrets / variables de runtime del Worker

El Worker necesita estas variables para funcionar (DB, login, mails). Se cargan
**una sola vez** en el dashboard del Worker, como **Secret** (encriptadas):

**Cloudflare → Workers & Pages → proposito-uy-web → Settings → Variables and Secrets**

- `DATABASE_URL` — conexión a Neon
- `RESEND_API_KEY` — envío de mails (Resend)
- `AUTH_SECRET` — firma de sesiones del panel
- `ADMIN_EMAIL` — email del admin

Si el build necesita alguna variable en tiempo de build, se agrega en
**Settings → Build → Variables and secrets** del mismo proyecto.

## Dominio

Apuntar `propositouy.com.uy` al Worker se hace en Cloudflare (custom domain) +
DNS del registrador. Ver tickets **PROP-65** (DNS) y **PROP-76** (correo del dominio).

## Deploy manual (sin CI)

```bash
npm run build
npx wrangler deploy
```

> ⚠️ Verificar que el `name` en `wrangler.jsonc` apunte al Worker correcto antes
> de un deploy manual, para no crear un Worker duplicado.
