import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { pedido, tiendaLista } from '../../../test/tiendaLista.js';

describe('checkout: lo que se rechaza', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const comprar = (datos: object) => t.comprador.post('/publico/pedidos', datos);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('precio manipulado: 409 con el total real (el servidor manda)', async () => {
    const res = await comprar({
      ...pedido(t.productos, { medialuna: 1 }),
      totalEsperado: 1,
    }).expect(409);
    expect(res.body.error).toMatchObject({
      codigo: 'precio_cambio',
      detalle: { total: 35000 },
    });
    const conPrecio = pedido(t.productos, { medialuna: 1 });
    await comprar({ ...conPrecio, items: [{ ...conPrecio.items[0], precio: 1 }] }).expect(
      400,
    );
  });

  it('sin stock suficiente: 409 y no queda NINGUNA reserva a medias', async () => {
    const res = await comprar(pedido(t.productos, { vigilante: 3, medialuna: 6 })).expect(
      409,
    );
    expect(res.body.error).toMatchObject({
      codigo: 'sin_stock',
      detalle: { productoId: t.productos.medialuna },
    });
    const reservas = await db.selectFrom('productos').select('stockReservado').execute();
    expect(reservas.every((r) => r.stockReservado === 0)).toBe(true);
    expect(await db.selectFrom('pedidos').select('id').execute()).toHaveLength(0);
  });

  it('tienda pausada o cerrada ahora: solo encargos', async () => {
    await db.updateTable('horarios').set({ abre: '00:00', cierra: '00:01' }).execute();
    expect((await comprar(pedido(t.productos, { medialuna: 1 }))).body.error.codigo).toBe(
      'tienda_cerrada_ahora',
    );
    await db.updateTable('tiendas').set({ pausada: true }).execute();
    expect((await comprar(pedido(t.productos, { medialuna: 1 }))).body.error.codigo).toBe(
      'tienda_pausada',
    );
  });
});
