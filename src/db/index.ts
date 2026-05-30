// Cliente de la base de datos (Neon serverless + Drizzle).
// La conexión se configura con la variable de entorno DATABASE_URL.

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL ?? import.meta.env?.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Falta DATABASE_URL. Copiá .env.example a .env y pegá la cadena de conexión de Neon.",
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });

export { schema };
