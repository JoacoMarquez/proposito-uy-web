// Sube a Brevo todos los suscriptores que ya están en la base de la web.
// Uso: npx tsx src/db/brevo-import.ts   (requiere BREVO_API_KEY y BREVO_LIST_ID
// en el .env). Es idempotente: re-correrlo no duplica (updateEnabled).

import "dotenv/config";
import { db } from "./index";
import { suscriptores } from "./schema";
import { agregarContactoBrevo } from "../lib/brevo";

const rows = await db.select().from(suscriptores);
let ok = 0;
let err = 0;
for (const r of rows) {
  const res = await agregarContactoBrevo(r.email);
  if (res === "ok") ok++;
  else {
    err++;
    if (res === "sin-config") {
      console.error("Falta BREVO_API_KEY o BREVO_LIST_ID en el entorno.");
      break;
    }
  }
}
console.log(`Brevo import: ${ok} ok, ${err} con error, de ${rows.length} suscriptores.`);
process.exit(0);
