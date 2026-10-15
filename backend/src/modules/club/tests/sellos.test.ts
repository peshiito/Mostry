import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { club } from '../../../test/clubListo.js';
import { clubTienda } from '../../../test/clubTienda.js';

// Lealtad L3: las compras online del cliente del club suman sellos al entregarse.
describe('club: sellos de compras online', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;
  const sellos = () => db.selectFrom('sellos').selectAll().execute();

  beforeEach(async () => {
    t = await clubTienda();
  });

  it('el pedido queda a su nombre y suma un sello recién al entregarse', async () => {
    const { id } = await t.comprar({ medialuna: 2 }, false);
    const fila = await db
      .selectFrom('pedidos')
      .select('clienteId')
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
    expect(fila.clienteId).not.toBeNull();
    expect(await sellos()).toHaveLength(0);
    await t.comprar({ medialuna: 2 });
    expect(await sellos()).toHaveLength(1);
  });

  it('no suma si no llega al mínimo, ni si el club está apagado', async () => {
    await t.comprar({ medialuna: 1 });
    await t.panel.patch('/panel/club/activo', { activo: false });
    await t.comprar({ medialuna: 2 });
    expect(await sellos()).toHaveLength(0);
  });

  it('sin la cookie del club es una compra común', async () => {
    const { pedido } = await import('../../../test/tiendaLista.js');
    await t.comprador.post('/publico/pedidos', pedido(t.productos, { medialuna: 2 }));
    const filas = await db.selectFrom('pedidos').select('clienteId').execute();
    expect(filas.map((f) => f.clienteId)).toEqual([null]);
  });

  it('Mis tiendas muestra la tarjeta con su saldo', async () => {
    await t.comprar({ medialuna: 2 });
    const { body } = await club(t.app, t.ana.cookie).get('/tiendas').expect(200);
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({ slug: 'dona-rosa', nombre: 'Club Rosa', sellos: 1 });
    expect(body[0].premios).toHaveLength(2);
  });
});
