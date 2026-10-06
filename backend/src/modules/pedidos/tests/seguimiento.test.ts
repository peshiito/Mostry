import { beforeEach, describe, expect, it } from 'vitest';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('seguimiento del pedido (link único)', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('el seguimiento muestra el pedido; un token inventado o de otra tienda, no', async () => {
    const { token } = (
      await t.comprador.post('/publico/pedidos', pedido(t.productos, { medialuna: 1 }))
    ).body;
    const seg = await t.comprador.get(`/publico/pedidos/${token}`).expect(200);
    expect(seg.body).toMatchObject({
      numero: 1,
      estado: 'pendiente_pago',
      items: [{ nombre: 'Medialuna', cantidad: 1 }],
    });
    expect(seg.body.pago.alias).toBe('dona.rosa.mp');
    await t.comprador.get(`/publico/pedidos/${'A'.repeat(43)}`).expect(404);
    await t.comprador.get('/publico/pedidos/corto').expect(400);
  });
});
