import type { Insertable, Updateable } from 'kysely';
import type { Ejecutor } from '../../../shared/db/ejecutor.js';
import { db } from '../../../shared/db/db.js';
import { idInsertado } from '../../../shared/db/idInsertado.js';
import type { TiendaId } from '../../../shared/db/tiendaId.js';
import type { ComprobantesTabla } from '../../../shared/db/tipos/pedidos.js';

const visibles = [
  'id',
  'tipo',
  'estado',
  'archivoTipo',
  'monto',
  'fechaOperacion',
  'titular',
  'numeroOperacion',
  'motivoRechazo',
  'aprobadoEn',
  'rechazadoEn',
  'archivoBorradoEn',
  'creadoEn',
] as const;

// Toda función exige tiendaId y pedidoId.
export const comprobantesRepo = {
  listar: (tiendaId: TiendaId, pedidoId: number) =>
    db
      .selectFrom('comprobantes')
      .select([...visibles, 'archivoClave'])
      .where('tiendaId', '=', tiendaId)
      .where('pedidoId', '=', pedidoId)
      .orderBy('id', 'desc')
      .execute(),

  buscar: (tiendaId: TiendaId, pedidoId: number, id: number, ej: Ejecutor = db) =>
    ej
      .selectFrom('comprobantes')
      .select([...visibles, 'archivoClave'])
      .where('tiendaId', '=', tiendaId)
      .where('pedidoId', '=', pedidoId)
      .where('id', '=', id)
      .executeTakeFirst(),

  async insertar(tx: Ejecutor, fila: Insertable<ComprobantesTabla>) {
    return idInsertado(
      await tx.insertInto('comprobantes').values(fila).executeTakeFirstOrThrow(),
    );
  },

  actualizar: (
    tx: Ejecutor,
    tiendaId: TiendaId,
    id: number,
    cambios: Updateable<ComprobantesTabla>,
  ) =>
    tx
      .updateTable('comprobantes')
      .set(cambios)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute(),
};
