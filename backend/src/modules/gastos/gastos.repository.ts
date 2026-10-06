import type { Insertable } from 'kysely';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { GastosTabla } from '../../shared/db/tipos/caja.js';

export type FiltrosGastos = { desde: Date; hasta: Date; tipo?: 'gasto' | 'inversion' };

export const gastosRepo = {
  async insertar(tx: Ejecutor, fila: Insertable<GastosTabla>) {
    return idInsertado(
      await tx.insertInto('gastos').values(fila).executeTakeFirstOrThrow(),
    );
  },

  listar: (tiendaId: TiendaId, f: FiltrosGastos) => {
    let q = db
      .selectFrom('gastos')
      .leftJoin('proveedores', (j) =>
        j
          .onRef('proveedores.id', '=', 'gastos.proveedorId')
          .onRef('proveedores.tiendaId', '=', 'gastos.tiendaId'),
      )
      .select([
        'gastos.id',
        'gastos.tipo',
        'gastos.monto',
        'gastos.medio',
        'gastos.fecha',
        'gastos.detalle',
        'gastos.proveedorId',
      ])
      .select('proveedores.nombre as proveedor')
      .where('gastos.tiendaId', '=', tiendaId)
      .where('gastos.fecha', '>=', f.desde)
      .where('gastos.fecha', '<', f.hasta);
    if (f.tipo) q = q.where('gastos.tipo', '=', f.tipo);
    return q.orderBy('gastos.fecha', 'desc').orderBy('gastos.id', 'desc').execute();
  },
};
