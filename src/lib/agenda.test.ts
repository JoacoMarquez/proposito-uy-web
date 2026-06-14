import { describe, it, expect } from "vitest";
import { validarAgenda, proximosDiasHabilitados, agendaTexto } from "./agenda";

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
