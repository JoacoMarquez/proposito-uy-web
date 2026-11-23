import { describe, it, expect } from "vitest";
import {
  ESPECIFICACIONES,
  tarjetasEspecificacion,
  limpiarEspecificaciones,
  recomendados,
  rutaSeccion,
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

describe("títulos editables en Insumos", () => {
  it("usa el título propio del producto y si no el por defecto", () => {
    const t = tarjetasEspecificacion("insumos", { materiales: "Turba", titulo_materiales: "Composición", aplicacion: "Macetas" });
    expect(t).toEqual([
      { label: "Composición", valor: "Turba" },
      { label: "Aplicación", valor: "Macetas" },
    ]);
  });
  it("guarda solo títulos distintos al por defecto", () => {
    expect(
      limpiarEspecificaciones("insumos", { materiales: "Turba", titulo_materiales: "Composición", titulo_aplicacion: "Aplicación" }),
    ).toEqual({ materiales: "Turba", titulo_materiales: "Composición" });
  });
  it("en Plantines y Cosechas los títulos son fijos", () => {
    expect(limpiarEspecificaciones("cosechas", { variedad: "Crespa", titulo_variedad: "Otra" })).toEqual({ variedad: "Crespa" });
    expect(tarjetasEspecificacion("plantines", { especie: "Romero", titulo_especie: "X" })[0].label).toBe("Especie");
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
  const todos = [p("romero", "plantines"), p("lavanda", "plantines"), p("tierra", "insumos"), p("lechuga", "cosechas"), p("agotado", "insumos", false)];

  it("excluye el actual y los agotados, y mezcla categorías", () => {
    const r = recomendados(p("romero", "plantines"), todos).map((x) => x.slug);
    expect(r).toEqual(["tierra", "lavanda", "lechuga"]);
  });
  it("respeta la cantidad pedida", () => {
    expect(recomendados(p("romero", "plantines"), todos, 2)).toHaveLength(2);
  });
});
