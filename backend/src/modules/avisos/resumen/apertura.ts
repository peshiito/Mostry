import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { aMinutos, enArgentina } from '../../../shared/utils/horaArgentina.js';

const NUEVE = 9 * 60;
const CINCO = 5 * 60;

// A qué hora abre hoy (minutos, hora argentina): el primer tramo del día. Si
// hoy no abre (cerrado o feriado), o "abre" de madrugada (24 h o un tramo que
// viene de la noche anterior), el resumen va a las 9: nunca un "buen día" a las 0.
export async function aperturaDeHoy(tiendaId: TiendaId, ahora: Date) {
  const hoy = enArgentina(ahora);
  const [tramo, feriado] = await Promise.all([
    db
      .selectFrom('horarios')
      .select('abre')
      .where('tiendaId', '=', tiendaId)
      .where('diaSemana', '=', hoy.diaSemana)
      .orderBy('abre')
      .executeTakeFirst(),
    db
      .selectFrom('feriados')
      .select('id')
      .where('tiendaId', '=', tiendaId)
      .where('fecha', '=', hoy.fecha)
      .executeTakeFirst(),
  ]);
  const abre = tramo && !feriado ? aMinutos(tramo.abre) : NUEVE;
  return abre < CINCO ? NUEVE : abre;
}
