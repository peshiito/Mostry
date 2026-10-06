import { sql } from 'kysely';
import type { Ejecutor } from '../../shared/db/ejecutor.js';
import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import { patronContiene } from '../../shared/db/escaparLike.js';
import type { TiendaId } from '../../shared/db/tiendaId.js';

// Saldo calculado (deudas − pagos): nunca se guarda (sección 5).
const saldo = sql<number>`(SELECT COALESCE(SUM(CASE WHEN m.tipo = 'deuda' THEN m.monto ELSE -m.monto END), 0)
  FROM movimientos_fiado m WHERE m.tienda_id = clientes_libreta.tienda_id AND m.cliente_id = clientes_libreta.id)`;

export const clientesRepo = {
  listar: (tiendaId: TiendaId, buscar?: string, incluirInactivos = false) => {
    let q = db
      .selectFrom('clientesLibreta')
      .select(['id', 'nombre', 'telefono', 'activo', saldo.as('saldo')])
      .where('tiendaId', '=', tiendaId);
    if (!incluirInactivos) q = q.where('activo', '=', true);
    if (buscar) q = q.where('nombre', 'like', patronContiene(buscar));
    return q.orderBy('nombre').execute();
  },

  // Con tx, bloquea al cliente: dos pagos a la vez no calculan el mismo saldo.
  buscar: (tiendaId: TiendaId, id: number, tx?: Ejecutor) => {
    const q = (tx ?? db)
      .selectFrom('clientesLibreta')
      .select(['id', 'nombre', 'telefono', 'activo', saldo.as('saldo')])
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id);
    return (tx ? q.forUpdate() : q).executeTakeFirst();
  },

  async crear(tiendaId: TiendaId, nombre: string, telefono: string | null) {
    return idInsertado(
      await db
        .insertInto('clientesLibreta')
        .values({ tiendaId, nombre, telefono })
        .executeTakeFirstOrThrow(),
    );
  },

  actualizar: (
    tiendaId: TiendaId,
    id: number,
    cambios: { nombre?: string; telefono?: string | null; activo?: boolean },
  ) =>
    db
      .updateTable('clientesLibreta')
      .set(cambios)
      .where('tiendaId', '=', tiendaId)
      .where('id', '=', id)
      .execute(),

  movimientos: (tiendaId: TiendaId, clienteId: number) =>
    db
      .selectFrom('movimientosFiado')
      .select(['id', 'tipo', 'monto', 'detalle', 'fecha'])
      .where('tiendaId', '=', tiendaId)
      .where('clienteId', '=', clienteId)
      .orderBy('fecha', 'desc')
      .orderBy('id', 'desc')
      .execute(),
};
