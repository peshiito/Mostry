import { beforeEach, describe, expect, it } from 'vitest';
import { appConCuenta } from '../../../test/appConCuenta.js';

describe('gastos y proveedores', () => {
  let p: Awaited<ReturnType<typeof appConCuenta>>['panel'];
  let molino: number;

  beforeEach(async () => {
    ({ panel: p } = await appConCuenta());
    molino = (
      await p
        .post('/panel/proveedores', {
          nombre: 'Molino Harinero',
          contacto: '11 4444-5555',
        })
        .expect(201)
    ).body.id;
  });

  it('un gasto genera su egreso en caja; la ganancia real lo descuenta', async () => {
    await p.post('/panel/caja/movimientos', {
      tipo: 'ingreso',
      medio: 'transferencia',
      monto: 1_000_000,
      concepto: 'ventas',
    });
    const g = await p
      .post('/panel/gastos', {
        tipo: 'gasto',
        monto: 250_000,
        medio: 'transferencia',
        proveedorId: molino,
        detalle: 'Harina 0000',
      })
      .expect(201);
    expect(g.body).toMatchObject({ tipo: 'gasto', monto: 250_000 });
    const r = (await p.get('/panel/caja/resumen')).body;
    expect(r).toMatchObject({ egresos: 250_000, gastos: 250_000, gananciaReal: 750_000 });
    expect(r.movimientos[0]).toMatchObject({
      origen: 'gasto',
      concepto: 'Gasto a Molino Harinero: Harina 0000',
    });
    expect((await p.get('/panel/gastos')).body[0]).toMatchObject({
      proveedor: 'Molino Harinero',
      monto: 250_000,
    });
  });

  it('en efectivo exige la caja abierta: si no, no se registra NADA', async () => {
    const res = await p
      .post('/panel/gastos', { tipo: 'gasto', monto: 1000, medio: 'efectivo' })
      .expect(409);
    expect(res.body.error.codigo).toBe('caja_cerrada');
    expect((await p.get('/panel/gastos')).body).toEqual([]);
  });
});
