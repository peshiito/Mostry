import { db } from '../../../shared/db/db.js';
import { borrarTiendaEnTx } from '../../tiendas/borrado/borrarTienda.js';
import { borrarCuentaSiQuedaSola } from '../../tiendas/borrado/cuentaDueno.js';
import { tiendasRepo } from '../../tiendas/tiendas.repository.js';

// Los códigos duran 10 minutos: pasada media hora, el registro quedó a medias.
const VENCE_MS = 30 * 60 * 1000;

const vencido = (u: { emailVerificadoEn: Date | null; creadoEn: Date }, ahora: number) =>
  !u.emailVerificadoEn && ahora - u.creadoEn.getTime() >= VENCE_MS;

// Un registro que nunca verificó su email no bloquea para siempre el email ni el
// link: pasada media hora se libera y se puede registrar de nuevo. Antes NO se
// toca: si no, cualquiera podría registrarse encima de un registro ajeno con su
// propia contraseña y quedarse con la cuenta cuando el dueño verifique.
export async function liberarRegistrosVencidos(
  email: string,
  slug: string,
  ahora = Date.now(),
) {
  const porEmail = await db
    .selectFrom('usuarios')
    .select(['id', 'emailVerificadoEn', 'creadoEn'])
    .where('email', '=', email)
    .executeTakeFirst();
  const porSlug = await db
    .selectFrom('tiendas')
    .innerJoin('miembrosTienda as m', 'm.tiendaId', 'tiendas.id')
    .innerJoin('usuarios as u', 'u.id', 'm.usuarioId')
    .select(['u.id', 'u.emailVerificadoEn', 'u.creadoEn'])
    .where('tiendas.slug', '=', slug)
    .executeTakeFirst();
  for (const u of [porEmail, porSlug]) {
    if (u && vencido(u, ahora)) await borrarRegistro(u.id);
  }
}

async function borrarRegistro(usuarioId: number) {
  const tiendas = await db
    .selectFrom('miembrosTienda')
    .select('tiendaId')
    .where('usuarioId', '=', usuarioId)
    .execute();
  await db.transaction().execute(async (tx) => {
    for (const { tiendaId } of tiendas) {
      const id = await tiendasRepo.verificarId(tiendaId);
      if (id) await borrarTiendaEnTx(tx, id, usuarioId);
    }
    await borrarCuentaSiQuedaSola(tx, usuarioId);
  });
}
