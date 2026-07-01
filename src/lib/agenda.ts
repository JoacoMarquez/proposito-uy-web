// Lógica compartida de agenda: días habilitados (miércoles y viernes) y validación.

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

export interface DiaHabilitado {
  iso: string; // YYYY-MM-DD
  tipo: "miercoles" | "viernes";
  label: string; // "Mié 3 jun"
}

// Período de licencia / pausa de pedidos (PROP-111).
export interface Licencia {
  activa: boolean;
  desde: string | null; // YYYY-MM-DD (inclusive)
  hasta: string | null; // YYYY-MM-DD (inclusive, fecha de regreso)
}

// Normaliza el contenido editable ("tienda") a una Licencia. Queda activa solo
// si tiene ambas fechas, forman un rango válido (desde <= hasta) y la fecha de
// regreso todavía no pasó (hoyIso <= hasta): así se vence sola el día de regreso
// sin necesidad de apagarla desde el panel (PROP-111).
export function parseLicencia(
  c: Record<string, any> | null | undefined,
  hoyIso: string = new Date().toISOString().slice(0, 10),
): Licencia {
  const desde = typeof c?.licenciaDesde === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c.licenciaDesde) ? c.licenciaDesde : null;
  const hasta = typeof c?.licenciaHasta === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c.licenciaHasta) ? c.licenciaHasta : null;
  const activa = c?.licenciaActiva === "si" && !!desde && !!hasta && desde <= hasta && hoyIso <= hasta;
  return { activa, desde, hasta };
}

// ¿La fecha ISO (YYYY-MM-DD) cae dentro del período de licencia?
// Comparación lexicográfica de strings ISO: segura sin importar la zona horaria.
export function enLicencia(iso: string, lic: Licencia | null | undefined): boolean {
  if (!lic?.activa || !lic.desde || !lic.hasta) return false;
  return iso >= lic.desde && iso <= lic.hasta;
}

// Aviso para el cliente durante la licencia. Devuelve null si no está activa.
export function licenciaTexto(lic: Licencia | null | undefined): string | null {
  if (!lic?.activa || !lic.hasta) return null;
  const [, mes, dia] = lic.hasta.split("-");
  return `Estamos de licencia hasta el ${dia}/${mes}. Podés dejar tu pedido agendado para las próximas fechas disponibles.`;
}

// Próximos N días habilitados (mié/vie) a partir de mañana, salteando la licencia.
export function proximosDiasHabilitados(cantidad = 6, lic?: Licencia | null): DiaHabilitado[] {
  const out: DiaHabilitado[] = [];
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  while (out.length < cantidad) {
    d.setUTCDate(d.getUTCDate() + 1);
    const wd = d.getUTCDay();
    if (wd === 3 || wd === 5) {
      const iso = d.toISOString().slice(0, 10);
      if (enLicencia(iso, lic)) continue;
      out.push({
        iso,
        tipo: wd === 3 ? "miercoles" : "viernes",
        label: `${DIAS[wd]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`,
      });
    }
  }
  return out;
}

// Valida la agenda: "coordinacion" (sin fecha) o un día puntual habilitado
// (miércoles/viernes, futuro). Deriva el tipo del día de la semana de la fecha.
export function validarAgenda(
  agenda: unknown,
  fechaAgenda: unknown,
  lic?: Licencia | null,
): { agenda: string; fechaAgenda: string | null } | null {
  if (agenda === "coordinacion") return { agenda: "coordinacion", fechaAgenda: null };
  if (typeof fechaAgenda !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fechaAgenda)) return null;
  const d = new Date(fechaAgenda + "T12:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);
  if (d < hoy) return null;
  const wd = d.getUTCDay();
  if (wd !== 3 && wd !== 5) return null;
  if (enLicencia(fechaAgenda, lic)) return null; // fecha dentro de la licencia
  return { agenda: wd === 3 ? "miercoles" : "viernes", fechaAgenda };
}

const AGENDA_LABEL: Record<string, string> = {
  miercoles: "Miércoles",
  viernes: "Viernes",
  coordinacion: "Coordinación personalizada",
};

// Texto legible de la agenda de un pedido (capitalizado).
export function agendaTexto(agenda: string, fechaAgenda: string | null): string {
  const raw = fechaAgenda
    ? new Date(fechaAgenda + "T12:00:00Z").toLocaleDateString("es-UY", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "UTC",
      })
    : (AGENDA_LABEL[agenda] ?? agenda);
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
