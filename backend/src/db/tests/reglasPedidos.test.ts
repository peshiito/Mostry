import type { TiendaId } from '../../shared/db/tiendaId.js';
import type { Updateable } from 'kysely';
import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../shared/db/db.js';
import { idInsertado } from '../../shared/db/idInsertado.js';
import type { PedidosTabla } from '../../shared/db/tipos/pedidos.js';
import { crearPedido, crearTienda } from '../../test/fabricas.js';
import { limpiarBase } from '../../test/limpiarBase.js';

const CHECK = /check constraint/i;

// Migración 0033: reglas del pedido que la base garantiza aunque el código falle.
describe('reglas de pedidos y comprobantes en la base', () => {
  let tiendaId: TiendaId;
  let pedidoId: number;
  const cambiar = (cambios: Updateable<PedidosTabla>) =>
    db.updateTable('pedidos').set(cambios).where('id', '=', pedidoId).execute();

  beforeEach(async () => {
    await limpiarBase();
    tiendaId = await crearTienda('dona-rosa');
    pedidoId = await crearPedido(tiendaId);
  });

  it('un pedido inmediato no puede tener seña', async () => {
    await expect(cambiar({ sena: 100 })).rejects.toThrow(CHECK);
  });

  it('esperando el pago, siempre hay plazo', async () => {
    await expect(cambiar({ venceComprobanteEn: null })).rejects.toThrow(CHECK);
  });

  it('cancelado, siempre con fecha de cancelación', async () => {
    await expect(
      cambiar({ estado: 'cancelado', venceComprobanteEn: null }),
    ).rejects.toThrow(CHECK);
  });

  it('un comprobante aprobado guarda los datos del pago', async () => {
    const id = idInsertado(
      await db
        .insertInto('comprobantes')
        .values({
          tiendaId,
          pedidoId,
          tipo: 'pago',
          archivoClave: 'x',
          archivoTipo: 'jpg',
          estado: 'pendiente',
        })
        .executeTakeFirstOrThrow(),
    );
    const aprobar = db
      .updateTable('comprobantes')
      .set({ estado: 'aprobado' })
      .where('id', '=', id)
      .execute();
    await expect(aprobar).rejects.toThrow(CHECK);
  });
});
