import { describe, it, expect } from "vitest";
import {
  validarPdf,
  esPdf,
  mesActual,
  nombreDescarga,
  PDF_MAX_BYTES,
  ALMACENAMIENTO_MAX_BYTES,
  ESCRITURAS_MES_MAX,
  MB,
} from "./archivos-limites";

const PDF = new TextEncoder().encode("%PDF-1.7");
const NO_PDF = new TextEncoder().encode("<html>");
const ok = { size: 2 * MB, cabecera: PDF, usadoBytes: 0, escriturasMes: 0 };

describe("validarPdf", () => {
  it("acepta un PDF chico con espacio disponible", () => {
    expect(validarPdf(ok)).toBeNull();
  });
  it("rechaza lo que no es PDF aunque diga serlo", () => {
    expect(validarPdf({ ...ok, cabecera: NO_PDF })).toMatch(/PDF/);
  });
  it("rechaza archivos de más de 20 MB", () => {
    expect(validarPdf({ ...ok, size: PDF_MAX_BYTES + 1 })).toMatch(/máximo/);
  });
  it("corta antes de pasar el tope de almacenamiento", () => {
    expect(validarPdf({ ...ok, usadoBytes: ALMACENAMIENTO_MAX_BYTES - MB })).toMatch(/espacio/);
  });
  it("al reemplazar un archivo cuenta el espacio que libera", () => {
    expect(validarPdf({ ...ok, usadoBytes: ALMACENAMIENTO_MAX_BYTES - MB, reemplazaBytes: 2 * MB })).toBeNull();
  });
  it("corta al llegar al tope mensual de subidas", () => {
    expect(validarPdf({ ...ok, escriturasMes: ESCRITURAS_MES_MAX })).toMatch(/tope mensual/);
  });
});

describe("helpers", () => {
  it("detecta la firma de PDF", () => {
    expect(esPdf(PDF)).toBe(true);
    expect(esPdf(NO_PDF)).toBe(false);
  });
  it("mes en UTC", () => {
    expect(mesActual(new Date("2026-12-31T23:30:00-03:00"))).toBe("2027-01");
  });
  it("nombre de descarga seguro", () => {
    expect(nombreDescarga('Guía "Huerta"\n')).toBe("Guia Huerta.pdf");
    expect(nombreDescarga(null)).toBe("documento.pdf");
    expect(nombreDescarga("ficha.pdf")).toBe("ficha.pdf");
  });
});
