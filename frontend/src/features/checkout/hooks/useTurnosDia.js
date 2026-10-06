import { useConsulta } from '../../../shared/api/useConsulta.js';
import { turnosDelDia } from '../lib/agenda.js';

// Turnos reales de un día: los tramos vienen de la API (que ya descarta feriados
// y días cerrados); acá se parten en turnos de 30 min respetando la anticipación.
export function useTurnosDia(dia, anticipacionHoras) {
  const fecha = dia ? dia.toLocaleDateString('sv-SE') : null;
  const { datos, cargando } = useConsulta(
    fecha ? `/publico/encargos/disponibilidad?fecha=${fecha}` : null,
  );
  if (!dia || !datos) return { turnos: [], cargando, motivo: null };
  if (!datos.disponible) return { turnos: [], cargando, motivo: datos.motivo };
  const tramos = { [dia.getDay()]: datos.tramos.map((t) => [t.abre, t.cierra]) };
  return {
    turnos: turnosDelDia(dia, tramos, [], anticipacionHoras),
    cargando,
    motivo: null,
  };
}
