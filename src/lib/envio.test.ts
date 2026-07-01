import { describe, it, expect } from "vitest";
import { costoEnvio, notaEnvio, COSTO_ENVIO, ENVIO_GRATIS_DESDE } from "./envio";
import { formatoPrecio } from "../scripts/cart";

describe("costoEnvio", () => {
  it("retiro en planta no paga envío", () => {
    expect(costoEnvio(0, "retiro")).toBe(0);
    expect(costoEnvio(99999, "retiro")).toBe(0);
  });
  it("entrega por debajo del mínimo paga el costo de envío", () => {
    expect(costoEnvio(0, "entrega")).toBe(COSTO_ENVIO);
    expect(costoEnvio(ENVIO_GRATIS_DESDE - 1, "entrega")).toBe(COSTO_ENVIO);
  });
  it("entrega desde el mínimo es gratis (límite inclusivo)", () => {
    expect(costoEnvio(ENVIO_GRATIS_DESDE, "entrega")).toBe(0);
    expect(costoEnvio(ENVIO_GRATIS_DESDE + 500, "entrega")).toBe(0);
  });
});

describe("notaEnvio", () => {
  it("no se muestra en retiro", () => {
    expect(notaEnvio(0, "retiro", formatoPrecio)).toBeNull();
  });
  it("avisa cuánto falta para el envío gratis", () => {
    const nota = notaEnvio(2500, "entrega", formatoPrecio);
    expect(nota).toBe("Te faltan $U500 para envío gratis (desde $U3.000).");
  });
  it("celebra cuando ya tiene envío gratis", () => {
    expect(notaEnvio(ENVIO_GRATIS_DESDE, "entrega", formatoPrecio)).toBe("🎉 ¡Tu pedido tiene envío gratis!");
  });
});
