import { aHora, aMinutos } from '../../../shared/utils/horaArgentina.js';
import type { Agenda } from './apertura.js';

const FIN_DEL_DIA = 24 * 60;

// Hasta qué hora atiende sin cortar, uniendo tramos pegados (09–13 y 13–18 →
// 18:00) y, si llega a las 24:00, siguiendo con el tramo de las 00:00 del día
// siguiente (si no es feriado).
export function finDeAtencion(
  agenda: Agenda,
  diaSemana: number,
  desde: number,
  fechaSiguiente: string,
) {
  const delDia = (dia: number) =>
    agenda.tramos
      .filter((t) => t.diaSemana === dia)
      .map((t) => ({ abre: aMinutos(t.abre), cierra: aMinutos(t.cierra) }))
      .sort((a, b) => a.abre - b.abre);

  let fin = desde;
  for (const t of delDia(diaSemana)) if (t.abre <= fin && t.cierra > fin) fin = t.cierra;
  if (fin < FIN_DEL_DIA || agenda.feriados.has(fechaSiguiente)) return aHora(fin);

  let finManiana = 0;
  for (const t of delDia((diaSemana + 1) % 7))
    if (t.abre <= finManiana && t.cierra > finManiana) finManiana = t.cierra;
  return aHora(finManiana > 0 ? finManiana : fin);
}
