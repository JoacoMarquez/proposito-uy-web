import { describe, it, expect } from "vitest";
import { formatoPrecio, precioDesde, nombreCompleto, type ProductoFull } from "./queries";

describe("formatoPrecio", () => {
  it("prefija $U y no usa separador en montos chicos", () => {
    expect(formatoPrecio(250)).toBe("$U250");
    expect(formatoPrecio(0)).toBe("$U0");
  });
  it("agrupa los miles", () => {
    // El separador depende del locale es-UY (punto); validamos forma, no el glifo exacto.
    expect(formatoPrecio(3000)).toMatch(/^\$U3\D?000$/);
  });
});

describe("precioDesde", () => {
  it("toma el precio mínimo entre las presentaciones", () => {
    const p = {
      presentaciones: [{ precio: 900 }, { precio: 500 }, { precio: 1200 }],
    } as ProductoFull;
    expect(precioDesde(p)).toBe(500);
  });
});

describe("nombreCompleto", () => {
  it("combina nombre y variante con separador", () => {
    expect(nombreCompleto({ nombre: "Hummus", variante: "Garbanzo" })).toBe("Hummus | Garbanzo");
  });
});
