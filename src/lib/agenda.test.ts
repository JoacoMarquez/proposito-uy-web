import { describe, it, expect } from "vitest";
import { validarAgenda, proximosDiasHabilitados, agendaTexto, parseLicencia, enLicencia, licenciaTexto } from "./agenda";

// Próxima fecha (ISO, UTC) cuyo día de la semana sea `dow` (0=Dom … 6=Sáb),
// estrictamente a futuro respecto de hoy. Misma base UTC que usa el módulo.
function proximoDow(dow: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  do {
    d.setUTCDate(d.getUTCDate() + 1);
  } while (d.getUTCDay() !== dow);
  return d.toISOString().slice(0, 10);
}

describe("validarAgenda", () => {
  it("acepta coordinación sin fecha", () => {
    expect(validarAgenda("coordinacion", null)).toEqual({ agenda: "coordinacion", fechaAgenda: null });
  });
  it("deriva el tipo del día desde la fecha (miércoles)", () => {
    const iso = proximoDow(3);
    expect(validarAgenda("loquesea", iso)).toEqual({ agenda: "miercoles", fechaAgenda: iso });
  });
  it("deriva el tipo del día desde la fecha (viernes)", () => {
    const iso = proximoDow(5);
    expect(validarAgenda("loquesea", iso)).toEqual({ agenda: "viernes", fechaAgenda: iso });
  });
  it("rechaza un día que no es miércoles ni viernes", () => {
    expect(validarAgenda("dia", proximoDow(1))).toBeNull(); // lunes
  });
  it("rechaza una fecha pasada", () => {
    expect(validarAgenda("dia", "2020-01-01")).toBeNull();
  });
  it("rechaza formatos inválidos", () => {
    expect(validarAgenda("dia", "no-es-fecha")).toBeNull();
    expect(validarAgenda("dia", "2026/06/10")).toBeNull();
    expect(validarAgenda("dia", undefined)).toBeNull();
  });
});

describe("proximosDiasHabilitados", () => {
  it("devuelve la cantidad pedida, todos mié/vie y a futuro, en orden", () => {
    const dias = proximosDiasHabilitados(6);
    const hoyIso = new Date().toISOString().slice(0, 10);
    expect(dias).toHaveLength(6);
    for (const d of dias) {
      expect(["miercoles", "viernes"]).toContain(d.tipo);
      expect(d.iso > hoyIso).toBe(true);
      const dow = new Date(d.iso + "T12:00:00Z").getUTCDay();
      expect(d.tipo === "miercoles" ? dow === 3 : dow === 5).toBe(true);
    }
    const isos = dias.map((d) => d.iso);
    expect([...isos].sort()).toEqual(isos); // estrictamente crecientes
  });
});

describe("licencia (PROP-111)", () => {
  it("parseLicencia normaliza y solo queda activa con rango válido", () => {
    // hoyIso fijo dentro del rango → determinista
    const hoy = "2026-07-05";
    expect(parseLicencia({ licenciaActiva: "si", licenciaDesde: "2026-07-01", licenciaHasta: "2026-07-15" }, hoy))
      .toEqual({ activa: true, desde: "2026-07-01", hasta: "2026-07-15" });
    // inactiva si falta el flag
    expect(parseLicencia({ licenciaDesde: "2026-07-01", licenciaHasta: "2026-07-15" }, hoy).activa).toBe(false);
    // inactiva si desde > hasta
    expect(parseLicencia({ licenciaActiva: "si", licenciaDesde: "2026-07-20", licenciaHasta: "2026-07-15" }, hoy).activa).toBe(false);
    // inactiva si falta una fecha
    expect(parseLicencia({ licenciaActiva: "si", licenciaDesde: "2026-07-01", licenciaHasta: "" }, hoy).activa).toBe(false);
  });

  it("parseLicencia se vence sola pasada la fecha de regreso (hasta)", () => {
    const c = { licenciaActiva: "si", licenciaDesde: "2026-07-01", licenciaHasta: "2026-07-15" };
    // antes o durante la licencia → activa (incluye el mismo día de regreso, inclusive)
    expect(parseLicencia(c, "2026-06-20").activa).toBe(true); // futura: aún activa (oculta sus fechas)
    expect(parseLicencia(c, "2026-07-15").activa).toBe(true); // último día, inclusive
    // pasado el regreso → se apaga sola, sin tocar el panel
    expect(parseLicencia(c, "2026-07-16").activa).toBe(false);
    expect(parseLicencia(c, "2026-08-01").activa).toBe(false);
  });

  it("enLicencia es inclusivo en los bordes", () => {
    const lic = { activa: true, desde: "2026-07-01", hasta: "2026-07-15" };
    expect(enLicencia("2026-07-01", lic)).toBe(true);
    expect(enLicencia("2026-07-15", lic)).toBe(true);
    expect(enLicencia("2026-06-30", lic)).toBe(false);
    expect(enLicencia("2026-07-16", lic)).toBe(false);
    // licencia inactiva nunca bloquea
    expect(enLicencia("2026-07-10", { activa: false, desde: "2026-07-01", hasta: "2026-07-15" })).toBe(false);
  });

  it("proximosDiasHabilitados saltea los días dentro de la licencia", () => {
    const sinLic = proximosDiasHabilitados(6);
    const d0 = sinLic[0].iso;
    const lic = { activa: true, desde: d0, hasta: d0 };
    const conLic = proximosDiasHabilitados(6, lic);
    expect(conLic).toHaveLength(6);
    expect(conLic.map((d) => d.iso)).not.toContain(d0);
    for (const d of conLic) expect(enLicencia(d.iso, lic)).toBe(false);
  });

  it("validarAgenda rechaza una fecha dentro de la licencia", () => {
    const iso = proximoDow(3); // próximo miércoles
    expect(validarAgenda("dia", iso, { activa: true, desde: iso, hasta: iso })).toBeNull();
    // sin licencia, la misma fecha es válida
    expect(validarAgenda("dia", iso)).toEqual({ agenda: "miercoles", fechaAgenda: iso });
  });

  it("licenciaTexto arma el aviso con la fecha de regreso (DD/MM)", () => {
    expect(licenciaTexto({ activa: true, desde: "2026-07-01", hasta: "2026-07-15" }))
      .toBe("Estamos de licencia hasta el 15/07. Podés dejar tu pedido agendado para las próximas fechas disponibles.");
    expect(licenciaTexto({ activa: false, desde: null, hasta: null })).toBeNull();
  });
});

describe("agendaTexto", () => {
  it("capitaliza la etiqueta de coordinación", () => {
    expect(agendaTexto("coordinacion", null)).toBe("Coordinación personalizada");
  });
  it("usa la etiqueta del tipo cuando no hay fecha", () => {
    expect(agendaTexto("miercoles", null)).toBe("Miércoles");
    expect(agendaTexto("viernes", null)).toBe("Viernes");
  });
  it("formatea y capitaliza una fecha concreta", () => {
    // 2026-06-10 es miércoles; el texto debe empezar en mayúscula y mencionar el mes.
    const txt = agendaTexto("miercoles", "2026-06-10");
    expect(txt[0]).toBe(txt[0].toUpperCase());
    expect(txt.toLowerCase()).toContain("junio");
  });
});
