import { randomUUID } from 'node:crypto';
import {
  borrarPublicos,
  subirWebp,
  urlPublica,
} from '../../../shared/archivos/almacenamiento.js';
import { prefijoTienda } from '../../../shared/archivos/claves.js';
import { aWebp } from '../../../shared/archivos/procesarImagen.js';
import { validarImagen } from '../../../shared/archivos/validarImagen.js';
import { db } from '../../../shared/db/db.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

// Ancho de la portada: alcanza para un celular con pantalla de alta densidad.
export const ANCHO_PORTADA = 1600;

export const clavePortada = (tiendaId: TiendaId) =>
  `${prefijoTienda(tiendaId)}portada/${randomUUID()}.webp`;

// Cambia la portada con la fila bloqueada y devuelve la anterior (como el logo).
const reemplazar = (tiendaId: TiendaId, clave: string | null) =>
  db.transaction().execute(async (tx) => {
    const { portadaClave } = await tx
      .selectFrom('tiendas')
      .select('portadaClave')
      .where('id', '=', tiendaId)
      .forUpdate()
      .executeTakeFirstOrThrow();
    await tx
      .updateTable('tiendas')
      .set({ portadaClave: clave })
      .where('id', '=', tiendaId)
      .execute();
    return portadaClave;
  });

// Nunca el archivo original: un WebP reprocesado (sin EXIF ni nada escondido).
export async function subirPortada(tiendaId: TiendaId, archivo: Buffer) {
  await validarImagen(archivo);
  const webp = (await aWebp(archivo, [ANCHO_PORTADA]))[0] ?? Buffer.alloc(0);
  const clave = clavePortada(tiendaId);
  let anterior: string | null;
  try {
    await subirWebp(clave, webp);
    anterior = await reemplazar(tiendaId, clave);
  } catch (err) {
    await borrarPublicos(tiendaId, [clave]);
    throw err;
  }
  if (anterior) await borrarPublicos(tiendaId, [anterior]);
  return { portadaUrl: urlPublica(clave) };
}

export async function quitarPortada(tiendaId: TiendaId) {
  const anterior = await reemplazar(tiendaId, null);
  if (anterior) await borrarPublicos(tiendaId, [anterior]);
}
