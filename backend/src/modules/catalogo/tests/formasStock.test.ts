import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { stockDe } from '../../../test/flujoPedido.js';
import { tiendaConFormas } from '../../../test/formasStock.js';
import { pedido } from '../../../test/tiendaLista.js';

describe('formas de stock en el catálogo', () => {
  let t: Awaited<ReturnType<typeof tiendaConFormas>>;

  beforeEach(async () => {
    t = await tiendaConFormas();
  });

  it('el comprador ve "disponible" según la forma, nunca el stock', async () => {
    const { body } = await t.comprador.get('/publico/productos').expect(200);
    const de = (id: number) => body.productos.find((p: { id: number }) => p.id === id);
    expect(de(t.pan)).toMatchObject({ disponible: true, soloEncargo: false });
    expect(de(t.torta)).toMatchObject({ disponible: false, soloEncargo: true });
    expect(de(t.pan).stock).toBeUndefined();
  });

  it('lo que se hace a pedido no puede dejar de encargarse', async () => {
    const r = await t.panel.patch(`/panel/productos/${t.torta}`, {
      aceptaEncargo: false,
    });
    expect(r.status).toBe(409);
    expect(r.body.error.codigo).toBe('a_pedido_sin_encargo');
  });

  it('si cambia de forma con pedidos reservados, la reserva se libera igual', async () => {
    const m = t.productos.medialuna;
    await t.comprador
      .post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }))
      .expect(201);
    await t.panel.patch(`/panel/productos/${m}`, { modoStock: 'simple' }).expect(200);
    const { id } = await db.selectFrom('pedidos').select('id').executeTakeFirstOrThrow();
    await t.panel.post(`/panel/pedidos/${id}/cancelar`, { motivo: 'Prueba' }).expect(200);
    expect((await stockDe(m)).stockReservado).toBe(0);
  });
});
