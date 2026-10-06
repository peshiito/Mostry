import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import { comprobantesRepo } from '../repositorios/comprobantes.repository.js';
import type { DatosAprobacion } from '../schemas.js';

const HORA_MS = 60 * 60 * 1000;

// Guarda los datos del pago (campo por campo: nada del body pisa el estado) y
// programa el borrado del archivo a las 2 h (sección 6.1).
export async function marcarAprobado(
  tx: Ejecutor,
  tiendaId: TiendaId,
  id: number,
  usuarioId: number,
  d: DatosAprobacion,
) {
  const ahora = new Date();
  await comprobantesRepo.actualizar(tx, tiendaId, id, {
    estado: 'aprobado',
    monto: d.monto,
    fechaOperacion: d.fechaOperacion,
    titular: d.titular,
    numeroOperacion: d.numeroOperacion,
    revisadoPor: usuarioId,
    aprobadoEn: ahora,
    archivoBorrarEn: new Date(ahora.getTime() + 2 * HORA_MS),
  });
}
