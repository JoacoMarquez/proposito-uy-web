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
  it("en Plantines los títulos son fijos", () => {
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
  const plantines = [p("romero", "plantines"), p("lavanda", "plantines"), p("menta", "plantines"), p("ruda", "plantines", false)];
  const insumos = [p("tierra", "insumos"), p("compost", "insumos"), p("balde", "insumos"), p("bancal", "insumos", false)];
  const todos = [...plantines, ...insumos];
  const slugs = (xs: { slug: string }[]) => xs.map((x) => x.slug);

  it("viendo un plantín: 2 insumos + 1 plantín", () => {
    expect(slugs(recomendados(p("romero", "plantines"), todos))).toEqual(["tierra", "compost", "lavanda"]);
  });
  it("viendo un insumo: 2 plantines + 1 insumo", () => {
    expect(slugs(recomendados(p("tierra", "insumos"), todos))).toEqual(["romero", "lavanda", "compost"]);
  });
  it("si falta la otra categoría, completa con la misma", () => {
    expect(slugs(recomendados(p("romero", "plantines"), plantines))).toEqual(["lavanda", "menta", "ruda"]);
    expect(slugs(recomendados(p("romero", "plantines"), [...plantines, p("tierra", "insumos")]))).toEqual(["tierra", "lavanda", "menta"]);
  });
  it("usa agotados solo si no hay suficientes disponibles", () => {
    const pocos = [p("romero", "plantines"), p("ruda", "plantines", false), p("tierra", "insumos")];
    expect(slugs(recomendados(p("romero", "plantines"), pocos))).toEqual(["tierra", "ruda"]);
  });
  it("nunca repite el actual ni duplica", () => {
    const r = slugs(recomendados(p("tierra", "insumos"), [...todos, ...todos]));
    expect(new Set(r).size).toBe(r.length);
    expect(r).not.toContain("tierra");
  });
});
