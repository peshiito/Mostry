import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Mientras se carga la demo, la tienda atiende las 24 horas, sin feriados y sin
// seña (para poder crear pedidos a cualquier hora). Devuelve cómo dejarla igual
// que estaba, y la demo lo llama siempre al final (aunque algo falle).
export async function abrirParaDemo(tiendaId: TiendaId) {
  const horarios = await db
    .selectFrom('horarios')
    .select(['diaSemana', 'abre', 'cierra'])
    .where('tiendaId', '=', tiendaId)
    .execute();
  const feriados = await db
    .selectFrom('feriados')
    .select(['fecha', 'motivo'])
    .where('tiendaId', '=', tiendaId)
    .execute();
  const { senaPorcentaje } = await db
    .selectFrom('tiendas')
    .select('senaPorcentaje')
    .where('id', '=', tiendaId)
    .executeTakeFirstOrThrow();

  await db.deleteFrom('horarios').where('tiendaId', '=', tiendaId).execute();
  await db.deleteFrom('feriados').where('tiendaId', '=', tiendaId).execute();
  await db
    .insertInto('horarios')
    .values(
      [0, 1, 2, 3, 4, 5, 6].map((diaSemana) => ({
        tiendaId,
        diaSemana,
        abre: '00:00',
        cierra: '24:00',
      })),
    )
    .execute();

  const ponerSena = (porcentaje: number) =>
    db
      .updateTable('tiendas')
      .set({ senaPorcentaje: porcentaje })
      .where('id', '=', tiendaId)
      .execute();

  return {
    sinSena: () => ponerSena(0),
    conSena: () => ponerSena(senaPorcentaje),
    async restaurar() {
      await db.deleteFrom('horarios').where('tiendaId', '=', tiendaId).execute();
      if (horarios.length)
        await db
          .insertInto('horarios')
          .values(horarios.map((h) => ({ tiendaId, ...h })))
          .execute();
      if (feriados.length)
        await db
          .insertInto('feriados')
          .values(feriados.map((f) => ({ tiendaId, ...f })))
          .execute();
      await ponerSena(senaPorcentaje);
    },
  };
}
