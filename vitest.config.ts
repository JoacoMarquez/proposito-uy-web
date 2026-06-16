import { defineConfig } from "vitest/config";

// Tests unitarios de la lógica pura (precios, agenda, helpers). No tocan la DB
// ni el runtime de Astro: solo importan módulos sin efectos al cargar.
export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
