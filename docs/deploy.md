# Deploy

La web se despliega a **Cloudflare Workers** automáticamente en cada push a `main`
mediante el workflow [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).
También se puede disparar a mano desde la pestaña **Actions → Deploy a Cloudflare → Run workflow**.

## 1. Secrets del repositorio de GitHub

Para que el workflow pueda deployar, hay que cargar estos *secrets* en
**GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Para qué | Dónde obtenerlo |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Autoriza a Wrangler a deployar | Cloudflare → My Profile → API Tokens → Create Token → plantilla **"Edit Cloudflare Workers"** |
| `CLOUDFLARE_ACCOUNT_ID` | Identifica la cuenta destino | Cloudflare → Workers & Pages → panel derecho (**Account ID**) |
| `DATABASE_URL` | Solo por seguridad durante el build | Cadena de conexión de Neon (la misma del `.env`) |

## 2. Secrets de runtime del Worker

El deploy sube el **código**, pero el Worker necesita sus propias variables en
**runtime**. Estas NO van en el `.env` ni en GitHub: se cargan en Cloudflare, una sola vez,
con `wrangler secret put <NOMBRE>` (o desde el dashboard del Worker → Settings → Variables):

- `DATABASE_URL` — conexión a Neon
- `RESEND_API_KEY` — envío de mails (Resend)
- `AUTH_SECRET` — firma de sesiones del panel
- `ADMIN_EMAIL` — email del admin

```bash
# Ejemplo (se ejecuta una vez, de forma local, apuntando al Worker de producción):
npx wrangler secret put DATABASE_URL
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put AUTH_SECRET
npx wrangler secret put ADMIN_EMAIL
```

## 3. Dominio

Apuntar `propositouy.com.uy` al Worker se hace en Cloudflare (rutas/custom domain) +
DNS del registrador. Ver tickets **PROP-65** (DNS) y **PROP-76** (correo del dominio).

## Deploy manual (sin CI)

```bash
npm run build
npx wrangler deploy
```
