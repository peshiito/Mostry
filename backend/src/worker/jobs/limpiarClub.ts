import { db } from '../../shared/db/db.js';

const DIA = 24 * 60 * 60 * 1000;
const cuantas = (r: { numDeletedRows: bigint }) => Number(r.numDeletedRows);

// Job: borra los códigos de QR y las sesiones vencidas del Club, los códigos por
// mail de hace más de un día y los registros que nunca se verificaron (más de un
// día): así un email no queda tomado por un alta a medias. Idempotente.
export async function limpiarClub(ahora = new Date()) {
  const ayer = new Date(ahora.getTime() - DIA);
  const qr = await db
    .deleteFrom('codigosClub')
    .where('expiraEn', '<=', ahora)
    .executeTakeFirst();
  const sesiones = await db
    .deleteFrom('sesionesClub')
    .where('expiraEn', '<=', ahora)
    .executeTakeFirst();
  const viejos = db
    .selectFrom('clientes')
    .select('id')
    .where('emailVerificadoEn', 'is', null)
    .where('creadoEn', '<', ayer);
  const sinVerificar = await db.transaction().execute(async (tx) => {
    const ids = (await viejos.execute()).map((c) => c.id);
    if (!ids.length) return 0;
    for (const t of ['codigosClub', 'codigosEmailClub', 'sesionesClub'] as const)
      await tx.deleteFrom(t).where('clienteId', 'in', ids).execute();
    return cuantas(
      await tx.deleteFrom('clientes').where('id', 'in', ids).executeTakeFirst(),
    );
  });
  const codigos = await db
    .deleteFrom('codigosEmailClub')
    .where('expiraEn', '<=', ayer)
    .executeTakeFirst();
  return {
    qr: cuantas(qr),
    sesiones: cuantas(sesiones),
    codigos: cuantas(codigos),
    sinVerificar,
  };
}
