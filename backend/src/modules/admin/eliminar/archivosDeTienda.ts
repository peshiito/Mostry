import type { FalloBorrado } from '../../../shared/archivos/borrarClaves.js';
import { clavesDeFoto } from '../../../shared/archivos/claves.js';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';

const conMotivo = (claves: (string | null)[]): FalloBorrado[] =>
  claves
    .filter((c): c is string => !!c)
    .map((clave) => ({ clave, error: 'tienda eliminada' }));

// Las claves de los archivos de la tienda, por bucket: logo y fotos (público),
// comprobantes, capturas de reportes y fotos de referencia (privado). Se encolan para que el worker
// los borre; lo que se escape lo levanta el barrido de huérfanos.
export async function archivosDeTienda(tx: Ejecutor, tiendaId: TiendaId) {
  const [tienda, fotos, comprobantes, reportes, referencias] = await Promise.all([
    tx.selectFrom('tiendas').select('logoClave').where('id', '=', tiendaId).execute(),
    tx
      .selectFrom('productoFotos')
      .select('clave')
      .where('tiendaId', '=', tiendaId)
      .execute(),
    tx
      .selectFrom('comprobantes')
      .select('archivoClave')
      .where('tiendaId', '=', tiendaId)
      .execute(),
    tx
      .selectFrom('reportes')
      .select('claveCaptura')
      .where('tiendaId', '=', tiendaId)
      .execute(),
    tx
      .selectFrom('pedidoItems')
      .select('fotoClave')
      .where('tiendaId', '=', tiendaId)
      .execute(),
  ]);
  const deFotos = fotos.flatMap((f) => Object.values(clavesDeFoto(f.clave)));
  return {
    publico: conMotivo([...tienda.map((t) => t.logoClave), ...deFotos]),
    privado: conMotivo([
      ...comprobantes.map((c) => c.archivoClave),
      ...reportes.map((r) => r.claveCaptura),
      ...referencias.map((r) => r.fotoClave), // fotos de referencia (Encargos 2)
    ]),
  };
}
