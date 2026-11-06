import { randomUUID } from 'node:crypto';
import { borrarPublicos, subirWebp } from '../../../shared/archivos/almacenamiento.js';
import { prefijoTienda } from '../../../shared/archivos/claves.js';
import { aWebp } from '../../../shared/archivos/procesarImagen.js';
import { validarImagen } from '../../../shared/archivos/validarImagen.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { AppError } from '../../../shared/errors/AppError.js';
import { fotosGaleria } from './galeriaLectura.js';

export const MAX_GALERIA = 8;
const LADO = 1200;

// Suma una foto del local. Cuenta con la tienda bloqueada: dos subidas a la vez
// no pueden pasar del máximo.
export async function agregarFoto(tiendaId: TiendaId, archivo: Buffer) {
  await validarImagen(archivo);
  const webp = (await aWebp(archivo, [LADO]))[0] ?? Buffer.alloc(0);
  const clave = `${prefijoTienda(tiendaId)}galeria/${randomUUID()}.webp`;
  await subirWebp(clave, webp);
  try {
    await db.transaction().execute(async (tx) => {
      await tx
        .selectFrom('tiendas')
        .select('id')
        .where('id', '=', tiendaId)
        .forUpdate()
        .execute();
      const { n } = await tx
        .selectFrom('galeriaTienda')
        .select((eb) => eb.fn.countAll<number>().as('n'))
        .where('tiendaId', '=', tiendaId)
        .executeTakeFirstOrThrow();
      if (Number(n) >= MAX_GALERIA)
        throw new AppError(
          409,
          'galeria_llena',
          `Podés tener hasta ${MAX_GALERIA} fotos.`,
        );
      await tx
        .insertInto('galeriaTienda')
        .values({ tiendaId, clave, orden: Number(n) })
        .execute();
    });
  } catch (err) {
    await borrarPublicos(tiendaId, [clave]);
    throw err;
  }
  return fotosGaleria(tiendaId);
}
