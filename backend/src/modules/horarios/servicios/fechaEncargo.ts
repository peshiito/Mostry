import type { Agenda } from './apertura.js';
import { dentroDeHorario } from './dentroDeHorario.js';

export const MAX_DIAS_ENCARGO = 60;
const HORA_MS = 60 * 60 * 1000;

export type ProblemaEncargo =
  'pausada' | 'pasado' | 'anticipacion' | 'muy_lejos' | 'feriado_o_fuera_de_horario';

// ¿Se puede pedir un encargo para esa fecha y hora? (sección 6.2)
// Pausada no acepta nada, ni encargos (decisión 20 de la Etapa 1). Además tiene
// que respetar la anticipación mínima, caer dentro de un tramo y no ser feriado.
export function problemaFechaEncargo(
  agenda: Agenda,
  anticipacionHoras: number,
  fecha: Date,
  ahora = new Date(),
): ProblemaEncargo | null {
  if (agenda.pausada) return 'pausada';
  const t = fecha.getTime();
  if (t <= ahora.getTime()) return 'pasado';
  if (t < ahora.getTime() + anticipacionHoras * HORA_MS) return 'anticipacion';
  if (t > ahora.getTime() + MAX_DIAS_ENCARGO * 24 * HORA_MS) return 'muy_lejos';
  if (!dentroDeHorario(agenda, fecha)) return 'feriado_o_fuera_de_horario';
  return null;
}
