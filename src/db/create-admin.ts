// Crea (o actualiza) el usuario administrador del panel.
// Uso: npm run admin:create -- <email> [password]
// Si no se pasa password, se genera una aleatoria y se imprime.

import "dotenv/config";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { adminUsers } from "./schema";
import { hashPassword } from "../lib/auth";

async function main() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  if (!email) {
    console.error("Falta el email. Uso: npm run admin:create -- <email> [password]");
    process.exit(1);
  }
  const password = process.argv[3] || randomBytes(9).toString("base64url");
  const passwordHash = await hashPassword(password);

  const [existente] = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
  if (existente) {
    await db.update(adminUsers).set({ passwordHash }).where(eq(adminUsers.id, existente.id));
    console.log(`✓ Contraseña actualizada para ${email}`);
  } else {
    await db.insert(adminUsers).values({ email, passwordHash });
    console.log(`✓ Admin creado: ${email}`);
  }
  console.log(`  Contraseña: ${password}`);
  console.log("  (Cambiala luego desde el panel cuando agreguemos esa opción.)");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  });
