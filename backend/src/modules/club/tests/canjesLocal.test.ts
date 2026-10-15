import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../../shared/db/db.js';
import { clubTienda, darSellos } from '../../../test/clubTienda.js';

// Lealtad L4: usar premios en la venta rápida del local.
describe('club: premios en el local', () => {
  let t: Awaited<ReturnType<typeof clubTienda>>;
  const vender = async (premio: number, monto = 80_000) =>
    t.panel.post('/panel/caja/ventas', {
      medio: 'transferencia',
      suelto: { monto },
      fichaClub: await t.ficha(),
      premio,
    });
  const saldo = async () =>
    (await t.panel.post('/panel/club/identificar', { codigo: await t.qr() })).body.sellos;

  beforeEach(async () => {
    t = await clubTienda();
  });

  it('el regalo no descuenta, gasta los sellos y la compra suma el primero nuevo', async () => {
    await darSellos(3);
    const { status, body } = await vender(3);
    expect(status).toBe(201);
    expect(body).toMatchObject({ total: 80_000, descuento: 0, sello: true });
    expect(await saldo()).toBe(1);
  });

  it('dos canjes a la vez con los mismos sellos: solo uno pasa', async () => {
    await darSellos(2);
    const [a, b] = await Promise.all([vender(2), vender(2)]);
    expect([a.status, b.status].sort()).toEqual([201, 409]);
    const canjes = await db.selectFrom('canjes').selectAll().execute();
    expect(canjes).toHaveLength(1);
    expect(canjes[0]!.descuento).toBe(30_000);
  });

  it('los sellos vencidos no cuentan', async () => {
    await t.panel.put('/panel/club', {
      ...(await import('../../../test/clubTienda.js')).programaTest,
      venceMeses: 1,
    });
    await darSellos(2, new Date(Date.now() - 62 * 86_400_000));
    expect(await saldo()).toBe(0);
    expect((await vender(2)).body.error.codigo).toBe('sellos_insuficientes');
  });

  it('premio sin cliente identificado: 400', async () => {
    await t.panel
      .post('/panel/caja/ventas', {
        medio: 'efectivo',
        suelto: { monto: 100 },
        premio: 2,
      })
      .expect(400);
  });
});
