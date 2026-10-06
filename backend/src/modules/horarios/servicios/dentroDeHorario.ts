import { enArgentina } from '../../../shared/utils/horaArgentina.js';
import { hayTramo, type Agenda } from './apertura.js';

// ¿Se puede atender en ese instante? (Ignora la pausa: eso lo decide quien llama.)
export function dentroDeHorario(agenda: Agenda, instante: Date): boolean {
  const l = enArgentina(instante);
  return !agenda.feriados.has(l.fecha) && hayTramo(agenda, l.diaSemana, l.minutos);
}
