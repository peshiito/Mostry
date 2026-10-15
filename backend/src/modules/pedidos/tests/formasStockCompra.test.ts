import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { stockDe } from '../../../test/flujoPedido.js';
import { compra, enDias, tiendaConFormas } from '../../../test/formasStock.js';

// Formas de stock (Mejoras 3): "hay / no hay" y "a pedido" no cuentan unidades.
describe('formas de stock en la compra', () => {
  let t: Awaited<ReturnType<typeof tiendaConFormas>>;

  beforeEach(async () => {
    t = await tiendaConFormas();
  });

  it('"hay / no hay": se vende sin contar ni reservar; en "no hay" no se vende', async () => {
    await t.comprador.post('/publico/pedidos', compra(t.pan, 30, 200000)).expect(201);
    expect(await stockDe(t.pan)).toEqual({ stock: 0, stockReservado: 0 });
    const item = await db
      .selectFrom('pedidoItems')
      .select('reservo')
      .executeTakeFirstOrThrow();
    expect(Boolean(item.reservo)).toBe(false);
    await t.panel.patch(`/panel/productos/${t.pan}`, { agotado: true }).expect(200);
    const r = await t.comprador.post('/publico/pedidos', compra(t.pan, 1, 200000));
    expect(r.status).toBe(409);
    expect(r.body.error.codigo).toBe('sin_stock');
  });

  it('"a pedido": no se compra al toque, sí se encarga', async () => {
    const r = await t.comprador.post('/publico/pedidos', compra(t.torta, 1, 3000000));
    expect(r.status).toBe(409);
    expect(r.body.error.codigo).toBe('solo_encargo');
    const encargo = compra(t.torta, 1, 3000000, {
      tipo: 'encargo',
      fechaEncargo: enDias(3),
    });
    await t.comprador.post('/publico/pedidos', encargo).expect(201);
  });
});
