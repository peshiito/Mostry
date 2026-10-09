import { useConsulta } from '../../../shared/api/useConsulta.js';
import { turnosDelDia } from '../lib/agenda.js';

// Turnos reales de un día: los tramos vienen de la API (que ya descarta feriados
// y días cerrados); acá se parten en turnos de 30 min respetando la anticipación.
export function useTurnosDia(dia, anticipacionHoras) {
  const fecha = dia ? dia.toLocaleDateString('sv-SE') : null;
  const { datos, cargando, error, recargar } = useConsulta(
    fecha ? `/publico/encargos/disponibilidad?fecha=${fecha}` : null,
  );
  // Un error no es "sin turnos": el comprador ve que falló y puede reintentar.
  const base = { turnos: [], cargando, error, recargar };
  if (!dia || !datos) return { ...base, motivo: null };
  if (!datos.disponible) return { ...base, motivo: datos.motivo };
  const tramos = { [dia.getDay()]: datos.tramos.map((t) => [t.abre, t.cierra]) };
  return {
    ...base,
    turnos: turnosDelDia(dia, tramos, [], anticipacionHoras),
    motivo: null,
  };
}
