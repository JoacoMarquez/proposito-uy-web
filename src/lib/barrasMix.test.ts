import { describe, it, expect } from "vitest";
import {
  RECARGO_CAJU,
  cantidadTamano,
  totalBarras,
  mixValido,
  precioMix,
  etiquetaMix,
  type MixDetalle,
} from "./barrasMix";

// Construye un mix con los sabores indicados (los faltantes en 0).
function mix(tamano: string, sabores: Partial<MixDetalle["sabores"]>): MixDetalle {
  return { tamano, sabores: { clasica: 0, coco: 0, chocolate: 0, caju: 0, ...sabores } };
}

describe("cantidadTamano", () => {
  it("deriva la capacidad de los dígitos del label", () => {
    expect(cantidadTamano("x12")).toBe(12);
    expect(cantidadTamano("Caja x24")).toBe(24);
    expect(cantidadTamano("x48")).toBe(48);
  });
  it("devuelve null si no hay dígitos válidos", () => {
    expect(cantidadTamano("")).toBeNull();
    expect(cantidadTamano("Caja chica")).toBeNull();
    expect(cantidadTamano("x0")).toBeNull(); // capacidad 0 no es válida
    expect(cantidadTamano(undefined as unknown as string)).toBeNull();
  });
});

describe("totalBarras", () => {
  it("suma todos los sabores", () => {
    expect(totalBarras({ clasica: 4, coco: 4, chocolate: 2, caju: 2 })).toBe(12);
  });
  it("ignora valores no numéricos", () => {
    expect(totalBarras({ clasica: 12 } as MixDetalle["sabores"])).toBe(12);
  });
});

describe("mixValido", () => {
  it("acepta cuando los sabores suman exactamente la capacidad", () => {
    expect(mixValido(mix("x12", { clasica: 6, coco: 6 }))).toBe(true);
    expect(mixValido(mix("x24", { clasica: 12, caju: 12 }))).toBe(true);
  });
  it("rechaza si la suma no coincide con la capacidad", () => {
    expect(mixValido(mix("x12", { clasica: 6, coco: 5 }))).toBe(false); // 11
    expect(mixValido(mix("x12", { clasica: 6, coco: 7 }))).toBe(false); // 13
  });
  it("rechaza cantidades negativas o no enteras", () => {
    expect(mixValido(mix("x12", { clasica: -1, coco: 13 }))).toBe(false);
    expect(mixValido(mix("x12", { clasica: 6.5, coco: 5.5 }))).toBe(false);
  });
  it("rechaza un tamaño inválido", () => {
    expect(mixValido(mix("sin numero", { clasica: 12 }))).toBe(false);
  });
});

describe("precioMix", () => {
  it("suma el recargo de Cajú a la base", () => {
    expect(precioMix(1000, mix("x12", { clasica: 12 }))).toBe(1000);
    expect(precioMix(1000, mix("x12", { caju: 3, clasica: 9 }))).toBe(1000 + RECARGO_CAJU * 3);
  });
  it("solo cobra recargo por las barras de Cajú", () => {
    expect(precioMix(500, mix("x12", { coco: 6, caju: 6 }))).toBe(500 + RECARGO_CAJU * 6);
  });
});

describe("etiquetaMix", () => {
  it("lista solo los sabores con cantidad > 0", () => {
    expect(etiquetaMix(mix("x12", { clasica: 4, coco: 4, caju: 4 }))).toBe(
      "x12 · 4 Clásica, 4 Coco, 4 Cajú",
    );
  });
  it("omite los sabores en 0", () => {
    expect(etiquetaMix(mix("x12", { clasica: 12 }))).toBe("x12 · 12 Clásica");
  });
});
