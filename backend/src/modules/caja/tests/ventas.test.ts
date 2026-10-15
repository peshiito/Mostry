import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { stockDe } from '../../../test/flujoPedido.js';
import { tiendaLista } from '../../../test/tiendaLista.js';

// Venta rápida en el local (Mejoras 3, parte C).
describe('caja: venta rápida', () => {
  let t: Awaited<ReturnType<typeof tiendaLista>>;
  const vender = (d: object) => t.panel.post('/panel/caja/ventas', d);

  beforeEach(async () => {
    t = await tiendaLista();
  });

  it('cobra con los precios del servidor, descuenta stock y entra a la caja', async () => {
    const venta = {
      items: [{ productoId: t.productos.medialuna, cantidad: 2 }],
      suelto: { monto: 50000, concepto: 'Bolsa' },
      medio: 'efectivo',
    };
    expect((await vender(venta)).body.error.codigo).toBe('caja_cerrada');
    await t.panel.post('/panel/caja/abrir', { montoApertura: 0 }).expect(201);
    const { body } = await vender(venta).expect(201);
    expect(body).toMatchObject({ numero: 1, total: 2 * 35000 + 50000 });
    expect((await stockDe(t.productos.medialuna)).stock).toBe(3);
    const mov = await db
      .selectFrom('movimientosCaja')
      .selectAll()
      .executeTakeFirstOrThrow();
    expect(mov).toMatchObject({ origen: 'venta', origenId: body.id, monto: body.total });
    const items = [{ productoId: t.productos.medialuna, cantidad: 1, precio: 1 }];
    await vender({ items, medio: 'efectivo' }).expect(400); // precios del navegador: no
  });

  it('no vende más de lo que hay ni deja nada a medias', async () => {
    const r = await vender({
      items: [{ productoId: t.productos.medialuna, cantidad: 6 }],
      medio: 'transferencia',
    });
    expect(r.status).toBe(409);
    expect(r.body.error.message ?? r.body.error.mensaje).toMatch(/te quedan 5/);
    expect(await db.selectFrom('ventas').selectAll().execute()).toHaveLength(0);
  });

  it('por transferencia entra aunque la caja esté cerrada y suma lo más vendido', async () => {
    const v = {
      items: [{ productoId: t.productos.vigilante, cantidad: 3 }],
      medio: 'transferencia',
    };
    await vender(v).expect(201);
    await vender(v).expect(201);
    const { body } = await t.panel.get('/panel/caja/ventas').expect(200);
    expect(body.ventas).toHaveLength(2);
    expect(body.masVendidos[0]).toMatchObject({ nombre: 'Vigilante', cantidad: 6 });
    expect(body.total).toBe(2 * 3 * 40000);
  });
});
