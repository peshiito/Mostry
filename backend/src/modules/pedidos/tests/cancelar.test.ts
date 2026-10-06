import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { crearCuentaCompleta } from '../../../test/flujoAuth.js';
import { panel } from '../../../test/panel.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('panel: cancelar pedidos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  let id: number;
  const reservado = async () =>
    (
      await db
        .selectFrom('productos')
        .select('stockReservado')
        .where('id', '=', t.productos.medialuna)
        .executeTakeFirstOrThrow()
    ).stockReservado;

  beforeEach(async () => {
    t = await tiendaLista();
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 3 }))
      .expect(201);
    id = (await db.selectFrom('pedidos').select('id').executeTakeFirstOrThrow()).id;
  });

  it('cancelar libera la reserva; no se puede cancelar dos veces', async () => {
    expect(await reservado()).toBe(3);
    const res = await t.panel
      .post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Lo pidió el cliente' })
      .expect(200);
    expect(res.body).toMatchObject({
      estado: 'cancelado',
      motivoCancelacion: 'Lo pidió el cliente',
      habiaPago: false,
    });
    expect(await reservado()).toBe(0);
    await t.panel
      .post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Otra vez' })
      .expect(409);
  });

  it('el motivo es obligatorio y otra tienda no puede tocar el pedido', async () => {
    await t.panel.post(`/panel/pedidos/${id}/cancelar`, {}).expect(400);
    const martin = await crearCuentaCompleta(t.app, t.correo, 'heladeria');
    const ajeno = panel(t.app, 'heladeria', martin.cookie);
    await ajeno.post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Sabotaje' }).expect(404);
    await ajeno.get(`/panel/pedidos/${id}`).expect(404);
    expect(await reservado()).toBe(3);
  });
});
