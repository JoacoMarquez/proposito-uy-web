import { describe, it, expect } from "vitest";
import {
  ESPECIFICACIONES,
  tarjetasEspecificacion,
  limpiarEspecificaciones,
  esDigital,
  llevaPdf,
  recomendados,
  rutaSeccion,
  distintivoCultivo,
} from "./cultivo";

describe("especificaciones por tipo", () => {
  it("cada tipo tiene seis tarjetas", () => {
    for (const campos of Object.values(ESPECIFICACIONES)) expect(campos).toHaveLength(6);
  });
  it("muestra solo las cargadas, en el orden del tipo", () => {
    const t = tarjetasEspecificacion("plantines", { riego: "Moderado", especie: "Romero", suelo: " " });
    expect(t).toEqual([
      { label: "Especie", valor: "Romero" },
      { label: "Riego", valor: "Moderado" },
    ]);
  });
  it("un tipo desconocido no muestra tarjetas", () => {
    expect(tarjetasEspecificacion(null, { especie: "x" })).toEqual([]);
  });
  it("limpia claves ajenas al tipo y valores vacíos", () => {
    expect(limpiarEspecificaciones("insumos", { materiales: " Tierra ", especie: "x", aplicacion: "" })).toEqual({
      materiales: "Tierra",
    });
  });
});

describe("digital y PDF", () => {
  it("solo Conocimiento es digital", () => {
    expect(esDigital("conocimiento")).toBe(true);
    expect(esDigital("plantines")).toBe(false);
    expect(esDigital(null)).toBe(false);
  });
  it("plantines y conocimiento llevan PDF; insumos no", () => {
    expect(llevaPdf("plantines")).toBe(true);
    expect(llevaPdf("conocimiento")).toBe(true);
    expect(llevaPdf("insumos")).toBe(false);
  });
});

describe("distintivoCultivo", () => {
  it("plantines solo muestra 'incluye ficha' si hay PDF cargado", () => {
    expect(distintivoCultivo("plantines", false, false)).toBeNull();
    expect(distintivoCultivo("plantines", true, true)).toMatch(/PDF/);
  });
  it("conocimiento siempre es entrega digital; insumos no lleva", () => {
    expect(distintivoCultivo("conocimiento")).toMatch(/digital/);
    expect(distintivoCultivo("insumos")).toBeNull();
  });
});

describe("rutaSeccion", () => {
  it("cultivo va a /cultivo y el resto a /tienda", () => {
    expect(rutaSeccion("cultivo")).toBe("/cultivo");
    expect(rutaSeccion("tienda")).toBe("/tienda");
    expect(rutaSeccion(undefined)).toBe("/tienda");
  });
});

describe("recomendados", () => {
  const p = (slug: string, categoriaSlug: string, disponible = true) => ({ slug, categoriaSlug, disponible });
  const todos = [p("romero", "plantines"), p("lavanda", "plantines"), p("tierra", "insumos"), p("guia", "conocimiento"), p("agotado", "insumos", false)];

  it("excluye el actual y los agotados, y mezcla categorías", () => {
    const r = recomendados(p("romero", "plantines"), todos).map((x) => x.slug);
    expect(r).toEqual(["tierra", "lavanda", "guia"]);
  });
  it("respeta la cantidad pedida", () => {
    expect(recomendados(p("romero", "plantines"), todos, 2)).toHaveLength(2);
  });
});
