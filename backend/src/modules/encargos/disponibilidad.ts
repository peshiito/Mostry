import {
  aHora,
  aMinutos,
  enArgentina,
  inicioDiaAr,
} from '../../shared/utils/horaArgentina.js';
import type { Agenda } from '../horarios/servicios/apertura.js';
import { MAX_DIAS_ENCARGO } from '../horarios/servicios/fechaEncargo.js';

const HORA_MS = 60 * 60 * 1000;

// Qué horarios puede elegir el comprador para un encargo ese día (sección 6.2):
// los tramos del día, recortados por la anticipación mínima.
export function disponibilidadEncargo(
  agenda: Agenda,
  fecha: string,
  anticipacionHoras: number,
  ahora = new Date(),
) {
  const dia = enArgentina(new Date(inicioDiaAr(fecha).getTime() + 12 * HORA_MS)); // mediodía: día seguro
  const minimo = new Date(ahora.getTime() + anticipacionHoras * HORA_MS);
  const maximo = new Date(ahora.getTime() + MAX_DIAS_ENCARGO * 24 * HORA_MS);
  const sinDisponibilidad = (motivo: string) => ({
    fecha,
    disponible: false as const,
    motivo,
    tramos: [],
  });

  if (agenda.pausada) return sinDisponibilidad('pausada');
  if (agenda.feriados.has(fecha)) return sinDisponibilidad('feriado');
  if (inicioDiaAr(fecha) > maximo) return sinDisponibilidad('muy_lejos');

  // Minuto del día desde el que se puede pedir (si el mínimo cae ese día).
  const minLocal = enArgentina(minimo);
  const desdeMin =
    minLocal.fecha === fecha ? minLocal.minutos : minLocal.fecha > fecha ? Infinity : 0;
  const tramos = agenda.tramos
    .filter((t) => t.diaSemana === dia.diaSemana && aMinutos(t.cierra) > desdeMin)
    .map((t) => ({ abre: aHora(Math.max(aMinutos(t.abre), desdeMin)), cierra: t.cierra }))
    .sort((a, b) => aMinutos(a.abre) - aMinutos(b.abre));
  if (tramos.length === 0)
    return sinDisponibilidad(desdeMin === Infinity ? 'anticipacion' : 'cerrado');
  return { fecha, disponible: true as const, motivo: null, tramos };
}
