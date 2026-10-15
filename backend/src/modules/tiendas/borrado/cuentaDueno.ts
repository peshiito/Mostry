import type { Ejecutor } from '../../../shared/db/ejecutor.js';

// Si el dueño ya no es miembro de ninguna otra tienda, se borra su cuenta: así el
// email queda libre para registrarse de nuevo. Si tiene otra, se conserva.
export async function borrarCuentaSiQuedaSola(tx: Ejecutor, usuarioId: number) {
  const otra = await tx
    .selectFrom('miembrosTienda')
    .select('tiendaId')
    .where('usuarioId', '=', usuarioId)
    .executeTakeFirst();
  if (otra) return false;
  await tx.deleteFrom('sesiones').where('usuarioId', '=', usuarioId).execute();
  await tx.deleteFrom('codigosEmail').where('usuarioId', '=', usuarioId).execute();
  await tx.deleteFrom('usuarios').where('id', '=', usuarioId).execute();
  return true;
}
