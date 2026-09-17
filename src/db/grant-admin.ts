// Da (o quita) permiso de administrador a una cuenta de cliente.
// La cuenta tiene que existir: registrate primero en /cuenta.
//
// Uso:
//   npm run admin:grant -- <email>          # marca la cuenta como admin
//   npm run admin:grant -- <email> off      # le quita el permiso admin

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { clientes } from "./schema";

async function main() {
  const email = (process.argv[2] || "").trim().toLowerCase();
  const esAdmin = (process.argv[3] || "").toLowerCase() !== "off";
  if (!email) {
    console.error("Falta el email. Uso: npm run admin:grant -- <email> [off]");
    process.exit(1);
  }
  const [u] = await db
    .update(clientes)
    .set({ esAdmin })
    .where(eq(clientes.email, email))
    .returning({ id: clientes.id, email: clientes.email, esAdmin: clientes.esAdmin });
  if (!u) {
    console.error(`No existe un cliente con el email "${email}". Registrá esa cuenta en /cuenta primero.`);
    process.exit(1);
  }
  console.log(`✓ ${u.email} — esAdmin: ${u.esAdmin}`);
}

main().catch((e) => {
  console.error("✗ Error:", e);
  process.exit(1);
});
