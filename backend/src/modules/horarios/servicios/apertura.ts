import { aHora, aMinutos, enArgentina } from '../../../shared/utils/horaArgentina.js';
import { finDeAtencion } from './finDeAtencion.js';

export type Tramo = { diaSemana: number; abre: string; cierra: string };
export type Agenda = { tramos: Tramo[]; feriados: Set<string>; pausada: boolean };
type ProximaApertura = { fecha: string; hora: string };

// Contrato con el frontend: cada estado trae solo lo que tiene sentido.
export type EstadoApertura =
  | { abierta: true; cierraA: string | null } // null: abierta las 24 horas
  | { abierta: false; motivo: 'pausada'; proximaApertura: null }
  | {
      abierta: false;
      motivo: 'feriado' | 'fuera_de_horario';
      proximaApertura: ProximaApertura | null;
    };

const DIA_MS = 24 * 60 * 60 * 1000;

// ¿Hay un tramo que cubra ese minuto? (cierra es exclusivo: 13:00 ya está cerrado).
export const hayTramo = (agenda: Agenda, diaSemana: number, minutos: number) =>
  agenda.tramos.some(
    (t) =>
      t.diaSemana === diaSemana &&
      aMinutos(t.abre) <= minutos &&
      minutos < aMinutos(t.cierra),
  );

// Próximo día y hora de apertura en los próximos 14 días (null si no hay horarios).
export function proximaApertura(agenda: Agenda, ahora: Date): ProximaApertura | null {
  for (let d = 0; d <= 14; d++) {
    const l = enArgentina(new Date(ahora.getTime() + d * DIA_MS));
    if (agenda.feriados.has(l.fecha)) continue;
    const desde = d === 0 ? l.minutos : -1;
    const abre = agenda.tramos
      .filter((t) => t.diaSemana === l.diaSemana && aMinutos(t.abre) > desde)
      .map((t) => aMinutos(t.abre))
      .sort((a, b) => a - b)[0];
    if (abre !== undefined) return { fecha: l.fecha, hora: aHora(abre) };
  }
  return null;
}

// Estado para mostrar en la tienda y en el panel (sección 6.3).
export function estadoApertura(agenda: Agenda, ahora = new Date()): EstadoApertura {
  if (agenda.pausada) return { abierta: false, motivo: 'pausada', proximaApertura: null };
  const l = enArgentina(ahora);
  if (agenda.feriados.has(l.fecha)) {
    return {
      abierta: false,
      motivo: 'feriado',
      proximaApertura: proximaApertura(agenda, ahora),
    };
  }
  if (!hayTramo(agenda, l.diaSemana, l.minutos)) {
    return {
      abierta: false,
      motivo: 'fuera_de_horario',
      proximaApertura: proximaApertura(agenda, ahora),
    };
  }
  const maniana = enArgentina(new Date(ahora.getTime() + DIA_MS)).fecha;
  return {
    abierta: true,
    cierraA: finDeAtencion(agenda, l.diaSemana, l.minutos, maniana),
  };
}
