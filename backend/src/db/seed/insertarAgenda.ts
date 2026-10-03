import { dentroDeDias } from './fechas.js';
import type { Tx } from './insertar.js';
import type { DatosSeed } from './tipos.js';

// Horarios por día, un feriado y una promoción vigente.
export async function insertarAgenda(tx: Tx, tiendaId: number, datos: DatosSeed) {
  const horarios = datos.horarios.flatMap((h) =>
    h.dias.map((diaSemana) => ({ tiendaId, diaSemana, abre: h.abre, cierra: h.cierra })),
  );
  await tx.insertInto('horarios').values(horarios).execute();
  await tx
    .insertInto('feriados')
    .values({ tiendaId, ...datos.feriado })
    .execute();

  const { titulo, descripcion, dias } = datos.promocion;
  await tx
    .insertInto('promociones')
    .values({
      tiendaId,
      titulo,
      descripcion,
      desde: new Date(),
      hasta: dentroDeDias(dias),
    })
    .execute();
}
