// Lógica compartida de agenda: días habilitados (miércoles y viernes) y validación.

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];

export interface DiaHabilitado {
  iso: string; // YYYY-MM-DD
  tipo: "miercoles" | "viernes";
  label: string; // "Mié 3 jun"
}

// Próximos N días habilitados (mié/vie) a partir de mañana.
export function proximosDiasHabilitados(cantidad = 6): DiaHabilitado[] {
  const out: DiaHabilitado[] = [];
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  while (out.length < cantidad) {
    d.setUTCDate(d.getUTCDate() + 1);
    const wd = d.getUTCDay();
    if (wd === 3 || wd === 5) {
      const iso = d.toISOString().slice(0, 10);
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
