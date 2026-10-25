import { describe, it, expect } from "vitest";
import { separarTalle, tallesDe } from "./talles";

describe("separarTalle", () => {
  it("reconoce el prefijo S/L", () => {
    expect(separarTalle("S x12")).toEqual({ talle: "S", resto: "x12" });
    expect(separarTalle("l x24")).toEqual({ talle: "L", resto: "x24" });
  });
  it("deja intacto un label sin talle", () => {
    expect(separarTalle("x12")).toEqual({ talle: null, resto: "x12" });
    expect(separarTalle("Sobre 1 kg")).toEqual({ talle: null, resto: "Sobre 1 kg" });
  });
});

describe("tallesDe", () => {
  it("lista los talles presentes en orden S, L", () => {
    expect(tallesDe([{ label: "L x12" }, { label: "S x12" }])).toEqual(["S", "L"]);
    expect(tallesDe([{ label: "x12" }])).toEqual([]);
  });
});
