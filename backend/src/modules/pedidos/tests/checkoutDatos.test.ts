import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('checkout: datos inválidos', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = (datos: object) => t.comprador.post('/publico/pedidos', datos);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('datos inválidos: envío sin dirección, link de Maps trucho, entrega no ofrecida', async () => {
    await comprar(pedido(t.productos, { medialuna: 1 }, { entrega: 'envio' })).expect(
      400,
    );
    const trucho = {
      entrega: 'envio',
      direccion: 'Calle 123',
      linkMaps: 'javascript:alert(1)',
    };
    await comprar(pedido(t.productos, { medialuna: 1 }, trucho)).expect(400);
    await db.updateTable('tiendas').set({ aceptaRetiro: false }).execute();
    expect((await comprar(pedido(t.productos, { medialuna: 1 }))).body.error.codigo).toBe(
      'entrega_no_disponible',
    );
  });

  it('producto de otra tienda o inexistente: 409 producto_no_disponible', async () => {
    const res = await comprar({
      ...pedido(t.productos, { medialuna: 1 }),
      items: [{ productoId: 99999, cantidad: 1 }],
    });
    expect(res.body.error.codigo).toBe('producto_no_disponible');
  });
});
