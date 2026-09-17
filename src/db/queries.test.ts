import { describe, it, expect } from "vitest";
import { formatoPrecio, precioDesde, nombreCompleto, slotsDistintos, type ProductoFull } from "./queries";

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

describe("slotsDistintos", () => {
  it("ordena y conserva valores ya distintos", () => {
    expect(slotsDistintos([5, 1, 3])).toEqual([1, 3, 5]);
  });
  it("desempata valores repetidos para que el orden sea estable", () => {
    expect(slotsDistintos([0, 0, 2, 0])).toEqual([0, 1, 2, 3]);
    expect(slotsDistintos([4, 4, 5])).toEqual([4, 5, 6]);
  });
});
