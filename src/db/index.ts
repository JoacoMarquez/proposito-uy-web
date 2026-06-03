// Cliente de la base de datos (Neon serverless + Drizzle).
// La conexión se configura con la variable de entorno DATABASE_URL y se crea
// de forma diferida (lazy): recién al primer uso real. Así el build/prerender
// de páginas que no tocan la base no requiere DATABASE_URL.

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

function createDb() {
  const databaseUrl = process.env.DATABASE_URL ?? import.meta.env?.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "Falta DATABASE_URL. Copiá .env.example a .env y pegá la cadena de conexión de Neon.",
    );
  }
  return drizzle(neon(databaseUrl), { schema });
}

let _db: ReturnType<typeof createDb> | undefined;
function getDb() {
  return (_db ??= createDb());
}

// Proxy que difiere la conexión hasta el primer acceso a una propiedad/método.
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    const real = getDb() as Record<string | symbol, unknown>;
    const value = real[prop];
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
